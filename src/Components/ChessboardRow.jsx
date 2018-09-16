import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import ChessboardCell from './ChessboardCell';

class ChessboardRow extends Component {
	static defaultProps = {
		row: "8",
		rowIndex: "0",
		selected: false,
		outline: [],
		showColumnLabels: [],
		showRowLabels: [],

		onSelect: ()=>{}
	}

	state = {}

	render(){
		const {
			row,
			rowIndex,
			selected,
			outline,
			showRowLabels,
			showColumnLabels
		} = this.props;

		const exploded = row
			.replace(/(\d)/g, match => ' '.repeat(+match));
		const cells = exploded.split("")
			.map(item => item === ' ' ? null : item);

		const {classes} = this.props;
		return(
			<div className={classes.Row}>
				{
					cells.map((cell, i) => {
						const colIndex = 'abcdefgh'.charAt(i);
						const coord =colIndex+rowIndex;

						return (
							<ChessboardCell
								key={i}
								cell={cell}
								rowIndex={rowIndex}
								colIndex={colIndex}
								selected={selected === coord}
								onSelect={this.props.onSelect}
								outline={!!outline
									.find(item=>item===coord)
								}
								showColumnLabels={!!showColumnLabels
									.find(item=>item===coord)}
								showRowLabels={!!showRowLabels
									.find(item=>item===coord)}
								/>
						);
					})
				}
			</div>
		)
	}
}

const styles = theme => ({
	Row: {
		width: "100%",
		height: "12.5%",
		float: "left"
	}
});

export default withStyles(styles, {withTheme: true})(ChessboardRow);
