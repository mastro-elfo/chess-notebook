import React from 'react';
import {Route, Switch} from 'react-router-dom';

import DetailAll from '../Components/DetailAll';
import DetailGame from '../Components/DetailGame';
import DetailLine from '../Components/DetailLine';

export default function (props) {
	const {
		match: {url}
	} = props;

	return (
		<Switch>
			<Route path={`${url}/:gameId/:lineId`} component={DetailLine}/>
			<Route path={`${url}/:gameId/`} component={DetailGame}/>
			<Route component={DetailAll}/>
		</Switch>
	);
}
