'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const commentController = vscode.comments.createCommentController('comment-sample', 'Comment API Sample');
	context.subscriptions.push(commentController);

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
		const { lineStart, lineEnd, body } = comment;
		const newThread = commentController.createCommentThread(
			vscode.window.activeTextEditor?.document?.uri as vscode.Uri,
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