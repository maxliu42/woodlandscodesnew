// Load Pyodide and initialize it
let pyodide = null;
let initialized = false;
let initializePromise = null;

// Initialize Pyodide
async function initialize() {
  if (initializePromise) {
    return initializePromise;
  }

  initializePromise = (async () => {
    try {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js");
      pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
      });
      initialized = true;
      self.postMessage({ type: "ready" });
    } catch (error) {
      initialized = false;
      self.postMessage({
        type: "error",
        error: `Failed to initialize Pyodide: ${error.message}`,
      });
      throw error;
    }
  })();

  return initializePromise;
}

// Handle messages from the main thread
self.onmessage = async function (e) {
  const { type, id, code, inputs } = e.data;

  if (type === "init") {
    try {
      await initialize();
    } catch (error) {
      console.error("Initialization failed:", error);
    }
    return;
  }

  if (type === "run") {
    if (!initialized) {
      self.postMessage({
        type: "error",
        id,
        error: "Pyodide not initialized. Please try restarting Python.",
      });
      return;
    }

    try {
      // Set up Python environment with output capture
      await pyodide.runPython(`
import sys

__output = []
def __print(*args, sep=' ', end='\\n'):
    text = sep.join(map(str, args)) + end
    __output.append(text)

# Override built-in print
__builtins__.print = __print
      `);

      // Set up input handling
      pyodide.globals.set("__input_values", inputs || []);
      pyodide.globals.set("__input_index", 0);

      // Override Python's input() function
      await pyodide.runPython(`
def input(prompt=""):
    if prompt:
        print(prompt, end='')
    global __input_values, __input_index
    if __input_index >= len(__input_values):
        raise EOFError("Not enough input values provided")
    value = __input_values[__input_index]
    __input_index += 1
    return value
      `);

      // Run the user's code
      await pyodide.runPython(code);

      // Get the accumulated output
      const output = await pyodide.runPython("''.join(__output)");

      // Send the captured output back
      self.postMessage({ 
        type: "success", 
        id, 
        output: output 
      });

    } catch (error) {
      self.postMessage({
        type: "error",
        id,
        error: error.toString(),
      });
    }
  }
};
