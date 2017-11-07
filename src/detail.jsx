import React from 'react';
import {Link, Route, Redirect, Switch} from 'react-router-dom';
import Chess from 'chess.js/chess.min.js';
import Chessboard from './chessboard';
import Notebook from './notebook';
import {GameStorage, LineStorage, SettingsStorage} from './storage';
import Modal, {ModalButtons, ModalButton} from './modal';
import {ICONS} from './icons';
import {PIECES} from  './pieces';
import './detail.css';
import {Button, LinkButton} from './Button';

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
		const settings = this.settingsStorage.load('Settings', {rotateChessboard: false});
		return (
			<section className="Detail">
				<header>
					<div>
						<LinkButton to="/" className="left" title="Back to dashboard">
							<img alt="back" src={ICONS['back']}/>
						</LinkButton>
						<Button className="right" disabled={settings.rotateChessboard} onClick={this.onToggleSide.bind(this)} title="Reverse chessboard">
							<img alt="Reverse" src={ICONS['swap']}/>
						</Button>
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
				{
					this.state.requestPromotion &&
					<Modal className="ChoosePiece" onClose={this.onCancelPromotion.bind(this)}>
						<h1>Choose a piece…</h1>
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
				}
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
			editList: [],
			confirmDeleteGames: false
		});
	}

	render(){
		const games = this.storage.loadGames();
		const classNames = ['DetailAll', (this.state.edit?'edit':'')];
		return (
			<section className={classNames.join(' ')}>
				<header>
					<div>
						<LinkButton to="/" className="left" title="Back to dashboard">
							<img alt="back" src={ICONS['back']}/>
						</LinkButton>
						<h1>Detail</h1>
					</div>
				</header>
				<header className="edit">
					<div>
						<Button className="left"
							onClick={this.onClickExitEdit.bind(this)} title="Cancel edit">
							<div><img alt="back" src={ICONS['back']}/></div>
						</Button>
						<Button className="left" onClick={this.onToggleEditAll.bind(this)} title="Check all games">
							{games.length === this.state.editList.length?
							<img alt="checked" src={ICONS['boxChecked']}/>:
							<img alt="checked" src={ICONS['box']}/>}
						</Button>
						<Button className="right" onClick={()=>this.setState({confirmDeleteGames: true})} title="Delete selected games">
							<img alt="delete" src={ICONS['trash']}/>
						</Button>
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
									const play = game.lines.find(line => line.play) || game.lines[0];
									return (
										<li key={i}>
											<Button className="right" onClick={this.onToggleEditGame.bind(this, game.id)} title="Check game">
												{this.state.editList.find(id => id === game.id) ?
													<img alt="checked" src={ICONS['boxChecked']}/> :
													<img alt="checked" src={ICONS['box']}/>}
											</Button>
											<Link to={`${this.props.match.url}/${game.id}`}>
												<div className="thumbnail">
													<Chessboard
														fen={play.fen}
														side={game.side}
														showLabels={false}/>
												</div>
												<h3>{game.title}</h3>
												<p>{play.comment}</p>
												<div className="clear"></div>
											</Link>
										</li>
									)
								})
							}
						</ul>
						{(!games || games.length === 0) &&
						<p>There are no games yet. Start creating a new game. <Link to="/new-game" style={{color: 'hsl(140,50%,50%)', textDecoration: 'underline'}}><span>Create</span></Link></p>}
					</div>
				</main>
				{this.state.confirmDeleteGames &&
					<Modal onClose={()=>this.setState({confirmDeleteGames: false})}>
						<h1>Confirm delete games</h1>
						<p>Do you really want to delete the selected games?<br/>The operation can't be undone.</p>
						<ModalButtons>
							<ModalButton onClick={this.onClickDeleteGames.bind(this)}>
								<img src={ICONS['boxChecked']} alt="ok"/> Confirm
							</ModalButton>
							<ModalButton onClick={()=>this.setState({confirmDeleteGames: false})}>
								<img src={ICONS['delete']} alt="x"/> Cancel
							</ModalButton>
						</ModalButtons>
					</Modal>
				}
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
