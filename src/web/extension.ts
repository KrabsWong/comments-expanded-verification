'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// A `CommentController` is able to provide comments for documents.
	const commentController = vscode.comments.createCommentController('comment-sample', 'Comment API Sample');
	context.subscriptions.push(commentController);

	// A `CommentingRangeProvider` controls where gutter decorations that allow adding comments are shown
	commentController.commentingRangeProvider = {
		provideCommentingRanges: (document: vscode.TextDocument, token: vscode.CancellationToken) => {
			const lineCount = document.lineCount;
			return [new vscode.Range(0, 0, lineCount - 1, 0)];
		}
	};

	vscode.commands.registerCommand('test-comment-insert-commet', () => {
		[{
			lineStart: 1,
			lineEnd: 1,
			body: 'Test CommentThreadCollapsibleState expanded 1'
		}, {
			lineStart: 3,
			lineEnd: 3,
			body: 'Test CommentThreadCollapsibleState expanded 2'
		}].forEach(item => buildDemoComments(item));
	});
	

	function buildDemoComments(comment: any) {
		const activeFsPath = vscode.window.activeTextEditor?.document?.uri?.fsPath;
		console.log('activaFSPath:', activeFsPath);
		const { lineStart, lineEnd, body } = comment;
		console.log(vscode.window.activeTextEditor?.document);
		const newThread = commentController.createCommentThread(
			// vscode.window.activeTextEditor?.document,
			vscode.Uri.parse(activeFsPath || ''),
			new vscode.Range(
				new vscode.Position(lineStart, 0),
				new vscode.Position(lineEnd, 0),
			),
			[],
		);
		newThread.collapsibleState = vscode.CommentThreadCollapsibleState.Expanded;
		newThread.comments = [{
			body,
			mode: vscode.CommentMode.Preview,
			author: {
				name: 'Demo Author'
			},
		}];
	}
}