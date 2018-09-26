import React, {Component} from 'react';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import elementResizeEvent from 'element-resize-event';

import ChessboardRow from './ChessboardRow';

class Chessboard extends Component {
	static defaultProps = {
		side: "w",
		fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
		disabled: false,
		showLabels: true,
		onRequestMove: ()=>{}
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
			side,
			classes,
			...other
		} = this.props;

		const {selected, outline} = this.state;

		const position = fen.split(" ")[0];
		const rows = position.split("/");

		return (
			<div ref="ChessboardContainer"
				className={classes.Container}>
				<div className={classNames(classes.Chessboard, {[classes.Disabled]: disabled})}
					style={{
						width: this.state.size,
						height: this.state.size
					}}>
					{side === "w" &&
						rows.map((row, i) =>
							<ChessboardRow
								{...other}
								key={i}
								row={row}
								rowIndex={8-i}
								side={side}
								selected={selected}
								onSelect={this.handleToggleSelect.bind(this)}
								outline={outline}
								onDrop={this.handleDrop.bind(this)}
								/>
						)
					}

					{side === "b" &&
						rows.reverse().map((row, i) =>
							<ChessboardRow
								{...other}
								key={i}
								row={row}
								rowIndex={1+i}
								side={side}
								selected={selected}
								onSelect={this.handleToggleSelect.bind(this)}
								outline={outline}
								onDrop={this.handleDrop.bind(this)}
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
		const {onRequestMove} = this.props;
		if(selected === coord){
			this.setState({
				selected: false
			})
		}
		else {
			onRequestMove(selected, coord);
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

	handleClick(coord) {

	}

	handleDrop(start, end){
		// console.debug("Drop", start, end);
		this.props.onRequestMove(start, end);
	}
}

const styles = theme => ({
	Chessboard: {
		width: "100%",
		height: "100%",
		margin: "auto",
		boxShadow: "0 0 "+theme.shape.borderRadius+"px rgba(0,0,0,0.5)",
		borderRadius: theme.shape.borderRadius,
		overflow: "hidden",
		"& .Label": {
			display: "none"
		},
		"& > * > :first-child > .RowLabel": {
			display: "inline"
		},
		"& > :last-child > * > .ColLabel": {
			display: "inline"
		}
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
