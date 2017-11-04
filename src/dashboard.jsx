import React from 'react';
import {ICONS} from './icons';
import Search from './search';
import {LinkButton} from './Button';

export default class Dashboard extends React.Component {
	render(){
		return (
			<section className="Dashboard">
				<header>
					<div>
						<LinkButton to="/new-game" className="right">
							<img alt="New" src={ICONS['plus']}/>
						</LinkButton>
						<LinkButton to="/detail" className="right">
							<img alt="Details" src={ICONS['menu']}/>
						</LinkButton>
						<LinkButton to="/settings" className="right">
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
