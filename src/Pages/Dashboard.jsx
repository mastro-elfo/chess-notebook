import React, {Component} from 'react';

import DashboardHeader from '../Components/DashboardHeader';
import DashboardContent from '../Components/DashboardContent';
import DashboardDrawer from '../Components/DashboardDrawer';

export default class Dashboard extends Component {
	state = {
		drawer: false
	}

	render(){
		return (
			<div>
				<DashboardHeader
					{...this.props}
					handleToggleDrawer={(drawer)=>this.setState({drawer})}
					/>

				<DashboardDrawer
					{...this.props}
					drawer={this.state.drawer}
					handleToggleDrawer={(drawer)=>this.setState({drawer})}
					/>

				<DashboardContent
					{...this.props}
					/>
			</div>
		);
	}

	handleToggleDrawer(drawer) {
		this.setState({drawer});
	}
}
