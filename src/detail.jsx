import React from 'react';
import {Link, Route, Redirect, Switch} from 'react-router-dom';
import Chess from 'chess.js/chess.min.js';
import Chessboard from './chessboard';
import Notebook from './notebook';
import {GameStorage, LineStorage, SettingsStorage} from './storage';
import Modal from './Modal';
import {ICONS} from './icons';
import {PIECES} from  './pieces';
import './detail.css';

class DetailLine extends React.Component{
	constructor(props) {
		super(props);
		this.gameStorage = new GameStorage();
		this.lineStorage = new LineStorage();
		this.settingsStorage = new SettingsStorage();
		const gameId = +this.props.match.params.gameId;
		const game = this.gameStorage.loadGame(gameId);
		this.state = {
			side: game.side || 'w',
			selectedCell: null,
			targetCell: null,
			requestPromotion: null
		};
	}

	onToggleSide(){
		const side = this.state.side === 'w' ? 'b' : 'w'
		this.setState({
			side: side
		});
		const gameId = +this.props.match.params.gameId;
		const game = this.gameStorage.loadGame(gameId);
		game.side = side;
		this.gameStorage.saveGame(game);
	}

	onClickCell(coords) {
		const gameId = +this.props.match.params.gameId;
		const lineId = +this.props.match.params.lineId;
		const line = this.lineStorage.loadLine(gameId, lineId);
		let chess = new Chess(line.fen);
		const moves = chess.moves({square: coords, verbose: true}); // TODO: becomes const

		if(moves && moves.length) {
			this.setState({
				selectedCell: coords
			});
		}
		else if(this.state.selectedCell){
			this.requestMove(this.state.selectedCell, coords);
		}
	}

	onDropCell(from, to){
		this.requestMove(from, to);
	}

	requestMove(from, to) {
		const gameId = +this.props.match.params.gameId;
		const lineId = +this.props.match.params.lineId;
		const line = this.lineStorage.loadLine(gameId, lineId);
		let chess = new Chess(line.fen);
		const moves = chess.moves({square: from, verbose: true}).filter(move => move.to === to);
		if(!moves || moves.length === 0) {
			// Not a valid move
			return;
		}
		if(moves[0].promotion) {
			// Open dialog
			this.setState({
				selectedCell: from,
				targetCell: to,
				requestPromotion: moves[0].color
			});
		}
		else {
			this.doMove(from, to);
		}
	}

	doMove(from, to, promotion) {
		promotion = promotion || '';
		const gameId = +this.props.match.params.gameId;
		const lineId = +this.props.match.params.lineId;
		const game = this.gameStorage.loadGame(gameId);
		const line = this.lineStorage.loadLine(gameId, lineId);
		let chess = new Chess(line.fen);
		const move = chess.move({
			from: from,
			to: to,
			promotion: promotion.toLowerCase()
		});
		if(move){
			// Check the same line
			let newLine = game.lines
				.filter(line => line.parent === lineId)
				.find(line => line.move === move.san);
			if(!newLine) {
				newLine = this.lineStorage.saveLine(gameId, {
					move: move.san,
					parent: lineId,
					fen: chess.fen(),
					comment: '',
					value: null
				});
			}
			this.setState({
				selectedCell: null
			});
			this.props.history.push(`/detail/${gameId}/${newLine.id}`);
		}
		else {
			console.error('Something very wrong happened here. Move should be valid', from, to, promotion, move);
		}
	}

	onCancelPromotion(){
		this.setState({
			requestPromotion: null,
			targetCell: null,
			selectedCell: null
		});
	}

	onConfirmPromotion(piece) {
		this.setState({
			requestPromotion: null
		});
		this.doMove(this.state.selectedCell, this.state.targetCell, piece);
	}

	onClickDelete(linesId) {
		// Delete lineId and all its descendants
		const gameId = +this.props.match.params.gameId;
		const lines = this.lineStorage.loadLines(gameId);
		let toDelete = linesId;
		linesId.map(lineId => toDelete = toDelete.concat(this.getDescendants(lines, lineId).map(line => line.id)));
		this.lineStorage.removeLines(gameId, toDelete);
		this.setState({
			update: +new Date()
		});
	}

	getDescendants(list, id) {
		let output = [];
		list.filter(item => item.parent === id)
			.map(item => {
				output.push(item);
				output = output.concat(this.getDescendants(list, item.id));
				return true;
			});
		return output;
	}

