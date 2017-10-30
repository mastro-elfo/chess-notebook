import React from 'react';
import {Link} from 'react-router-dom';
import {ICONS} from './icons';
import Search from './search';

export default class Dashboard extends React.Component {
	render(){
		return (
			<section className="Dashboard">
				<header>
					<div>
						<Link to="/new-game" className="button right">
							<div><img alt="New" src={ICONS['plus']}/></div>
						</Link>
						<Link to="/detail" className="button right">
							<div><img alt="Details" src={ICONS['menu']}/></div>
						</Link>
						<Link to="/settings" className="button right">
							<div><img alt="Settings" src={ICONS['gear']}/></div>
						</Link>
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
