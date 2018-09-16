import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

// Customize main theme
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import pink from '@material-ui/core/colors/pink';

// Import the Robot typeface
import 'typeface-roboto';

import Dashboard from './dashboard';
import Detail from './detail';
import Settings from './settings';
import Info from './info';
import NewGame from './newgame';
import NotFound from './404.jsx';
import Test from './Pages/Test';

import {Local} from './Storage';

const THEME = createMuiTheme({
	palette: {
		primary: green,
		secondary: pink
	}
});

function App () {
	// Check storage version
	const storageVersion = Local.get('Version');
	if(!storageVersion || storageVersion < 1) {
		let games = Local.get("Games") || [];
		// Transform id into string
		games = games.map(item => ({
			...item,
			id: ""+item.id
		}));

		// Transform id into string
		games = games.map(game => ({
			...game,
			lines: game.lines.map(item => ({
				...item,
				id: ""+item.id
			}))
		}));

		Local.set("Games", games);
		Local.set('Settings', Local.get('settings') || {});
		Local.set('Version', 1);
	}

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
					<Route path="/404" component={NotFound}/>
					<Route path="/test" component={Test}/>
					<Redirect to="/"/>
				</Switch>
			</BrowserRouter>
		</MuiThemeProvider>
	);
}

export default App;
