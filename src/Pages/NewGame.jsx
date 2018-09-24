import React from 'react';

import NewGameComponent from '../Components/NewGame';

export default function NewGame (props) {
	return (
		<div>
			<NewGameComponent
				{...props}/>
		</div>
	);
}
