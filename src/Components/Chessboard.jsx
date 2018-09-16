import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import ChessboardRow from './ChessboardRow';

class Chessboard extends Component {
	static defaultProps = {
		fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
		disabled: false,
		showColumnLabels: "abcdefgh".split('').map(i=>i+"1"),
		showRowLabels: "12345678".split('').map(i=>"a"+i)
	}

	state = {
		selected: false,
		outline: []
	}

	render(){
		const {
			fen,
			disabled,
			showColumnLabels,
			showRowLabels
		} = this.props;

		console.debug(showRowLabels, showColumnLabels);

		const {selected, outline} = this.state;

		const position = fen.split(" ")[0];
		const rows = position.split("/");

		const {classes} = this.props;
		const ClassDisabled = disabled ? classes.Disabled : null;
		return (
			<div className={`${classes.Chessboard}  ${ClassDisabled}`}>
				{
					rows.map((row, i) =>
						<ChessboardRow
							key={i}
							row={row}
							rowIndex={8-i}
							selected={selected}
							onSelect={(a)=>this.handleToggleSelect(a)}
							outline={outline}
							showColumnLabels={showColumnLabels}
							showRowLabels={showRowLabels}
							/>
					)
				}
			</div>
		);
	}

	handleToggleSelect(coord) {
		const {selected} = this.state;
		if(selected === coord){
			this.setState({
				selected: false
			})
		}
		else {
			this.setState({
				selected: coord
			})
		}
	}

	handleToggleOutline(coord){
		let outline = this.state.outline.slice();
		const index = outline.findIndex(item=>item===coord);
		if(index === undefined) {
			outline.push(coord);
		}
		else {
			outline.splice(index, 1);
		}
		this.setState({outline});
	}
}

const styles = theme => ({
	Chessboard: {
		width: 64 *theme.spacing.unit,
		height: 64 *theme.spacing.unit,
		borderRadius: theme.shape.borderRadius,
		overflow: "hidden",
		boxShadow: "0 0 "+theme.spacing.unit+"px rgba(0,0,0,0.5)"
	},
	Disabled: {
		position: "relative",
		"&:after": {
			content: '""',
			position: "absolute",
			top: 0, left: 0, right: 0, bottom: 0,
			zIndex: 1
		}
	}
});

export default withStyles(styles, {withTheme: true})(Chessboard);
