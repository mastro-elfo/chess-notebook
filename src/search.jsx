import React from 'react';
import {Link} from 'react-router-dom';
import Chessboard from './chessboard';
import {GameStorage} from './storage';
import './search.css';

export default class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			result: [],
			last: []
		};
		this.storage = new GameStorage();
	}

	componentDidMount(){
		this.setState({
			last: this.storage
						.loadGames()
						.sort((a,b) => b.edit - a.edit)
						.splice(0, 2)
		});
	}

	search(event) {
		event.preventDefault();
		const term = event.target.value.trim();
		if(term === '') {
			// Nothing to search
			this.setState({
				result: []
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
			result: result
		});
	}

	render(){
		return (
			<div className="Search">
				<input type="text" placeholder="Search..." onChange={this.search.bind(this)}/>

				<ul className="list">
					{
						this.state.result.map((result, i) =>
							<li key={i}>
								<SearchResult {...result}/>
							</li>
						)
					}
				</ul>

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
				<p>{props.comment}</p>
				<div className="clear"></div>
			</Link>
		</div>
	);
}
