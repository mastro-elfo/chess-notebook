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

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import Chess from 'chess.js/chess.min.js';

import Chessboard, {Pool} from './chessboard';
import {GameStorage, LineStorage, SettingsStorage} from './storage';

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
			componentSize: Math.min(window.innerHeight, window.innerWidth /2)
		};
		this.storage = new GameStorage();
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
		const castling = (this.state.whiteCastling === '' && this.state.blackCastling === '')? '-' : this.state.whiteCastling+this.state.blackCastling;
		return [this.state.position, this.state.turn, castling, this.state.enPassant, this.state.drawMoves, this.state.totalMoves].join(' ');
	}

	onClickPlayGame(){
		// Retrieve Title: if empty don't save
		const title = this.state.title;
		if(title === '') {
			this.setState({
				requestTitle: true
			});
			return;
		}

		// Retrieve FEN: validate, if invalid don't save
		const fen = this.toFen();

		// Create game object and Save
		const game = this.storage.saveGame({
			title: title,
			side: this.state.turn,
			lines: [
				{
					id: 0,
					fen: fen,
					comment: this.state.description,
					move: null,
					parent: null,
					value: null,
					positionValue: null,
					play: true
				}
			]
		});

		// Redirect to detail
		this.props.history.push(`/detail/${game.id}`)
	}

	onClickCell(cell){
		let chess = new Chess(this.toFen());
		if(this.state.selectedPiece) {
			chess.put({
				type: this.state.selectedPiece.toLowerCase(),
				color: this.state.selectedPiece === this.state.selectedPiece.toLowerCase() ? 'b' : 'w'
			}, cell);
		}
		else {
			chess.remove(cell);
		}
		this.setState({
			position: chess.fen().split(' ')[0]
		});
	}

	onClickPiece(piece) {
		this.setState({
			selectedPiece: this.state.selectedPiece === piece ? null : piece
		});
	}

	onDropCell(start, end){
		let chess = new Chess(this.toFen());
		if('KQRNBPkqrnbp'.indexOf(start) !== -1) {
			// Is a piece
			chess.put({
				type: start.toLowerCase(),
				color: start === start.toLowerCase() ? 'b' : 'w'
			}, end);
		}
		else {
			// Is a cell
			const piece = chess.get(start);
			chess.remove(start);
			chess.put(piece, end);
		}

		this.setState({
			position: chess.fen().split(' ')[0]
		});
	}

	onClickResetPosition(){
		this.setState({
			position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
		});
	}

	onClickOpenFromPGNDialog(){
		this.setState({
			openFromPGNDialog: true
		});
	}

	onCancelFromPGNDialog(){
		this.setState({
			openFromPGNDialog: false
		});
	}

	onChangePGN(event){
		// Get the PGN from input
		let pgn = event.target.value;

		// Remove spaces and final comments
		pgn = pgn.replace(/\n\s(.)/g, "\n$1").replace(/[\n\s]{2}.+$/, '');

		// Remove setup 1, or load_pgn will fail without a fen
		pgn = pgn.replace(/\[setup "1"]/i, '');

		// If PGN is empty, validity is undefined
		if(pgn.trim() === '') {
			this.setState({
				pastePGN: '',
				pastePGNValid: undefined
			});
			return;
		}

		let chess = new Chess();

		// Parse the PGN
		if(chess.load_pgn(pgn)) {
			// PGN is valid
			this.setState({
				pastePGNValid: true
			});
		}
		else {
			// Not a valid PGN
			console.error('Not a valid PGN', pgn);
			console.error('ASCII', chess.ascii());
			this.setState({
				pastePGNValid: false
			});
		}

		this.setState({
			pastePGN: pgn
		});
	}

	onClickConfirmPGN(){
		let chess = new Chess();
		const pgn = this.state.pastePGN;
		chess.load_pgn(pgn);
		const fen = chess.fen().split(' ');
		const title =
			pgn.match(/\[Event "(.+?)"\]/)[1]
			|| 'No title';
		const description =
			(pgn.match(/\[White "(.+?)"\]/)[1] + ' - ' + pgn.match(/\[Black "(.+?)"\]/)[1] + "\n" + pgn.match(/\[Site "(.+?)"\]/)[1] + "\n" +  pgn.match(/\[Date "(.+?)"\]/)[1])
			|| 'No description';

		this.setState({
			title: title,
			description: description,
			position: fen[0],
			turn: fen[1],
			whiteCastling: fen[2].match(/[KQ]+/g) || '',
			blackCastling: fen[2].match(/[kq]+/g) || '',
			enPassant: fen[3],
			drawMoves: fen[4],
			totalMoves: fen[5],

			openFromPGNDialog: false
		});
	}

	render(){
		const enPassantCandidates = this.getEnPassantCandidates();
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

						<Button>
							Reset
						</Button>

						<IconButton
							onClick={this.onClickPlayGame.bind(this)}>
							<PlayArrowIcon/>
						</IconButton>
					</Toolbar>
				</AppBar>
				<FormControl>
					<TextField
						label="Title"
						fullWidth
						value=""
						/>

					<TextField
						label="Description"
						fullWidth
						value=""
						/>

					{
						// TODO: maybe insert chessboard here
					}

					<Select>
						<MenuItem value="">White</MenuItem>
						<MenuItem value="">Black</MenuItem>
					</Select>

					<Select>
						<MenuItem value="">Both sides</MenuItem>
						<MenuItem value="">King side</MenuItem>
						<MenuItem value="">Queen side</MenuItem>
						<MenuItem value="">None</MenuItem>
					</Select>

					<Select>
						<MenuItem value="">Both sides</MenuItem>
						<MenuItem value="">King side</MenuItem>
						<MenuItem value="">Queen side</MenuItem>
						<MenuItem value="">None</MenuItem>
					</Select>

					<Select>
						<MenuItem value="">None</MenuItem>
					</Select>

					<TextField
						label="Draw moves"
						fullWidth
						value={0}
						/>

					<TextField
						label="Total moves"
						fullWidth
						value={1}
						/>

					<TextField
						label="Fen"
						fullWidth
						readOnly
						value=""
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
			output = position.split('/')[3].replace(/\d/g, (match)=>'-'.repeat(+match)).split('').map((piece, index) => piece === 'p' ? ('abcdefgh'.charAt(index)+'3') : null).filter(index => index);
		}
		else if(turn === 'b') {
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
