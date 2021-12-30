// webworker.js

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.data`, `.json`,
// and `.wasm` files as well:
importScripts("https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js");

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
  });
}
let pyodideReadyPromise = loadPyodideAndPackages();

async function setup_function() {
    await pyodideReadyPromise;
    


    let code = `
import sys, io, traceback
namespace = {}  # use separate namespace to hide run_code, modules, etc.
def run_code(code):
    """run specified code and return stdout and stderr"""
    out = io.StringIO()
    oldout = sys.stdout
    olderr = sys.stderr
    sys.stdin = io.StringIO(inp)
    sys.stdout = sys.stderr = out
    try:
        # change next line to exec(code, {}) if you want to clear vars each time
        exec(code, {})

    except:
        traceback.print_exc()

    sys.stdout = oldout
    sys.stderr = olderr
    return out.getvalue()
    `
    self.pyodide.runPythonAsync(code);
}

let setup = setup_function()

self.onmessage = async (event) => {
  // make sure loading is done

  const { python, stdin, onlyChecking} = event.data;
  await pyodideReadyPromise;

  if (onlyChecking) {
    self.postMessage({ ready: true })
    return;
  }

  await setup;
  // Don't bother yet with this line, suppose our API is built in such a way:
  
  // The worker copies the context in its own "memory" (an object mapping name to values)
  // Now is the easy part, the one that is similar to working in the main thread:
  
  try {
    await self.pyodide.loadPackagesFromImports(python);
    // let results = await self.pyodide.runPythonAsync(python);

    self.pyodide.globals.code_to_run = python
    self.pyodide.globals.inp = stdin
    let results = await self.pyodide.runPythonAsync('run_code(code_to_run)')
    self.postMessage({ results: results });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};