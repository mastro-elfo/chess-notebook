import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Checkbox from '@material-ui/core/Checkbox';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import InfoIcon from '@material-ui/icons/Info';

import uuid from 'uuid/v1';
import {Link, Route, Redirect, Switch} from 'react-router-dom';

import Chess from 'chess.js/chess.min.js';
import Chessboard from './chessboard';
import Notebook from './notebook';
import {PIECES} from  './pieces';
import {OPENINGS} from './openings';

import {Local} from './Storage';

class DetailLine extends Component{
	constructor(props) {
		super(props);

		const gameId = +this.props.match.params.gameId;
		// const game = this.gameStorage.loadGame(gameId);
		this.state = {
			// side: game.side || 'w',
			selectedCell: null,
			targetCell: null,
			requestPromotion: null,
			// editTitle: game.title
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
				// This is a new line
				const fen = chess.fen();
				// Search openings
				const searchOpenings = this.settingsStorage.loadKey('searchOpenings', true);
				let comment = '';
				if(searchOpenings) {
					const opening = OPENINGS.find(open => open.fen === fen);
					if(opening) {
						comment = opening.name + ' ('+opening.eco+')';
					}
				}
				newLine = this.lineStorage.saveLine(gameId, {
					id: uuid(),
					move: move.san,
					parent: lineId,
					fen: fen,
					comment: comment,
					value: null,
					positionValue: null
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
		const gameId = this.props.match.params.gameId;
		const lineId = this.props.match.params.lineId;
		// console.debug("Game id", gameId, Local.get("Games"));

		// Find game in local storage
		const game = (Local.get("Games") || [])
			.find(item => item.id === gameId);

		const line = game.lines
			.find(item => item.id === lineId);

		// let chess = new Chess(line.fen);
		let chess = new Chess();

		let moves = chess.moves({verbose: true});
		let selectableCells = moves.map(move => move.from);
		if(this.state.selectedCell) {
			moves = chess.moves({square: this.state.selectedCell, verbose: true});
			selectableCells = selectableCells.concat(moves.map(move => move.to));
		}
		const settings = Local.get("Settings");

		return (
			<div>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							onClick={()=>this.props.history.goBack()}>
							<ArrowBackIcon/>
						</IconButton>
						<Typography variant="title" style={{flexGrow: 1}}>
							{game.title}
						</Typography>
					</Toolbar>
				</AppBar>
				<div>
					{
						// <Chessboard side={settings.rotateChessboard ? chess.turn() : this.state.side} fen={line.fen} onClick={this.onClickCell.bind(this)} onDrop={this.onDropCell.bind(this)} selectedCell={this.state.selectedCell} selectableCells={selectableCells} showLabels={settings.showLabels}/>
					}
				</div>
			</div>
		);
	}
}

/*
<section className="Detail">
	{!this.state.openEditTitle &&
		<header>
			<div>
				{
				// <LinkButton className="left" title="Back to dashboard" to="/dashboard">
				// 	<img alt="dash" src=""/>
				// </LinkButton>
				// <Button className="left" title="Go back" onClick={this.props.history.goBack}>
				// 	<img alt="back" src=""/>
				// </Button>
				// <Button className="right" disabled={settings.rotateChessboard} onClick={this.onToggleSide.bind(this)} title="Reverse chessboard">
				// 	<img alt="Reverse" src=""/>
				// </Button>
				}
				<h1 onClick={this.onClickEditTitle.bind(this)}>{game.title}</h1>
			</div>
		</header>
	}
	{this.state.openEditTitle &&
		<header className="edit">
			<div>
				{
				// 	<Button className="left" onClick={this.onCancelEditTitle.bind(this)}>
				// 	<img alt="close" src=""/>
				// </Button>
				}
				<h1>
					<input type="text" value={this.state.editTitle} onChange={(e)=>this.setState({editTitle: e.target.value})} onBlur={this.onConfirmEditTitle.bind(this)} autoFocus/>
				</h1>
			</div>
		</header>
	}
	<main>
		<div>
			<div className="column column-2">

			</div>
			<div className="column column-2">
				{
					// <Notebook gameId={game.id} lines={game.lines} selectedId={lineId} history={this.props.history} onClickDelete={this.onClickDelete.bind(this)}/>
				}
			</div>
		</div>
	</main>
	{
		// this.state.requestPromotion &&
		// <Modal className="ChoosePiece" onClose={this.onCancelPromotion.bind(this)}>
		// 	<h1>Choose a piece…</h1>
		// 	{
		// 		'qrnb'.split('').map(piece =>
		// 			<div
		// 				className="piece"
		// 				key={piece}
		// 				onClick={this.onConfirmPromotion.bind(this, piece)}>
		// 				<img alt={this.state.requestPromotion === 'w' ? piece.toUpperCase() : piece} src={PIECES[(this.state.requestPromotion === 'w' ? piece.toUpperCase() : piece)]}/>
		// 			</div>
		// 		)
		// 	}
		// </Modal>
	}
</section>

 */

function DetailGame(props){
	const gameId = props.match.params.gameId;
	// Find game in local storage
	const game = (Local.get("Games") || [])
		.find(item => item.id === gameId);
	// Find "play" move
	const line = game.lines
		.find(item => item.play);
	return (
		<Redirect to={`${props.match.url}/${line.id}`}/>
	);
}

class DetailAll extends Component{
	constructor(props){
		super(props);
		this.state = {
			edit: false,
			editList: []
		};
	}

	onClickExitEdit() {
		this.setState({
			edit: false,
			editList: []
		});
	}

	onToggleEditAll(){
		const games = Local.get("Games") || [];
		if(games.length === this.state.editList.length){
			this.setState({
				editList: [],
				u: new Date()
			});
		}
		else {
			this.setState({
				editList: games.map(game => game.id),
				u: new Date()
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
		const list = Local.get('Games') || [];

		return (
			<div>
				{!this.state.edit &&
				<AppBar position="static">
					<Toolbar>
						<IconButton
							onClick={()=>this.props.history.goBack()}>
							<ArrowBackIcon/>
						</IconButton>
						<Typography variant="title" style={{flexGrow: 1}}>
							Detail
						</Typography>
					</Toolbar>
				</AppBar>}

				{this.state.edit &&
				<AppBar position="static" color="default">
					<Toolbar>
						<IconButton
							onClick={()=>this.onClickExitEdit()}>
							<CloseIcon/>
						</IconButton>
						<Checkbox
							checked={list.length === this.state.editList.length}
							onClick={()=>this.onToggleEditAll()}/>
						<Typography variant="title" style={{flexGrow: 1}}>
							Edit <small>({this.state.editList.length})</small>
						</Typography>
						<IconButton
							onClick={()=>this.setState({edit: false})}>
							<DeleteForeverIcon/>
						</IconButton>
					</Toolbar>
				</AppBar>}

				<GridList>
					{
						list.map((item, i) =>
							<GridListTile key={i}>
								<div style={{
										width: "100%",
										height: "100%"
									}}>
									<Chessboard
										fen={item.fen}/>
								</div>
								<GridListTileBar
									title={item.title}
									actionIcon={
										<Checkbox
											checked={!!this.state.editList.find(id => id === item.id)}
											onClick={()=>this.onToggleEditGame(item.id)}/>
									}/>
							</GridListTile>)
					}
				</GridList>
			</div>
		)
		/*const games = this.storage.loadGames();
		return (
			<section className="DetailAll">
				{!this.state.edit &&
					<header>
						<div>
							<Button to="/" className="left" title="Go back" onClick={this.props.history.goBack}>
								<img alt="back" src={ICONS['back']}/>
							</Button>
							<h1>Detail</h1>
						</div>
					</header>
				}
				{this.state.edit &&
					<header className="edit">
						<div>
							<Button className="left"
								onClick={this.onClickExitEdit.bind(this)} title="Cancel edit">
								<div><img alt="back" src={ICONS['cancel']}/></div>
							</Button>
							<Button className="left" onClick={this.onToggleEditAll.bind(this)} title="Check all games">
								{games.length === this.state.editList.length?
								<img alt="checked" src={ICONS['boxChecked']}/>:
								<img alt="checked" src={ICONS['box']}/>}
							</Button>
							<Button className="right" onClick={()=>this.setState({confirmDeleteGames: true})} title="Delete selected games" disabled={this.state.editList.length===0}>
								<img alt="delete" src={ICONS['trash']}/>
							</Button>
							<h1>
								{this.state.editList.length} selected
							</h1>
						</div>
					</header>
				}
				<main>
					<div>
						<ul className="list">
							{
								games.map((game, i) => this.renderGame(game, i))
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
		);*/
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
