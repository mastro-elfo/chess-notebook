import React from 'react';

import { withStyles } from '@material-ui/core/styles';
// import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

function NewGameContent (props) {
	const {
		title, description, position, turn, whiteCastling, blackCastling, enPassant, drawMoves, totalMoves,
		onChange
	} = props;

	const enPassantCandidates = getEnPassantCandidates(position, turn);

	return (
		<Grid container>
			<Grid item
				xs={12} sm={6} md={4}>
				<TextField
					value={title}
					onChange={({target})=>onChange({title: target.value})}
					label="Title"
					placeholder="Game title"
					fullWidth
					/>
			</Grid>

			<Grid item
				xs={12} sm={6} md={8}>
			</Grid>

			<Grid item
				xs={12} sm={6} md={4}>
				<TextField
					value={description}
					onChange={({target})=>onChange({description: target.value})}
					label="Description"
					placeholder="Game description"
					fullWidth
					multiline
					rows={4}
					/>
			</Grid>

			<Grid item
				xs={12} sm={6} md={4}>
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

			<Grid item
				xs={12} sm={6} md={4}>
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

			<Grid item
				xs={12} sm={6} md={4}>
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

			<Grid item
				xs={12} sm={6} md={4}>
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

			<Grid item
				xs={12} sm={6} md={4}>
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

			<Grid item
				xs={12} sm={6} md={4}>
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
		</Grid>
	);
}

const styles = theme => ({

});

export default withStyles(styles)(NewGameContent);

function getEnPassantCandidates(position, turn) {
	let output = [];
	if(turn === 'w') {
		// find coordinates of black pawns on the fifth row
		output = position
			// extract the fifth row (third in fen)
			.split('/')[3]
			// explode numbers in position
			.replace(/\d/g, (match)=>'-'.repeat(+match)).split('')
			// maps the pieces on the third row:
			// substitute coordinates if piece is a pawn, null otherwise
			.map((piece, index) => piece === 'p' ? ('abcdefgh'.charAt(index)+'6') : null)
			// filter non null
			.filter(index => index);
	}
	else if(turn === 'b') {
		// See comments above
		output = position.split('/')[4].replace(/\d/g, (match)=>'-'.repeat(+match)).split('').map((piece, index) => piece === 'P' ? ('abcdefgh'.charAt(index)+'3') : null).filter(index => index);
	}
	return output;
}
