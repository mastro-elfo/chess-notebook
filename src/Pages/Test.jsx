import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';

import Chessboard from '../Components/Chessboard';

class Test extends Component {
	render(){
		return(
			<div style={{
					width: "100%",
					height: "100%",
					position: "absolute"
				}}>
				<Chessboard/>
			</div>
		)
	}
}

const styles = theme => ({

});

export default withStyles(styles, {withTheme: true})(Test);
