import React from 'react';
import {ICONS} from './icons';
import Search from './search';
import {Button} from './Button';
import Sidebar from 'react-sidebar';
import {Link} from 'react-router-dom';
import {GameStorage} from './storage';

export default class Dashboard extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			sidebarOpen: false
		};
		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
		this.gameStorage = new GameStorage();
	}

	onSetSidebarOpen(open){
		this.setState({
			sidebarOpen: open
		});
	}

	render(){
		const games = this.gameStorage.loadGames();
		return (
			<Sidebar sidebar={<DashboardSidebar/>} open={this.state.sidebarOpen} onSetOpen={this.onSetSidebarOpen} styles={{content:{overflowY: 'auto'}}} sidebarClassName="Sidebar">
				<section className="Dashboard">
					<header>
						<div>
							<Button className="left fill logo" onClick={()=>this.onSetSidebarOpen(true)} title="Open sidebar">
								<img alt="logo" src={ICONS['logo']}/>
							</Button>
							<h1>Dashboard</h1>
						</div>
					</header>
					<main>
						<div>
							{games.length !== 0 && <Search/>}
							{games.length === 0 &&
								<p>There are no games yet. Start creating a new game. <Link to="/new-game" style={{color: 'hsl(140,50%,50%)', textDecoration: 'underline'}}><span>Create</span></Link></p>
							}
						</div>
					</main>
				</section>
			</Sidebar>
		);
	}
}

function DashboardSidebar(props){
	return (
		<section>
			<header>
				<div>
					<h1>Chess Notebook</h1>
				</div>
			</header>
			<main>
				<div>
					<ul className="list">
						<li><Link to="/new-game">
							<img alt="+" src={ICONS['plus']} className="left invert"/> Create new game
						</Link></li>
						<li><Link to="/detail">
							<img alt="_" src={ICONS['menu']} className="left invert"/> View all games
						</Link></li>
						<li><Link to="/settings">
							<img alt="o" src={ICONS['gear']} className="left invert"/> Settings
						</Link></li>
						<li><Link to="/info">
							<img alt=">" src={ICONS['info']} className="left invert"/> Info
						</Link></li>
					</ul>
				</div>
			</main>
		</section>
	);
}
