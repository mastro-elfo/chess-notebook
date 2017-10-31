import React from 'react';
import {Link} from 'react-router-dom';
import Chess from 'chess.js/chess.min.js';
import Chessboard, {Pool} from './chessboard';
import {GameStorage} from './storage';
import Modal from './Modal';
import {ICONS} from './icons';
import './newgame.css';

export default class New extends React.Component {
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
			openFromPGNDialog: false
		};
		this.storage = new GameStorage();
		this.onClickPlayGame = this.onClickPlayGame.bind(this);
	}

	componentDidMount(){
		this.refs.title.focus();
	}

	toFen(){
		const castling = (this.state.whiteCastling === '' && this.state.blackCastling === '')? '-' : this.state.whiteCastling+this.state.blackCastling;
		return [this.state.position, this.state.turn, castling, this.state.enPassant, this.state.drawMoves, this.state.totalMoves].join(' ');
	}

	onClickPlayGame(){
		// Retrieve Title: if empty don't save
		const title = this.state.title;
		if(title === '') {
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

	onChessboardResize(size){
		this.setState({
			chessboardSize: size
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

	onPastePGN(pgn) {
		pgn = pgn.replace(/Sent from my .*$/, '').replace(' [', '[').replace(' 1.', '1.'); // Should improve this
		let chess = new Chess();
		if(chess.load_pgn(pgn)) {
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
				totalMoves: fen[5]
			});
		}
		else {
			console.error('Not a valid PGN', pgn);
			console.error('ASCII', chess.ascii());
		}
		this.setState({
			openFromPGNDialog: false
		});
	}

	render(){
		const enPassantCandidates = this.getEnPassantCandidates();
		const selectableCells = this.getSelectableCells();
		return (
			<section className="Newgame">
				<header>
					<div>
						<Link to="/" className="button left" title="Back to dashboard">
							<div><img alt="back" src={ICONS['back']}/></div>
						</Link>
						<button className="button right" onClick={this.onClickPlayGame} title="Play this position">
							<div><img alt="Play" src={ICONS['play']}/></div>
						</button>
						<button className="button right" disabled={this.state.position === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'} onClick={this.onClickResetPosition.bind(this)} title="Reset to start position">
							<div><img alt="Reset" src={ICONS['rew']}/></div>
						</button>
						<button className="button right" title="Load from PGN" onClick={this.onClickOpenFromPGNDialog.bind(this)}>
							<div><img alt="pgn" src={ICONS['pgn']}/></div>
						</button>
						<h1>New</h1>
					</div>
				</header>
				<main>
					<div>
						<ul className="list">
							<li>
								<label>
									<span>Title</span>
									<input ref="title" placeholder="E.g. &quot;against the local champion&quot;" value={this.state.title} onChange={(e)=>this.setState({title: e.target.value})}/>
								</label>
							</li>
						</ul>
						<div>
							<div className="column column-4 whitePool">
								<Pool pieces="KQRNBP" size={this.state.chessboardSize} onClick={this.onClickPiece.bind(this)} selected={this.state.selectedPiece}/>
							</div>
							<div className="column column-2">
								<Chessboard fen={this.toFen()} selectableCells={selectableCells} onClick={this.onClickCell.bind(this)} onDrop={this.onDropCell.bind(this)} onResize={this.onChessboardResize.bind(this)}/>
							</div>
							<div className="column column-4 blackPool">
								<Pool pieces="kqrnbp" size={this.state.chessboardSize} onClick={this.onClickPiece.bind(this)} selected={this.state.selectedPiece}/>
							</div>
						</div>
						<div className="clear"></div>
						<ul className="list">
							<li>
								<label>
									<span>Description</span>
									<textarea
										placeholder="E.g. &quot;The best match I've ever played&quot;"
										value={this.state.description}
										onChange={(e)=>this.setState({description: e.target.value})}
										></textarea>
								</label>
							</li>
							<li>
								<label>
									<span>Turn</span>
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
									<span>White castling</span>
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
									<span>Black castling</span>
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
									<span>En passant</span>
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
									<span>Draw moves</span>
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
									<span>Total moves</span>
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
									<span>Fen</span>
									<p>
										{this.toFen()}
									</p>
								</label>
							</li>
						</ul>
					</div>
				</main>
				<Modal show={this.state.openFromPGNDialog} onCancel={this.onCancelFromPGNDialog.bind(this)}>
					<div className="title">Load from PGN</div>
					<div>
						<textarea placeholder="Paste the PGN here" onChange={(e)=>this.onPastePGN(e.target.value) || (e.target.value = '')}></textarea>
					</div>
				</Modal>
			</section>
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
