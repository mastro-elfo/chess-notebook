import React from 'react';

import SettingsHeader from '../Components/SettingsHeader';
import SettingsContent from '../Components/SettingsContent';

export default function (props) {
	return (
		<div>
			<SettingsHeader
				{...props}
				/>
			<SettingsContent
				{...props}
				/>
		</div>
	);
}
