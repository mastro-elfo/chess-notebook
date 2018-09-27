import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';

import NotebookFirstMove from './NotebookFirstMove';
import NotebookNextMove from './NotebookNextMove';

class NotebookSublineListitem extends Component {
	render(){
		const {
			game,
			line,
			divider,
			linesSelected,
			onToggleLineSelect
		} = this.props;

		const list = this.getSubline(game, line);

		// TODO: add check box to manage lines
		const isChecked = !!linesSelected.find(item => item === line.id);

		return (
			<ListItem
				divider={divider}>
				<NotebookFirstMove
					{...this.props}
					withChip
					/>

				{
					(list.length > 0) &&
					list.map((item, i)=>{
						if(typeof item === "number"){
							return <span key={i}>(+{item})</span>;
						}
						else {
							return (
								<NotebookNextMove
									{...this.props}
									key={i}
									line={item}
									withChip
									/>
							);
						}
					})
				}

				<ListItemSecondaryAction
					onClick={() => onToggleLineSelect(line.id)}>
					<Checkbox
						checked={isChecked}/>
				</ListItemSecondaryAction>
			</ListItem>
		);
	}

	getSubline(game, line) {
		const children = game.lines.filter(item => item.parent === line.id);
		if(children.length === 0) {
			return [];
		}
		else if(children.length === 1) {
			return children.concat(this.getSubline(game, children[0]));
		}
		else {
			return [children.length];
		}
	}
}

const styles = theme => ({

});

export default withStyles(styles, {withTheme: true})(NotebookSublineListitem);
