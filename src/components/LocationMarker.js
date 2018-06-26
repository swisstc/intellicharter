import React, { Component } from 'react';

class LocationMarker extends Component {

	render () {
		return (
				<div 
					className="location-marker" 
					onClick={() => this.props.actions.toggleModal(this.props.id)}>
				</div>
		);
	}

}

export default LocationMarker;