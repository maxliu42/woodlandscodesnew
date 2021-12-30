var pyodideWorker = new Worker("/assets/js/webworker.js");

export function run(script, stdin, onSuccess, onError) {
    pyodideWorker.onerror = onError;
    pyodideWorker.onmessage = (e) => onSuccess(e.data);
    pyodideWorker.postMessage({
        python: script,
        stdin: stdin,
    });
}

export function asyncRun(script, stdin) {
    return new Promise(function (onSuccess, onError) {
        run(script, stdin, onSuccess, onError);
    });
}

export function asyncTerminate() {
    pyodideWorker.terminate()
    pyodideWorker = new Worker("/assets/js/webworker.js");
}


export function asyncCheckReady() {
    return new Promise(function(onSuccess) {
        checkReady(onSuccess);
    })
}

export function checkReady(onSuccess) {
    pyodideWorker.onmessage = (e) => onSuccess(e.data);
    pyodideWorker.postMessage({
        onlyChecking: true,
    });
}