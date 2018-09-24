import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import NotebookFirstMove from './NotebookFirstMove';
import NotebookNextMove from './NotebookNextMove';

class NotebookSuperLine extends Component {
	render(){
		const {
			game,
			line,
			classes
		} = this.props;

		const superLine = game.lines.find(item => item.id === line.parent);
		const list = superLine
			? this.getSuperLine(game, superLine)
			: [];

		return (
			<List
				className={classes.overflow}>
				<ListItem>
					{
						(list.length > 0) &&
						<NotebookFirstMove
							{...this.props}
							line={list[0]}
							withChip
							/>
					}

					{
						(list.length > 1) &&
						list.slice(1).map((item, i)=>
							<NotebookNextMove
								key={i}
								{...this.props}
								line={item}
								withChip
								/>)
					}
				</ListItem>
			</List>
		);
	}

	getSuperLine(game, line) {
		if(line === undefined || line.parent === null || line.move === null) {
			return [];
		}
		else {
			const superLine = game.lines.find(item => item.id === line.parent);
			return [].concat(this.getSuperLine(game, superLine), [line]);
		}
	}
}

const styles = theme => ({
	overflow: {
		overflowX: "auto"
	}
});

export default withStyles(styles, {withTheme: true})(NotebookSuperLine);
