import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default function (props) {
	const {
		requestDeleteLines, onClose, onCancelDeleteLines, onDeleteLines
	} = props;

	return (
		<Dialog
			open={requestDeleteLines}
			onClose={onClose}>
			<DialogTitle>Delete lines</DialogTitle>

			<DialogContent>
				<DialogContentText>
					If you confirm the lines will be permanently deleted. This operation can't be undone.
				</DialogContentText>
			</DialogContent>

			<DialogActions>
				<Button
					color="primary"
					onClick={onCancelDeleteLines}>
					Cancel
				</Button>
				<Button
					color="primary"
					onClick={onDeleteLines}>
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
}
