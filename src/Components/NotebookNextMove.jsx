import React from 'react';

import Chip from '@material-ui/core/Chip';

// import ThumbUpIcon from '@material-ui/icons/ThumbUp';
// import ThumbDownIcon from '@material-ui/icons/ThumbDown';

export default function NotebookNextMove (props) {
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

	if(withChip){
		if(turn === "b"){
			return ([
				<strong key="a">&nbsp;{count+"."}</strong>,
				<Chip
					key="b"
					label={move+(value||"")}
					onClick={()=>history.replace("/detail/"+game.id+"/"+line.id)}
					/>
			]);
		}
		else {
			return(
				<Chip
					label={move+(value||"")}
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
