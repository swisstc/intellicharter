import React, { Component } from 'react';
import Lottie from 'react-lottie';
import * as animationData from '../lotties/location_pin.json';


class UserMarker extends Component {

	constructor (props) {
		super(props);
		this.state = {
			isStopped: false,
			isPaused: false
		};
	}

	render () {

	  const defaultOptions = {
	    loop: true,
	    autoplay: true, 
	    animationData: animationData,
	    rendererSettings: {
	      preserveAspectRatio: 'xMidYMid slice'
	    }
	  };

		return (
				<div 
					className="user-marker">
		        <Lottie options={defaultOptions}
		          width={50}
		          height={50}
		          style={{padding: 0, margin: 0}}
		          isStopped={this.state.isStopped}
		          isPaused={this.state.isPaused}
		          key={this.props.key}/>
				</div>
		);
	}

}

export default UserMarker;