import React, { Component } from 'react';

class LocationMarker extends Component {

	render () {
		return (
				<div 
					className="cluster-marker" 
					onClick={() => this.props.actions.toggleModal(this.props.id)}>{ this.props.text }</div>
		);
	}

}

export default LocationMarker;