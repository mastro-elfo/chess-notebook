import React, {Component} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

// Customize main theme
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import cyan from '@material-ui/core/colors/cyan';

// Import the Robot typeface
import 'typeface-roboto';

import Dashboard from './dashboard';
import Detail from './detail';
import Settings from './settings';
import Info from './info';
import NewGame from './newgame';

const THEME = createMuiTheme({
	palette: {
		primary: green,
		secondary: cyan,
		type: "light"
	}
});

export default function App () {
	return (
		<MuiThemeProvider theme={THEME}>
			<BrowserRouter basename="/chess-notebook">
				<Switch>
					<Route path="/" exact component={Dashboard}/>
					<Route path="/dashboard" component={Dashboard}/>
					<Route path="/new-game" component={NewGame}/>
					<Route path="/detail" component={Detail}/>
					<Route path="/settings" component={Settings}/>
					<Route path="/info" component={Info}/>
					<Redirect to="/"/>
				</Switch>
			</BrowserRouter>
		</MuiThemeProvider>
	);
}
