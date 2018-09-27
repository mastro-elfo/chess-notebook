import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import Chess from 'chess.js';

import Chessboard from './Chessboard';
import getEnPassantCandidates from '../Utils/EnPassantCandidates';
import toFen from '../Utils/ToFen';

class NewGameContent extends Component {
	render(){
		const {title, description, position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves,
			onChange, onRequestMove,
			classes
		} = this.props;

		const enPassantCandidates = getEnPassantCandidates(position, turn);

		let chess = new Chess();

		const chessboard =
			<Chessboard
				fen={position}
				onRequestMove={onRequestMove}
				/>

		return (
			<main className={classes.main}>
				<Grid container>
					<Hidden xsDown>
						<Grid item sm={6}>
							<Grid container>
								<Grid item sm={12}>
									<div style={{height: "20em"}}>
										{chessboard}
									</div>
								</Grid>
							</Grid>
						</Grid>
					</Hidden>

					<Grid item xs={12} sm={6}>
						<Grid container>
							<Grid item xs={12}>
								<TextField
									value={title}
									onChange={({target})=>onChange({title: target.value})}
									label="Title"
									placeholder="Game title"
									fullWidth
									/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									value={description}
									onChange={({target})=>onChange({description: target.value})}
									label="Description"
									placeholder="Game description"
									fullWidth
									multiline
									rows={1}
									/>
							</Grid>

							<Hidden smUp>
								<Grid item xs={12}>
									<Grid container>
										<Grid item xs={12}>
											<div style={{height: "20em"}}>
												{chessboard}
											</div>
										</Grid>
									</Grid>
								</Grid>
							</Hidden>

							<Grid item xs={12} md={12} lg={4}>
								<TextField
									select
									value={turn}
									onChange={({target})=>onChange({turn: target.value})}
									label="Turn"
									placeholder="Select turn"
									fullWidth>
									<MenuItem value="w">White</MenuItem>
									<MenuItem value="b">Black</MenuItem>
								</TextField>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<TextField
									select
									value={whiteCastling}
									onChange={({target})=>onChange({whiteCastling: target.value})}
									label="White castling"
									placeholder="Select castling"
									fullWidth>
									<MenuItem value="KQ">Both sides</MenuItem>
									<MenuItem value="K">King side</MenuItem>
									<MenuItem value="Q">Queen side</MenuItem>
									<MenuItem value="-">None</MenuItem>
								</TextField>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<TextField
									select
									value={blackCastling}
									onChange={({target})=>onChange({blackCastling: target.value})}
									label="Black castling"
									placeholder="Select castling"
									fullWidth>
									<MenuItem value="kq">Both sides</MenuItem>
									<MenuItem value="k">King side</MenuItem>
									<MenuItem value="q">Queen side</MenuItem>
									<MenuItem value="-">None</MenuItem>
								</TextField>
							</Grid>

							<Grid item xs={12} md={12} lg={4}>
								<TextField
									select
									value={
										enPassantCandidates.indexOf(enPassant) !== -1
										? enPassant : "-"
									}
									onChange={({target})=>onChange({enPassant: target.value})}
									label="En passant"
									placeholder="Select en passant capture"
									fullWidth>
									<MenuItem value="-">None</MenuItem>
									{
										enPassantCandidates
										.map(item => (
											<MenuItem
												key={item}
												value={item}>
												{item}
											</MenuItem>
										))
									}
								</TextField>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<TextField
									value={drawMoves}
									onChange={({target})=>onChange({drawMoves: target.value})}
									label="Draw moves"
									placeholder="Draw moves"
									fullWidth
									type="number"
									inputProps={{
										min: 0
									}}
									error={totalMoves < 0}
									/>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<TextField
									value={totalMoves}
									onChange={({target})=>onChange({totalMoves: target.value})}
									label="Total moves"
									placeholder="Total moves"
									fullWidth
									type="number"
									inputProps={{
										min: 1
									}}
									error={totalMoves < 1}
									/>
							</Grid>

							<Hidden mdDown>
								<Grid item xs={12}>
									<TextField
										multiline readOnly fullWidth
										value={toFen(position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves)}
										label="FEN"
										error={!chess.load(toFen(position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves))}
										/>
								</Grid>
							</Hidden>
						</Grid>
					</Grid>

					<Hidden lgUp>
						<Grid item xs={12}>
							<TextField
								multiline readOnly fullWidth
								value={toFen(position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves)}
								label="FEN"
								error={!chess.load(toFen(position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves))}
								/>
						</Grid>
					</Hidden>
				</Grid>
			</main>
		);
	}
}

const styles = theme => ({
	main: {
		padding: theme.spacing.unit
	}
});

export default withStyles(styles)(NewGameContent);
