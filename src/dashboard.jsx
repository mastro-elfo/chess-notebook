import React from 'react';
import {ICONS} from './icons';
import Search from './search';
import {Button, LinkButton} from './Button';

export default class Dashboard extends React.Component {
	render(){
		return (
			<section className="Dashboard">
				<header>
					<div>
						<Button className="left fill logo">
							<img alt="logo" src={ICONS['logo']}/>
						</Button>
						<LinkButton to="/new-game" className="right" title="Create a new game">
							<img alt="New" src={ICONS['plus']}/>
						</LinkButton>
						<LinkButton to="/detail" className="right" title="Show all games">
							<img alt="Details" src={ICONS['menu']}/>
						</LinkButton>
						<LinkButton to="/settings" className="right" title="Open settings">
							<img alt="Settings" src={ICONS['gear']}/>
						</LinkButton>
						<h1>Dashboard</h1>
					</div>
				</header>
				<main>
					<div>
						<Search/>
					</div>
				</main>
			</section>
		);
	}
}
