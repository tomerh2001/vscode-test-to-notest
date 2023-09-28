import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { findTestFileOrItsCounterpart } from '../../out/extension';  // Assuming you have exported this function for testing.

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Starting all tests.');

    test('Find test file or its counterpart', () => {
        const testFilePath = path.resolve(vscode.workspace.rootPath!, 'sample.ts');
        const testTestFilePath = findTestFileOrItsCounterpart(testFilePath);

        assert.strictEqual(
            testTestFilePath, 
            path.resolve(vscode.workspace.rootPath!, 'tests/sample.ts/sample.test.ts')
        );
    });

    // Add other tests as necessary
});
