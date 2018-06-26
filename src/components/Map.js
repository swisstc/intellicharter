import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { AppConsumer } from '../context/app-context';
import LocationMarker from './LocationMarker';

class Map extends Component {

  constructor (props) {
    super(props);
    this.state = {
    	initialLocation: {
    		lat: 50.5321768,
    		lng: -0.4354072
    	}
    };
  }

  mapChanged (change) {
  	// console.log(change);
  }

  render () {
  	return (
			<AppConsumer>
				{ ({state, actions}) => (
					<div className="map-class" style={{ display: state.mapVisible ? 'flex' : 'none' }}>
			      <GoogleMapReact
			        bootstrapURLKeys={{ key: ['AIzaSyDraKt4nZ1IQWg7w6haocX-IpFiHTp2w2Y'] }}
			        onChange={this.mapChanged}
			        gestureHandling="greedy"
			        defaultCenter={ this.state.initialLocation }
			        defaultZoom={ 15 }
			        options={({
			        	gestureHandling: 'greedy',
			        	zoomControl: false,
			        	fullscreenControl: false
			        })}
			        onGoogleApiLoaded={({map, maps}) => actions.attachMap(map, maps)}
			        yesIWantToUseGoogleMapApiInternals={true}>
				      { state.widgets.map((widget,id) => (
					      	<LocationMarker
					      		key={id}
					      		actions={actions}
					      		id={widget.key}
					      		lat={widget.loc.lat}
					      		lng={widget.loc.lng}></LocationMarker>
					     ))	}
			      </GoogleMapReact>
			    </div>
				)}
			</AppConsumer>
  	);
  }

}

export default Map;