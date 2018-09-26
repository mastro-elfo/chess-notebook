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

		onSelect: ()=>{},
		onDrop: ()=>{}
	}

	state = {}

	render(){
		const {
			row,
			rowIndex,
			side,
			selected,
			outline,
			classes,
			...other
		} = this.props;

		const exploded = row
			.replace(/(\d)/g, match => ' '.repeat(+match));

		const cells = exploded.split("")
			.map(item => item === ' ' ? null : item);
		let colIndexes = 'abcdefgh';

		if(side === "b"){
			cells.reverse();
			colIndexes = colIndexes.split('').reverse().join('');
		}

		return(
			<div className={classes.Row}>
				{
					cells.map((cell, i) => {
						const colIndex = colIndexes.charAt(i);
						const coord =colIndex+rowIndex;

						return (
							<ChessboardCell
								{...other}
								key={i}
								cell={cell}
								rowIndex={rowIndex}
								colIndex={colIndex}
								selected={selected === coord}
								outline={!!outline
									.find(item=>item===coord)
								}
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
