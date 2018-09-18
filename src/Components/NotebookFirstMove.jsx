import React from 'react';

import Chip from '@material-ui/core/Chip';

export default function NotebookFirstMove (props) {
	const {
		game,
		line,
		withChip,
		history
	} = props;

	const {
		fen,
		move,
		value
	} = line;

	const split = fen.split(" ");
	const count = split[5];
	const turn = split[1];
	// If turn === "w", last move was black and vice versa
	if(withChip){
		if(turn === "b"){
			return ([
				<strong key="a">{count+"."}</strong>,
				<Chip
					key="b"
					label={move+(value||"")}
					onClick={()=>history.replace("/detail/"+game.id+"/"+line.id)}
					/>
			]);
		}
		else {
			return([
				<strong key="a">{(count -1)+". … "}</strong>,
				<Chip
					key="b"
					label={move+(value||"")}
					onClick={()=>history.replace("/detail/"+game.id+"/"+line.id)}
					/>
			]);
		}
	}
	else {
		return (
			<span>
				{
					turn === "b"
						? count+". "+move
						: (count -1)+". … "+move
				}
			</span>
		);
	}
}
