import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';

import NotebookFirstMove from './NotebookFirstMove';
import NotebookNextMove from './NotebookNextMove';

class NotebookSublineListitem extends Component {
	render(){
		const {
			game,
			line
		} = this.props;

		const list = this.getSubline(game, line);
		// console.debug(list, list.length);

		return (
			<ListItem>
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
							// console.debug(item.move)
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
			</ListItem>
		);
	}

	getSubline(game, line) {
		const children = game.lines.filter(item => item.parent === line.id);
		// console.debug(line, children, children.length);
		if(children.length === 0) {
			return [];
		}
		else if(children.length === 1) {
			// console.debug(line, children, children.length);
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
