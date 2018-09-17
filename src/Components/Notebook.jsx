import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import NotebookHeader from './NotebookHeader';
import NotebookSuperLine from './NotebookSuperLine';
import NotebookMove from './NotebookMove';
import NotebookSubline from './NotebookSubline';

function Notebook (props) {
	return (
		<div>
			<NotebookHeader {...props}/>
			<NotebookSuperLine {...props}/>
			<NotebookMove {...props}/>
			<NotebookSubline {...props}/>
		</div>
	);
}

const styles = theme => ({

});

export default withStyles(styles, {withTheme: true})(Notebook);