	render(){
		const gameId = +this.props.match.params.gameId;
		const lineId = +this.props.match.params.lineId;
		const game = this.gameStorage.loadGame(gameId);
		const line = this.lineStorage.loadLine(gameId, lineId);
		let chess = new Chess(line.fen);
		let moves = chess.moves({verbose: true});
		let selectableCells = moves.map(move => move.from);
		if(this.state.selectedCell) {
			moves = chess.moves({square: this.state.selectedCell, verbose: true});
			selectableCells = selectableCells.concat(moves.map(move => move.to));
		}
		const settings = this.settingsStorage.load('Settings');
		return (
			<section className="Detail">
				<header>
					<div>
						<Link to="/" className="button left">
							<div><img alt="back" src={ICONS['back']}/></div>
						</Link>
						<button className="button right" disabled={settings.rotateChessboard} onClick={this.onToggleSide.bind(this)}>
							<div><img alt="Reverse" src={ICONS['swap']}/></div>
						</button>
						<h1>{game.title}</h1>
					</div>
				</header>
				<main>
					<div>
						<div className="column column-2">
							<Chessboard
								side={settings.rotateChessboard ? chess.turn() : this.state.side}
								fen={line.fen}
								onClick={this.onClickCell.bind(this)}
								onDrop={this.onDropCell.bind(this)}
								selectedCell={this.state.selectedCell}
								selectableCells={selectableCells}/>
						</div>
						<div className="column column-2">
							<Notebook
								gameId={game.id}
								lines={game.lines}
								selectedId={lineId}
								history={this.props.history}
								onClickDelete={this.onClickDelete.bind(this)}/>
						</div>
					</div>
				</main>
				<Modal show={this.state.requestPromotion} onCancel={this.onCancelPromotion.bind(this)}>
					<div className="title">Choose a piece…</div>
					{
						'qrnb'.split('').map(piece =>
							<div
								className="piece"
								key={piece}
								onClick={this.onConfirmPromotion.bind(this, piece)}>
								<img alt={this.state.requestPromotion === 'w' ? piece.toUpperCase() : piece} src={PIECES[(this.state.requestPromotion === 'w' ? piece.toUpperCase() : piece)]}/>
							</div>
						)
					}
				</Modal>
			</section>
		);
	}
}

function DetailGame(props){
	return (
		<Redirect to={`${props.match.url}/0`}/>
	);
}

class DetailAll extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			edit: false,
			editList: []
		};
		this.storage = new GameStorage();
	}

	onClickExitEdit() {
		this.setState({
			edit: false,
			editList: []
		});
	}

	onToggleEditAll(){
		const games = this.storage.loadGames();
		if(games.length === this.state.editList.length){
			this.setState({
				editList: []
			});
		}
		else {
			this.setState({
				editList: games.map(game => game.id)
			});
		}
	}

	onToggleEditGame(gameId){
		let editList = this.state.editList.slice();
		const index = editList.indexOf(editList.find(item => item === gameId));
		if(index === -1) {
			editList.push(gameId);
		}
		else {
			editList.splice(index, 1);
		}
		this.setState({
			edit: true,
			editList: editList
		});
	}

	onClickDeleteGames(){
		const editList = this.state.editList.slice();
		this.storage.removeGames(editList);
		this.setState({
			edit: false,
			editList: []
		});
	}

	render(){
		const games = this.storage.loadGames();
		const classNames = ['DetailAll', (this.state.edit?'edit':'')];
		return (
			<section className={classNames.join(' ')}>
				<header>
					<div>
						<Link to="/" className="button left">
							<div><img alt="back" src={ICONS['back']}/></div>
						</Link>
						<h1>Detail</h1>
					</div>
				</header>
				<header className="edit">
					<div>
						<button className="button left"
							onClick={this.onClickExitEdit.bind(this)}>
							<div><img alt="back" src={ICONS['back']}/></div>
						</button>
						<button className="button left" onClick={this.onToggleEditAll.bind(this)}>
							<div>
								{games.length === this.state.editList.length?
								<img alt="checked" src={ICONS['boxChecked']}/>:
								<img alt="checked" src={ICONS['box']}/>}
							</div>
						</button>
						<button className="button right" onClick={this.onClickDeleteGames.bind(this)}>
							<div><img alt="delete" src={ICONS['trash']}/></div>
						</button>
						<h1>
							{this.state.editList.length} selected
						</h1>
					</div>
				</header>
				<main>
					<div>
						<ul className="list">
							{
								games.map((game, i) =>{
									const play = game.lines.find(line => line.play);
									return (
										<li key={i}>
											<button className="button right" onClick={this.onToggleEditGame.bind(this, game.id)}>
												<div>
													{this.state.editList.find(id => id === game.id) ?
													<img alt="checked" src={ICONS['boxChecked']}/> :
													<img alt="checked" src={ICONS['box']}/>}
												</div>
											</button>
											<Link to={`${this.props.match.url}/${game.id}`}>
												<div className="thumbnail">
													<Chessboard
														fen={play.fen}
														side={game.side}
														showLabels={false}/>
												</div>
												<h3>{game.title}</h3>
												<p></p>
												<div className="clear"></div>
											</Link>
										</li>
									)
								})
							}
						</ul>
						{(!games || games.length === 0) &&
						<p>There are no games. Start creating a new game. <Link to="/new-game"><span>Create</span></Link></p>}
					</div>
				</main>
			</section>
		);
	}
}

export default function Detail(props) {
	return (
		<div>
			<Switch>
				<Route path={`${props.match.url}/:gameId/:lineId`} component={DetailLine}/>
				<Route path={`${props.match.url}/:gameId/`} component={DetailGame}/>
				<Route component={DetailAll}/>
			</Switch>
		</div>
	);
}
