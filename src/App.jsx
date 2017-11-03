import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';

import Dashboard from './dashboard';
import Detail from './detail';
import Settings from './settings';
import Info from './info';
import NewGame from './newgame';

export default class App extends React.Component {
	render() {
		return (
			<div className="App">
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
			</div>
		);
	}
}
