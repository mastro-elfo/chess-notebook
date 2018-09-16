import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import PieceToIcon from './PieceToIcon';

class ChessboardCell extends Component {
	static defaultProps = {
		cell: null,
		rowIndex: "0",
		colIndex: "0",
		selected: false,
		outline: false,
		showColumnLabels: true,
		showRowLabels: true,

		onSelect: ()=>{}
	}

	state = {}

	render(){
		const {
			cell,
			rowIndex,
			colIndex,
			selected,
			outline,
			showColumnLabels,
			showRowLabels
		} = this.props;

		// const coord = colIndex+rowIndex;

		const {classes} = this.props;
		let cellClasses = [classes.Cell];

		('aceg'.indexOf(colIndex) !== -1 && (rowIndex % 2 === 1))
		|| ('bdfh'.indexOf(colIndex) !== -1 && (rowIndex % 2 === 0))
		? cellClasses.push(classes.Dark)
		: cellClasses.push(classes.Light);

		selected ? cellClasses.push(classes.Selected) : 0;
		outline ? cellClasses.push(classes.Outline) : 0;

		return(
			<div
				className={cellClasses.join(' ')}
				onClick={()=>this.handleClick()}>
				{cell &&
					<img
						className={classes.Piece}
						alt={cell}
						src={PieceToIcon(cell)}
						/>}
				{showRowLabels &&
					<small className={classes.RowLabel}>
						{rowIndex}
					</small>}

				{showColumnLabels &&
					<small className={classes.ColLabel}>
						{colIndex}
					</small>}
			</div>
		)
	}

	handleClick(){
		const {rowIndex, colIndex} = this.props;
		const coord = colIndex+rowIndex;
		this.props.onSelect(coord);
	}
}

const styles = theme => ({
	Cell: {
		width: "12.5%",
		height: "100%",
		float: "left",
		position: "relative"
	},
	Dark: {
		backgroundColor: theme.palette.primary.main,
		"&:hover": {
			backgroundColor: emphasize(theme.palette.primary.main, 0.3)
		}
	},
	Light: {
		backgroundColor: "#fffff0",
		"&:hover": {
			backgroundColor: emphasize("#fffff0")
		}
	},
	Selected: {
		backgroundColor: theme.palette.secondary.main,
		"&:hover": {
			backgroundColor: emphasize(theme.palette.secondary.main)
		}
	},
	Outline: {
		position: "relative",
		"&:after": {
			content: '""',
			display: "block",
			width: "50%",
			height: "50%",
			margin: "0",
			position: "absolute",
			top: "25%", left: "25%",
			borderRadius: "100%",
			backgroundColor: "rgba(0,0,0,0.25)"
		}
	},
	Piece: {
		width: "80%",
		height: "80%",
		position: "absolute",
		top: "10%", left: "10%"
	},
	RowLabel: {
		position: "absolute",
		top: 0, left: 0,
		color: theme.palette.text.hint
	},
	ColLabel: {
		position: "absolute",
		bottom: 0, right: 0,
		color: theme.palette.text.hint
	}
});

export default withStyles(styles, {withTheme: true})(ChessboardCell);
