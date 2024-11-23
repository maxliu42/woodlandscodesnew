class CodeEditor extends HTMLDivElement {
  constructor() {
    super();
    this.editor = null;
    this.outputDiv = null;
    this.inputDiv = null;
    this.runButton = null;
    this.restartButton = null;
    this.initialized = false;
    this.worker = null;
    this.currentRunId = 0;
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
    this.initializePyodide();
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
    this.runButton.disabled = true;

    // Create Restart button
    this.restartButton = document.createElement("button");
    this.restartButton.textContent = "Restart Python";
    this.restartButton.className = "btn btn-danger";
    this.restartButton.disabled = true;

    // Add button event listeners
    this.runButton.addEventListener("click", () => this.runCode());
    this.restartButton.addEventListener("click", () => this.initializePyodide());

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
    const outputContainer = document.createElement("div");
    outputContainer.className = "output-container";
    this.outputDiv = document.createElement("pre");
    this.outputDiv.className = "output";
    outputContainer.appendChild(this.outputDiv);

    ioContainer.appendChild(inputContainer);
    ioContainer.appendChild(outputContainer);

    // Add to the existing editor container
    this.querySelector(".editor-container").appendChild(ioContainer);
  }

  initializePyodide() {
    // Terminate existing worker if any
    if (this.worker) {
      this.worker.terminate();
    }

    this.runButton.disabled = true;
    this.restartButton.disabled = true;
    this.outputDiv.textContent = "Initializing Python...";

    // Create new worker
    this.worker = new Worker("/assets/js/py-worker.js");

    this.worker.onmessage = (event) => {
      const { type, error, output, id } = event.data;

      if (type === "ready") {
        this.runButton.disabled = false;
        this.restartButton.disabled = false;
        this.outputDiv.textContent = "Python ready!";
      } else if (type === "error") {
        if (error.includes("Pyodide")) {
          this.outputDiv.textContent = "Failed to initialize Python. Please try again.";
        } else {
          this.outputDiv.textContent = error;
        }
        this.runButton.disabled = false;
        this.restartButton.disabled = false;
      } else if (type === "success" && id === this.currentRunId) {
        this.outputDiv.textContent = output;
        this.runButton.disabled = false;
      }
    };

    // Initialize the worker
    this.worker.postMessage({ type: "init" });
  }

  runCode() {
    this.runButton.disabled = true;
    this.outputDiv.textContent = "Running...";

    const code = this.editor.getValue();
    const inputs = this.inputDiv.value.split("\n").filter(x => x);
    this.currentRunId++;

    this.worker.postMessage({
      type: "run",
      id: this.currentRunId,
      code,
      inputs
    });
  }
}

// Register the custom element
customElements.define("code-editor", CodeEditor, { extends: "div" });
