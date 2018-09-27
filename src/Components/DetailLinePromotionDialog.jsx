import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import PieceToIcon from '../Utils/PieceToIcon';

export default function (props) {
	const {
		promotion, onClose, onRequestMove
	} = props;

	return (
		<Dialog
			open={!!promotion}
			onClose={onClose}>
			<DialogContent>
				<Grid container
					justify="center">
					{
						// TODO: this can be simplified
					}
					<Grid item>
						<IconButton
							onClick={()=>onRequestMove(promotion.start, promotion.end, "q")}>
							<img alt="Queen" src={PieceToIcon(promotion.color === "w" ? "Q" : "q")}/>
						</IconButton>
					</Grid>
					<Grid item>
						<IconButton
							onClick={()=>onRequestMove(promotion.start, promotion.end, "r")}>
							<img alt="Rook" src={PieceToIcon(promotion.color === "w" ? "R" : "r")}/>
						</IconButton>
					</Grid>
					<Grid item>
						<IconButton
							onClick={()=>onRequestMove(promotion.start, promotion.end, "n")}>
							<img alt="Knight" src={PieceToIcon(promotion.color === "w" ? "N" : "n")}/>
						</IconButton>
					</Grid>
					<Grid item>
						<IconButton
							onClick={()=>onRequestMove(promotion.start, promotion.end, "b")}>
							<img alt="Bishop" src={PieceToIcon(promotion.color === "w" ? "B" : "b")}/>
						</IconButton>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}
