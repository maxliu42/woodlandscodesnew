class CodeEditor extends HTMLDivElement {
  constructor() {
    super();
    this.editor = null;
    this.outputDiv = null;
    this.inputDiv = null;
    this.runButton = null;
    this.restartButton = null;
    this.initialized = false;
    this.skulptInitialized = false;
  }

  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;

    // Get initial content and input if provided
    const content = this.textContent.trim();
    const [code, inputs] = content.split("#####").map((s) => s.trim());
    this.textContent = ""; // Clear the original content

    this.setupEditor(code);
    this.setupInputOutput(inputs);

    // Initial load of Skulpt
    this.loadSkulpt().catch((error) => {
      console.error("Failed to load Skulpt:", error);
    });
  }

  setupEditor(initialCode) {
    // Create main container
    const mainContainer = document.createElement("div");
    mainContainer.className = "editor-container";

    // Create controls container
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "controls-container";

    // Create Run button
    this.runButton = document.createElement("button");
    this.runButton.textContent = "Run";
    this.runButton.className = "btn btn-primary";

    // Create Restart button
    this.restartButton = document.createElement("button");
    this.restartButton.textContent = "Restart Python";
    this.restartButton.className = "btn btn-danger";

    // Add button event listeners
    this.runButton.addEventListener("click", () => this.runCode());
    this.restartButton.addEventListener("click", () => this.loadSkulpt());

    // Set up Ace Editor
    const editorDiv = document.createElement("div");
    editorDiv.className = "editor";

    // Initialize Ace Editor
    this.editor = ace.edit(editorDiv);
    this.editor.setTheme("ace/theme/monokai");
    this.editor.session.setMode("ace/mode/python");
    this.editor.setOptions({
      fontSize: "16px",
      showPrintMargin: false,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    });

    if (initialCode) {
      this.editor.setValue(initialCode, -1);
    }

    // Add elements to the main container
    controlsContainer.appendChild(this.runButton);
    controlsContainer.appendChild(this.restartButton);
    mainContainer.appendChild(controlsContainer);
    mainContainer.appendChild(editorDiv);

    // Add the main container to the DOM
    this.appendChild(mainContainer);
  }

  setupInputOutput(initialInput) {
    const ioContainer = document.createElement("div");
    ioContainer.className = "input-output-container";

    // Create input container
    const inputContainer = document.createElement("div");
    inputContainer.className = "input-container";
    this.inputDiv = document.createElement("textarea");
    this.inputDiv.className = "input";
    this.inputDiv.placeholder = "Program input (one value per line)";
    if (initialInput) {
      this.inputDiv.value = initialInput;
    }
    inputContainer.appendChild(this.inputDiv);

    // Create output container
    this.outputDiv = document.createElement("div");
    this.outputDiv.className = "output-container";

    ioContainer.appendChild(inputContainer);
    ioContainer.appendChild(this.outputDiv);

    // Add to the existing editor container instead of creating a new one
    this.querySelector(".editor-container").appendChild(ioContainer);
  }

  loadSkulpt() {
    // If Skulpt is already loaded, just reinitialize it
    if (window.Sk) {
      this.initializeSkulpt();
      return Promise.resolve();
    }

    // Only load scripts if they haven't been loaded yet
    if (!document.querySelector('script[src*="skulpt.min.js"]')) {
      const skulptScript = document.createElement("script");
      skulptScript.src = "https://skulpt.org/js/skulpt.min.js";
      document.head.appendChild(skulptScript);

      const skulptStdLibScript = document.createElement("script");
      skulptStdLibScript.src = "https://skulpt.org/js/skulpt-stdlib.js";
      document.head.appendChild(skulptStdLibScript);

      return Promise.all([
        new Promise((resolve) => (skulptScript.onload = resolve)),
        new Promise((resolve) => (skulptStdLibScript.onload = resolve)),
      ]).then(() => {
        this.initializeSkulpt();
      });
    }

    return Promise.resolve();
  }

  initializeSkulpt() {
    if (!window.Sk) {
      console.error("Skulpt not loaded yet");
      return;
    }

    this.skulptInitialized = true;
    this.runButton.disabled = false;
  }

  async runCode() {
    this.outputDiv.textContent = "";
    this.runButton.disabled = true;

    try {
      // Make sure Skulpt is loaded and initialized
      if (!this.skulptInitialized) {
        await this.loadSkulpt();
      }

      const code = this.editor.getValue();
      const inputs = this.inputDiv.value.split("\n").filter((x) => x);
      let inputIndex = 0;

      // Configure Skulpt just before running the code
      Sk.configure({
        output: (text) => {
          this.outputDiv.textContent += text;
        },
        read: (filename) => {
          if (
            Sk.builtinFiles === undefined ||
            Sk.builtinFiles["files"][filename] === undefined
          ) {
            throw new Error(`File not found: ${filename}`);
          }
          return Sk.builtinFiles["files"][filename];
        },
        inputfun: () => {
          if (inputIndex >= inputs.length) {
            throw new Error("Not enough input values provided");
          }
          return Promise.resolve(inputs[inputIndex++]);
        },
        __future__: Sk.python3,
      });

      const programPromise = Sk.misceval.asyncToPromise(() => {
        return Sk.importMainWithBody("<stdin>", false, code, true);
      });

      await programPromise;
    } catch (error) {
      this.outputDiv.textContent += `\nError: ${error.toString()}`;
    } finally {
      this.runButton.disabled = false;
    }
  }
}

// Register the custom element
customElements.define("code-editor", CodeEditor, { extends: "div" });
