import React from 'react';
import {ICONS} from './icons';
import Search from './search';
import {Button} from './Button';
import Sidebar from 'react-sidebar';
import {Link} from 'react-router-dom';

export default class Dashboard extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			sidebarOpen: false
		};
		this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
	}

	onSetSidebarOpen(open){
		this.setState({
			sidebarOpen: open
		});
	}

	render(){
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
							<Search/>
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
							<img alt=">" src={ICONS['forward']} className="left invert"/> Info
						</Link></li>
					</ul>
				</div>
			</main>
		</section>
	);
}
