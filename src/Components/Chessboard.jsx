import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import elementResizeEvent from 'element-resize-event';

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
		outline: [],
		size: 0
	}

	componentDidMount(){
		elementResizeEvent(this.refs.ChessboardContainer, this.onContainerResize.bind(this));
		this.onContainerResize();
	}

	render(){
		const {
			fen,
			disabled,
			showColumnLabels,
			showRowLabels
		} = this.props;

		// console.debug(showRowLabels, showColumnLabels);

		const {selected, outline} = this.state;

		const position = fen.split(" ")[0];
		const rows = position.split("/");

		const {classes} = this.props;
		const ClassDisabled = disabled ? classes.Disabled : null;

		return (
			<div ref="ChessboardContainer"
				className={classes.Container}>
				<div className={`${classes.Chessboard} ${ClassDisabled}`}
					style={{
						width: this.state.size,
						height: this.state.size
					}}>
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
			</div>
		);
	}

	onContainerResize(){
		const size = Math.min(
			this.refs.ChessboardContainer.clientWidth,
			this.refs.ChessboardContainer.clientHeight);
		this.setState({size});
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
		width: "100%",
		height: "100%",
		margin: "auto",
		boxShadow: "0 0 "+theme.shape.borderRadius+"px rgba(0,0,0,0.5)",
		borderRadius: theme.shape.borderRadius,
		overflow: "hidden"
	},
	Disabled: {
		position: "relative",
		"&:after": {
			content: '""',
			position: "absolute",
			top: 0, bottom: 0, left: 0, right: 0,
			margin: 0, paddin: 0, opacity: 0
		}
	},
	Container: {
		width: "100%",
		height: "100%"
	}
});

export default withStyles(styles, {withTheme: true})(Chessboard);
