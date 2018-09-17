import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';

import NotebookSublineListitem from './NotebookSublineListitem';

class NotebookSubline extends Component {
	render(){
		const {
			game,
			line
		} = this.props;

		const children = game.lines.filter(item => item.parent === line.id);

		return (
			<div>
				{children.length > 0 &&
					<List>
						{children.map((item, i) =>
							<NotebookSublineListitem
								key={i}
								{...this.props}
								line={item}
								/>)}
					</List>
				}
			</div>
		);
	}
}

const styles = theme => ({

});

export default withStyles(styles, {withTheme: true})(NotebookSubline);
