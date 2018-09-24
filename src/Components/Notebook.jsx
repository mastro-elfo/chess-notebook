import React from 'react';

import NotebookSuperLine from './NotebookSuperLine';
import NotebookMove from './NotebookMove';
import NotebookSubline from './NotebookSubline';

export default function Notebook (props) {
	return (
		<div>
			<NotebookSuperLine {...props}/>
			<NotebookMove {...props}/>
			<NotebookSubline {...props}/>
		</div>
	);
}
