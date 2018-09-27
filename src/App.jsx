import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

// Customize main theme
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';

// Import the Robot typeface
import 'typeface-roboto';

import Dashboard from './Pages/Dashboard';
import Detail from './Pages/Detail';
import Settings from './settings';
import Info from './Pages/Info';
import NewGame from './Pages/NewGame';
import NotFound from './Pages/404.jsx';
import Test from './Pages/Test';

import {Local} from './Utils/Storage';

const THEME = createMuiTheme({
	palette: {
		primary: green,
		secondary: blue,
		common: {
			green: green[500]
		}
	}
});

function App () {
	// Check storage version
	const storageVersion = Local.get('Version');
	if(!storageVersion || storageVersion < 1) {
		let games = Local.get("games") || [];
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
				id: ""+item.id,
				parent: item.parent === null ? item.parent : ""+item.parent
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
					<Route path="/dashboard" component={Dashboard}/>
					<Route path="/new-game" component={NewGame}/>
					<Route path="/detail" component={Detail}/>
					<Route path="/settings" component={Settings}/>
					<Route path="/info" component={Info}/>
					<Route path="/404" component={NotFound}/>
					<Route path="/test" component={Test}/>
					<Redirect to="/dashboard"/>
				</Switch>
			</BrowserRouter>
		</MuiThemeProvider>
	);
}

export default App;

// <Route path="/" exact component={Dashboard}/>
