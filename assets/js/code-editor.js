class CodeEditor extends HTMLDivElement {
    constructor() {
        super();

        let id = this.getAttribute('id');

        this.setAttribute("class", "editor-container p-3 pt-0")

        let code_and_input = this.innerHTML.trim();
        let code = '';
        let input = '';

        if (!code_and_input.includes('#####')) {
            code = code_and_input;
        } else {
            code_and_input = code_and_input.split('#####');
            code = code_and_input[0].trim();
            input = code_and_input[1].trim();
        }

        this.innerHTML = `
        <button id="run-button-${id}" class="btn btn-primary my-3">Run</button>
        <button id="terminate-button-${id}" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Clicking this will restart the Python interpreter, so be careful! Only do this if your program is taking too long to run." class="btn btn-danger my-3 ms-2">Restart Python</button>
        <div class="editor" id="ace-editor-${id}">${code}</div>
        <div class="mt-3 input-output-container">
            <div data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-original-title="Input" class="d-block position-relative input-container">
                <textarea id="input-${id}" class="input">${input}</textarea>
            </div>
            <div id="output-${id}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-original-title="Output" class="output-container">
    
            </div>
        </div>
        `

        const editor = ace.edit(`ace-editor-${id}`);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/python");


        document.getElementById(`run-button-${id}`).onclick = async () => {
            await runPython(editor.getValue(), `input-${id}`, `output-${id}`);
        };

        document.getElementById(`terminate-button-${id}`).onclick = async () => {
            await terminatePyodide();
        };
    }
}



customElements.define('code-editor', CodeEditor, { extends: "div" });

import { asyncRun, asyncTerminate, asyncCheckReady } from "/assets/js/py-worker.js";

async function checkReady() {
    const { ready } = await asyncCheckReady();
    readyToast.show()    
}

async function main() {
    loadingToast.show();
    await checkReady();
    loadingToast.hide();
}

main();


async function runPython(script, input_id, output_id) {
    let stdin = document.getElementById(input_id).value;
    try {
        const { results, error } = await asyncRun(script, stdin);
        if (results !== undefined) {

            document.getElementById(output_id).innerText = results;
        } else if (error) {
            document.getElementById(output_id).innerText = error;
        }
    } catch (e) {
        document.getElementById(output_id).innerText = e.message
    }
}

async function terminatePyodide() {
    asyncTerminate();
    loadingToast.show()    
    await checkReady();
    loadingToast.hide();
}




// Uncomment the below lines to use Skulpt

// function outf(text) {
//     const output_element = document.getElementById("output");
//     output_element.innerText = output_element.innerText + text;
// }


// var current_inp = 0;

// function get_input(prompt) {
//     return new Promise((resolve, reject) => {
//         let input = document.getElementById('input-tmp').value.trim().split(/\r?\n/);
//         if (input[0] == '') {
//             input = [];
//         }
//         if (current_inp >= input.length) {
//             throw "Place your input(s) in the \"input\" box!";
//         }
//         resolve(input[current_inp]);
//         current_inp++;
//     })
// }

// function runit() {
//     var prog = editor.getValue();
//     current_inp = 0;
//     var output_element = document.getElementById("output");
//     output_element.innerText = '';
//     Sk.pre = "output";
//     Sk.configure({ 
//         output: outf, 
//         inputfun: get_input, 
//         inputfunTakesPrompt: true, 
//         execLimit: 1000,
//         __future__: Sk.python3
//     });
//     var myPromise = Sk.misceval.asyncToPromise(function () {
//         return Sk.importMainWithBody("<stdin>", false, prog, true);
//     });
//     myPromise.then(function (mod) {

//     },
//         function (err) {
//             output_element.innerText = err.toString();
//         });
// }


// Uncomment below lines to use the old implementation of Pyodide

// async function setup_pyodide() {
//     // setup pyodide environment to run code blocks as needed
//     let pyodide = await pyodideReadyPromise;
//     var setup_code = `
// import sys, io, traceback
// import signal



// from js import document, console
// namespace = {}  # use separate namespace to hide run_code, modules, etc.
// def run_code(code):
//     """run specified code and return stdout and stderr"""
//     out = io.StringIO()
//     sys.stdin = io.StringIO(document.getElementById('input-tmp').value)
//     oldout = sys.stdout
//     olderr = sys.stderr
//     sys.stdout = sys.stderr = out
//     try:
//         # change next line to exec(code, {}) if you want to clear vars each time

//         class Timeout(Exception):
//             pass

//         def handler(sig, frame):
//             raise Timeout

//         signal.signal(signal.SIGALRM, handler)  # register interest in SIGALRM events

//         signal.alarm(2)  # timeout in 2 seconds
//         try:
//             exec(code, {})
//         except Timeout:
//             print('Your code took too much time to run!')

//     except:
//         traceback.print_exc()

//     sys.stdout = oldout
//     sys.stderr = olderr
//     return out.getvalue()
// `
//     pyodide.runPython(setup_code)
// }

// async function runPython() {
//     // run code currently stored in editor
//     let pyodide = await pyodideReadyPromise;
//     pyodide.globals.code_to_run = editor.getValue()
//     document.getElementById("output").innerText = pyodide.runPython('run_code(code_to_run)')
// }

// async function get_pyodide() {
//     let pyodide = await loadPyodide({
//         indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/",
//     });
//     return pyodide;

// }

// let pyodideReadyPromise = get_pyodide();

// pyodideReadyPromise.then(setup_pyodide)