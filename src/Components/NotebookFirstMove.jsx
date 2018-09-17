import React from 'react';

import Chip from '@material-ui/core/Chip';

export default function NotebookFirstMove (props) {
	const {
		game,
		line,
		withChip,
		history
	} = props;

	const {fen, move} = line;
	const split = fen.split(" ");
	const count = split[5];
	const turn = split[1];
	// If turn === "w", last move was black and vice versa
	if(withChip){
		if(turn === "b"){
			return ([
				<span key="a">{count+"."}</span>,
				<Chip
					key="b"
					label={move}
					onClick={()=>history.replace("/detail/"+game.id+"/"+line.id)}
					/>
			]);
		}
		else {
			return([
				<span key="a">{(count -1)+". … "}</span>,
				<Chip
					key="b"
					label={move}
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
