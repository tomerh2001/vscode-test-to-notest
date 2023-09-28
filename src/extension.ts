const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function findTestFileOrItsCounterpart(filePath: string) {
    let isTestFile = filePath.includes('.test.');
    let dirname = path.dirname(filePath);
    let extname = path.extname(filePath);
    let basename = path.basename(filePath, extname);

    let testPaths = isTestFile ? [
        path.join(vscode.workspace.rootPath, filePath.replace(/\.test\./, '.')),
        path.join(dirname, basename.replace(/\.test\./, '.') + extname)
    ] : [
        path.join(vscode.workspace.rootPath, 'tests', filePath, basename + '.test' + extname),
        path.join(dirname, 'tests', basename + '.test' + extname),
        path.join(dirname, basename + '.test' + extname)
    ];

    for (let p of testPaths) {
        if (fs.existsSync(p)) {
            return p;
        }
    }

    // Default to the first test path if none exists (for creation).
    return testPaths[0];
}

function switchToTestOrCounterpart() {
    let editor = vscode.window.activeTextEditor;
    if (!editor) return;

    let currentFilePath = editor.document.uri.fsPath;
    let targetPath = findTestFileOrItsCounterpart(currentFilePath);

    if (!fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, ''); // Create an empty file
    }

    vscode.workspace.openTextDocument(targetPath).then((doc: any) => {
        vscode.window.showTextDocument(doc);
    });
}

module.exports = {
    activate(context: { subscriptions: any[]; }) {
        let disposable = vscode.commands.registerCommand('extension.switchToTestOrCounterpart', switchToTestOrCounterpart);
        context.subscriptions.push(disposable);
    },
    deactivate() {}
};
