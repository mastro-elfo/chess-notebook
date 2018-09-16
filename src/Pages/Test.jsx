import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';

import Chessboard from '../Components/Chessboard';

class Test extends Component {
	render(){
		return(
			<Chessboard/>
		)
	}
}

const styles = theme => ({

});

export default withStyles(styles, {withTheme: true})(Test);
