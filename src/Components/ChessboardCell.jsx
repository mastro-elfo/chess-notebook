import React, {Component} from 'react';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import PieceToIcon from '../Utils/PieceToIcon';

class ChessboardCell extends Component {
	static defaultProps = {
		cell: null,
		rowIndex: "0",
		colIndex: "0",
		selected: false,
		outline: false,
		showLabels: true,

		onSelect: ()=>{},
		onDrop: ()=>{}
	}

	state = {
		over: false
	}

	render(){
		const {
			cell,
			rowIndex,
			colIndex,
			selected,
			outline,
			showLabels,
			classes,
			// ...other
		} = this.props;

		const {
			over
		} = this.state;

		const isDark = (('aceg'.indexOf(colIndex) !== -1 && (rowIndex % 2 === 1)) || ('bdfh'.indexOf(colIndex) !== -1 && (rowIndex % 2 === 0)));

		return(
			<div
				className={
					classNames(classes.Cell, {
						[classes.Dark]: isDark,
						[classes.Light]: !isDark,
						[classes.Selected]: selected,
						[classes.Outline]: outline,
						[classes.OverDark]: !selected && isDark && over,
						[classes.OverLight]: !selected && !isDark && over,
						[classes.OverSelected]: selected && over
					})}
				onClick={()=>this.handleClick()}
				onDrop={this.handleDrop.bind(this)}
				onDragOver={this.handleDragOver.bind(this)}
				onDragLeave={this.handleDragLeave.bind(this)}>
				{cell &&
					<img
						className={classes.Piece}
						alt={cell}
						src={PieceToIcon(cell)}
						draggable
						onDragStart={(e)=>this.handleDragStart(colIndex+rowIndex, e)}
						/>}
				{showLabels &&
					<small className={classNames("Label", "RowLabel", classes.RowLabel)}>
						<small>{rowIndex}</small>
					</small>}

				{showLabels &&
					<small className={classNames("Label", "ColLabel", classes.ColLabel)}>
						<small>{colIndex}</small>
					</small>}
			</div>
		)
	}

	handleClick(){
		const {rowIndex, colIndex, onSelect} = this.props;
		onSelect(colIndex+rowIndex);
	}

	handleDrop(event){
		event.preventDefault();
		this.setState({over: false});
		const {rowIndex, colIndex, onDrop} = this.props;
		onDrop(event.dataTransfer.getData("text"), colIndex+rowIndex);
	}

	handleDragOver(event){
		event.preventDefault();
		this.setState({over: true});
	}

	handleDragLeave(event){
		event.preventDefault();
		this.setState({over: false});
	}

	handleDragStart(coord, event){
		event.dataTransfer.setData("text", coord);
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
	OverDark: {
		backgroundColor: emphasize(theme.palette.primary.main, 0.3)
	},
	OverLight: {
		backgroundColor: emphasize("#fffff0")
	},
	OverSelected: {
		backgroundColor: emphasize(theme.palette.secondary.main)
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
