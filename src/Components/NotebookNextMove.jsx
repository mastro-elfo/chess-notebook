import React from 'react';

import Chip from '@material-ui/core/Chip';

export default function NotebookNextMove (props) {
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

	if(withChip){
		if(turn === "b"){
			return ([
				<span key="a">{" "+count+"."}</span>,
				<Chip
					key="b"
					label={move}
					onClick={()=>history.replace("/detail/"+game.id+"/"+line.id)}
					/>
			]);
		}
		else {
			return(
				<Chip
					label={move}
					onClick={()=>history.replace("/detail/"+game.id+"/"+line.id)}
					/>
			);
		}
	}
	else {
		return (
			<span>
				<span>
					{
						turn === "b"
							? " "+count+". "+move
							: " "+move
					}
				</span>
			</span>
		);
	}
}
