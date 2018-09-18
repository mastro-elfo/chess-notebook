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
			line
		} = this.props;

		const superLine = game.lines.find(item => item.id === line.parent);
		const list = superLine
			? this.getSuperLine(game, superLine)
			: [];

		return (
			<List><ListItem>
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
			</ListItem></List>
		);
	}

	getSuperLine(game, line) {
		if(line.parent === null) {
			return [];
		}
		else {
			const superLine = game.lines.find(item => item.id === line.parent);
			return [].concat(this.getSuperLine(game, superLine), [line]);
		}
	}
}

const styles = theme => ({

});

export default withStyles(styles, {withTheme: true})(NotebookSuperLine);
