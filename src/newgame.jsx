import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select'; // TODO: Use TextField
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import uuid from 'uuid/v1';
import Chess from 'chess.js/chess.min.js';

import Chessboard from './Components/Chessboard';
import {Local} from './Storage';

export default class New extends Component {
	constructor(props){
		super(props);
		this.state = {
			// General fields
			title: '',
			description: '',
			// Fen fields
			position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
			turn: 'w',
			whiteCastling: 'KQ',
			blackCastling: 'kq',
			enPassant: '-',
			drawMoves: 0,
			totalMoves: 1,
			// Others
			selectedPiece: null,
			componentSize: Math.min(window.innerHeight, window.innerWidth /2),
			// Dialogs
			pgnDialog: false
		};
	}

	componentDidMount(){
		window.addEventListener('resize', this.onResize.bind(this));
		this.onResize();
		// this.refs.title.focus();
	}

	onResize(){
		this.setState({
			componentSize: Math.min(window.innerHeight -parseFloat(getComputedStyle(document.body).fontSize) *3.5, window.innerWidth /2)
		});
	}

	toFen(){
		const whiteCastling = this.state.whiteCastling === '-' ? '' : this.state.whiteCastling;
		const blackCastling = this.state.blackCastling === '-' ? '' : this.state.blackCastling;
		const castling = (whiteCastling === '' && blackCastling === '')? '-' : whiteCastling + blackCastling;
		return [this.state.position, this.state.turn, castling, this.state.enPassant, this.state.drawMoves, this.state.totalMoves].join(' ');
	}

	onClickPlay(){
		// Create game object
		const game = {
			id: uuid(),
			title: this.state.title,
			side: this.state.turn,
			lines: [
				{
					id: uuid(),
					fen: this.toFen(),
					comment: this.state.description,
					move: null,
					parent: null,
					value: null,
					positionValue: null,
					play: true
				}
			]
		};

		let games = Local.get('Games') || [];
		games.push(game);
		Local.set("Games", games);

		// Redirect to detail
		this.props.history.push(`/detail/${game.id}`)
	}

	onClickReset(){
		this.setState({
			position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
		});
	}

	render(){
		const enPassantCandidates = this.getEnPassantCandidates();
		console.debug(enPassantCandidates)
		const selectableCells = this.getSelectableCells();
		return (
			<div>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							onClick={()=>this.props.history.goBack()}>
							<ArrowBackIcon/>
						</IconButton>
						<Typography variant="title" style={{flexGrow: 1}}>
							Create new Game
						</Typography>

						<Button
							onClick={()=>this.setState({pgnDialog: true})}>
							PGN
						</Button>

						<Button
							onClick={()=>this.onClickReset()}>
							Reset
						</Button>

						<IconButton
							onClick={()=>this.onClickPlay()}>
							<PlayArrowIcon/>
						</IconButton>
					</Toolbar>
				</AppBar>

				<FormControl fullWidth>
					<Typography variant="title" color="secondary">

					</Typography>
					<TextField
						label="Title"
						fullWidth
						value={this.state.title}
						onChange={({target})=>this.setState({title: target.value})}
						/>

					<TextField
						label="Description"
						fullWidth
						value={this.state.description}
						onChange={({target})=>this.setState({description: target.value})}
						/>

					<Typography variant="title" color="secondary">
						Position
					</Typography>

					<div style={{
							width: "100vw",
							height: "50vh"
						}}>
						<Chessboard
							side="w"
							fen={this.toFen()}
							selectableCells={selectableCells}/>
					</div>

					<Typography variant="title" color="secondary">
						Turn
					</Typography>
					<Select
						value={this.state.turn}
						onChange={({target})=>this.setState({turn: target.value, enPassant: "-"})}>
						<MenuItem value="w">White</MenuItem>
						<MenuItem value="b">Black</MenuItem>
					</Select>

					<Typography variant="title" color="secondary">
						Castling
					</Typography>
					<Select
						value={this.state.whiteCastling}
						onChange={({target})=>this.setState({whiteCastling: target.value})}>
						<MenuItem value="KQ">Both sides</MenuItem>
						<MenuItem value="K">King side</MenuItem>
						<MenuItem value="Q">Queen side</MenuItem>
						<MenuItem value="-">None</MenuItem>
					</Select>

					<Select
						value={this.state.blackCastling}
						onChange={({target})=>this.setState({blackCastling: target.value})}>
						<MenuItem value="kq">Both sides</MenuItem>
						<MenuItem value="k">King side</MenuItem>
						<MenuItem value="q">Queen side</MenuItem>
						<MenuItem value="-">None</MenuItem>
					</Select>

					<Typography variant="title" color="secondary">
						En passant
					</Typography>
					<Select
						label="En passant"
						value={this.state.enPassant}
						onChange={({target})=>this.setState({enPassant: target.value})}>
						<MenuItem value="-">None</MenuItem>
						{
							enPassantCandidates.map((item, i) =><MenuItem key={i} value={item}>{item}</MenuItem>)
						}
					</Select>

					<Typography variant="title" color="secondary">
						Moves
					</Typography>
					<TextField
						label="Draw moves"
						fullWidth
						value={this.state.drawMoves}
						onChange={({target})=>this.setState({drawMoves: target.value})}
						/>

					<TextField
						label="Total moves"
						fullWidth
						value={this.state.totalMoves}
						onChange={({target})=>this.setState({totalMoves: target.value})}
						/>

					<TextField
						label="Fen"
						fullWidth
						readOnly
						value={this.toFen()}
						/>
				</FormControl>

				<Dialog
					open={this.state.pgnDialog}
					onClose={()=>this.setState({pgnDialog: false})}>
					<DialogTitle>Import from PGN</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Paste a valid PGN in the field below
						</DialogContentText>
						<TextField
							fullWidth
							label="PGN"
							/>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={()=>this.setState({pgnDialog: false})}>
							Cancel
						</Button>
						<Button
							onClick={()=>this.setState({pgnDialog: false})}>
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}

	getEnPassantCandidates(){
		let output = [];
		const turn = this.state.turn;
		const position = this.state.position;
		if(turn === 'w') {
			// find coordinates of black pawns on the fifth row
			output = position
				// extract the fifth row (third in fen)
				.split('/')[3]
				// explode numbers in position
				.replace(/\d/g, (match)=>'-'.repeat(+match)).split('')
				// maps the pieces on the third row:
				// substitute coordinates if piece is a pawn, null otherwise
				.map((piece, index) => piece === 'p' ? ('abcdefgh'.charAt(index)+'3') : null)
				// filter non null
				.filter(index => index);
		}
		else if(turn === 'b') {
			// See comments above
			output = position.split('/')[4].replace(/\d/g, (match)=>'-'.repeat(+match)).split('').map((piece, index) => piece === 'P' ? ('abcdefgh'.charAt(index)+'6') : null).filter(index => index);
		}
		return output;
	}

	getSelectableCells() {
		let chess = new Chess(this.toFen());
		let output = [];
		'abcdefgh'.split('').map(col => {
			'12345678'.split('').map(row => {
				if(chess.get(col+row)) {
					output.push(col+row)
				}
				return true;
			});
			return true;
		});
		return output;
	}
}
