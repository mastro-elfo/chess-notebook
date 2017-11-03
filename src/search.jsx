import React from 'react';
import {Link} from 'react-router-dom';
import Chessboard from './chessboard';
import {GameStorage, SettingsStorage} from './storage';
import './search.css';

export default class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			result: [],
			last: []
		};
		this.storage = new GameStorage();
		this.settingsStorage = new SettingsStorage();
	}

	componentDidMount(){
		const limit = this.settingsStorage.loadKey('lastEditLimit', 2);
		this.setState({
			last: this.storage
						.loadGames()
						.sort((a,b) => b.edit - a.edit)
						.splice(0, limit)
		});
	}

	search(event) {
		event.preventDefault();
		const term = event.target.value.trim();
		if(term === '') {
			// Nothing to search
			this.setState({
				result: [],
				term: null
			});
			return;
		}
		let re = RegExp(term, 'gi');
		let result = [];
		let games = this.storage.loadGames().map(game => {
			if(game.title.match(re)){
				result.push(game);
				return null;
			}
			else {
				return game;
			}
		});
		games.map(game => {
			if(game) {
				let added = false;
				game.lines.map(line => {
					if(!added && line.comment.match(re)) {
						result.push(game);
						added = true;
					}
					return true;
				});
			}
			return true;
		});
		this.setState({
			result: result,
			term: term
		});
	}

	render(){
		return (
			<div className="Search">
				<input type="text" placeholder="Search..." onChange={this.search.bind(this)}/>

				{this.state.term && this.state.result.length === 0 &&
					<h2>No result for &quot;{this.state.term}&quot;</h2>
				}
				{this.state.term && this.state.result.length > 0 &&
					<h2>Results for &quot;{this.state.term}&quot;</h2>
				}
				<ul className="list">
					{
						this.state.result.map((result, i) =>
							<li key={i}>
								<SearchResult {...result}/>
							</li>
						)
					}
				</ul>

				{this.state.last.length > 0 &&
					<h2>Last games</h2>
				}
				<ul className="list">
					{
						this.state.last.map((result, i) =>
							<li key={i}>
								<SearchResult {...result}/>
							</li>
						)
					}
				</ul>
			</div>
		);
	}
}

function SearchResult (props) {
	let play = props.lines.find(line => line.play);
	if(!play) {
		play = props.lines[0];
	}
	return (
		<div className="SearchResult">
			<Link to={`/detail/${props.id}/${play.id}`}
				  title={props.title}>
				<div className="thumbnail">
					<Chessboard
						side={props.side}
						showLabels={false}
						fen={play.fen}/>
				</div>
				<h3>{props.title}</h3>
				<p>{play.comment}</p>
				<div className="clear"></div>
			</Link>
		</div>
	);
}