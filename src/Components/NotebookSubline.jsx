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

		const {
			classes,
			...other
		} = this.props;

		const children = game.lines.filter(item => item.parent === line.id);

		return (
			<div>
				{children.length > 0 &&
					<List
						className={classes.overflow}>
						{children.map((item, i) =>
							<NotebookSublineListitem
								{...other}
								key={i}
								line={item}
								divider={i < children.length -1}
								/>)}
					</List>
				}
			</div>
		);
	}
}

const styles = theme => ({
	overflow: {
		overflowX: "auto"
	}
});

export default withStyles(styles, {withTheme: true})(NotebookSubline);
