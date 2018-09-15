import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import uuid from 'uuid/v1';
import Chess from 'chess.js/chess.min.js';

import Chessboard, {Pool} from './chessboard';
import {Local} from './Storage';

export default class New extends Component {
	constructor(props){
		super(props);
		this.state = {
			// General fields
			title: '',
			description: '',
			// Fen fields
			position: 'rnbqkbnr/pppppppp/8/3p4/4P3/8/PPPPPPPP/RNBQKBNR',
			turn: 'w',
			whiteCastling: 'KQ',
			blackCastling: 'kq',
			enPassant: '-',
			drawMoves: 0,
			totalMoves: 1,
			// Others
			selectedPiece: null,
			componentSize: Math.min(window.innerHeight, window.innerWidth /2)
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

						<Button>
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
					{
						// TODO: maybe insert chessboard here
					}

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

/*
<main>
		<div>
			<ul className="list">
				<li>
					<label>
						<h3>Title</h3>
						<input ref="title" placeholder="E.g. &quot;against the local champion&quot;" value={this.state.title} onChange={(e)=>this.setState({title: e.target.value})}/>
					</label>
				</li>
			</ul>
			<div style={{height: this.state.componentSize}}>
				<div className="column column-4 whitePool">
					<Pool pieces="KQRNBP" onClick={this.onClickPiece.bind(this)} selected={this.state.selectedPiece}/>
				</div>
				<div className="column column-2">
					<Chessboard fen={this.toFen()} selectableCells={selectableCells} onClick={this.onClickCell.bind(this)} onDrop={this.onDropCell.bind(this)}/>
				</div>
				<div className="column column-4 blackPool">
					<Pool pieces="kqrnbp" onClick={this.onClickPiece.bind(this)} selected={this.state.selectedPiece}/>
				</div>
			</div>
			<div className="clear"></div>
			<ul className="list">
				<li>
					<label>
						<h3>Description</h3>
						<textarea
							placeholder="E.g. &quot;The best match I've ever played&quot;"
							value={this.state.description}
							onChange={(e)=>this.setState({description: e.target.value})}
							></textarea>
					</label>
				</li>
				<li>
					<label>
						<h3>Turn</h3>
						<select
							value={this.state.turn}
							onChange={(e)=>this.setState({turn: e.target.value})}
							>
							<option value="w">White</option>
							<option value="b">Black</option>
						</select>
					</label>
				</li>
				<li>
					<label>
						<h3>White castling</h3>
						<select
							value={this.state.whiteCastling}
							onChange={(e)=>this.setState({whiteCastling: e.target.value})}
							>
							<option value="KQ">Both sides</option>
							<option value="K">King side</option>
							<option value="Q">Queen side</option>
							<option value="">None</option>
						</select>
					</label>
				</li>
				<li>
					<label>
						<h3>Black castling</h3>
						<select
							value={this.state.blackCastling}
							onChange={(e)=>this.setState({blackCastling: e.target.value})}
							>
							<option value="kq">Both sides</option>
							<option value="k">King side</option>
							<option value="q">Queen side</option>
							<option value="">None</option>
						</select>
					</label>
				</li>
				<li>
					<label>
						<h3>En passant</h3>
						<select
							value={this.state.enPassant}
							onChange={(e)=>this.setState({enPassant: e.target.value})}
							>
							<option value="-">None</option>
							{
								enPassantCandidates.map((cell, i) =>
									<option key={i} value={cell}>
										{cell}
									</option>
								)
							}
						</select>
					</label>
				</li>
				<li>
					<label>
						<h3>Draw moves</h3>
						<input
							type="number"
							min="0"
							max={this.state.totalMoves}
							placeholder="#"
							value={this.state.drawMoves}
							onChange={(e)=>this.setState({drawMoves: e.target.value})}/>
					</label>
				</li>
				<li>
					<label>
						<h3>Total moves</h3>
						<input
							type="number"
							min="1"
							placeholder="#"
							value={this.state.totalMoves}
							onChange={(e)=>this.setState({totalMoves: e.target.value})}/>
					</label>
				</li>
				<li>
					<label>
						<h3>Fen</h3>
						<p>
							{this.toFen()}
						</p>
					</label>
				</li>
			</ul>
		</div>
	</main>

	{this.state.openFromPGNDialog &&
		<Modal onClose={this.onCancelFromPGNDialog.bind(this)}>
			<h1>Load from PGN</h1>
			<p>Paste the PGN in this text input</p>

			<textarea placeholder="" value={this.state.pastePGN} onChange={this.onChangePGN.bind(this)}></textarea>

			{this.state.pastePGNValid === true && <p style={{color: 'green'}}>Valid PGN</p>}

			{this.state.pastePGNValid === false && <p style={{color: 'red'}}>Not a valid PGN</p>}

			{this.state.pastePGNValid !== true && this.state.pastePGNValid !== false && <p>&nbsp;</p>}

			<ModalButtons>
				<ModalButton title="Confirm" disabled={this.state.pastePGNValid !== true} onClick={this.onClickConfirmPGN.bind(this)}>
					<img src={ICONS['boxChecked']} alt="ok"/> Confirm
				</ModalButton>
				<ModalButton title="Cancel" onClick={()=>this.setState({openFromPGNDialog: false})}>
					<img src={ICONS['delete']} alt="x"/> Cancel
				</ModalButton>
			</ModalButtons>
		</Modal>
	}

	{this.state.requestTitle &&
		<Modal onClose={()=>this.setState({requestTitle: false})}>
			<h1>Title required</h1>
			<p>Title and description are useful to search games.</p>
			<p>
				<input placeholder="Write a title" value={this.state.title} onChange={(e)=>this.setState({title: e.target.value})}/>
			</p>
			<ModalButtons>
				<ModalButton title="Confirm" disabled={this.state.title.trim() === ''} onClick={this.onClickPlayGame.bind(this)}>
					<img src={ICONS['boxChecked']} alt="ok"/> Confirm
				</ModalButton>
				<ModalButton title="Cancel" onClick={()=>this.setState({requestTitle: false})}>
					<img src={ICONS['delete']} alt="x"/> Cancel
				</ModalButton>
			</ModalButtons>
		</Modal>
	}
</section>
 */
