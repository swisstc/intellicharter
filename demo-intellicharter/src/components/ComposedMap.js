import React from 'react';
import {
	compose,
	defaultProps,
	withState,
	withHandlers,
	withPropsOnChange
} from 'recompose';
import supercluster from 'points-cluster';
import GoogleMapReact from 'google-map-react';
import UserMarker from './UserMarker';
import LocationMarker from './LocationMarker';
import LocationCluster from './LocationCluster';
import { AppConsumer } from '../context/app-context';
import firebase from 'firebase';
require('firebase/firestore');

const config = {
  apiKey: "AIzaSyASR-XNWqIpTKzcIxYfj7JnCzmm2Hxrqpw",
  authDomain: "intellicharter.firebaseapp.com",
  databaseURL: "https://intellicharter.firebaseio.com",
  projectId: "intellicharter",
  storageBucket: "intellicharter.appspot.com",
  messagingSenderId: "1004965395503"
};

if (!firebase) {
	firebase.initializeApp(config);
}

firebase.firestore().settings({timestampsInSnapshots: true});

const composedMap = ({
	mapProps: {center, zoom},
	onChange, clusters
}) => (
	<AppConsumer>
		{ ({state, actions}) => (
			<div className="map-class" style={{ display: state.mapVisible ? 'flex' : 'none' }}>
			  <GoogleMapReact
			    bootstrapURLKeys={{ key: ['AIzaSyDraKt4nZ1IQWg7w6haocX-IpFiHTp2w2Y'] }}
			    onChange={onChange}
			    gestureHandling="greedy"
			    center={center}
			    style={{flex: 1}}
			    defaultZoom={ 15 }
			    options={({
			    	gestureHandling: 'greedy',
			    	zoomControl: false,
			    	fullscreenControl: false
			    })}
		      onGoogleApiLoaded={({map, maps}) => actions.attachMap(map, maps)}
			    yesIWantToUseGoogleMapApiInternals={true}>
		    	{ state.currentLocation.lat ? (
		    		<UserMarker lat={state.currentLocation.lat} lng={state.currentLocation.lng}></UserMarker>
		    		) 
		    		: null
		    	}
			    { clusters.map(({ ...markerProps, id, numPoints }) => (
			    	numPoints === 1 ?
			      	<LocationMarker	key={id} {...markerProps} actions={actions}></LocationMarker>
			      	: <LocationCluster key={id} {...markerProps} actions={actions}></LocationCluster>
			     ))	}
			  </GoogleMapReact>
			</div>
	  )}
  </AppConsumer>
);

const composedMapHOC = compose(
	defaultProps({
		clusterRadius: 60,
		options: {
			minZoom: 2,
			maxZoom: 20,
		}
	}),
	withState(
		'markers', 
		'setMarkers',
		[]
	),
	withState(
		'mapProps',
		'setMapProps',
		{
			center: {
	  		lat: 50.3077771,
	  		lng: -0.7362041
			},
			zoom: 9
		}
	),
	withHandlers({
		onChange: ({ setMapProps, setMarkers }) => ({center, zoom, bounds}) => {
			setMapProps({center, zoom, bounds});
			let locations = [];
			const locationsRef = firebase.firestore().collection('locations');
			locationsRef.get()
				.then(res => {
					res.forEach(item => {
						locations.push({
							key: item.id,
							id: item.id,
							lat: item.data().location.latitude,
							lng: item.data().location.longitude
						});
					})
					setMarkers(locations);
				})
				.catch(err => console.log(err))
			// locationsRef.get((snapShot) => {
			// 	console.log(snapShot)
			// 	snapShot.docChanges.forEach(item => {
			// 		console.log(item);
			// 	});
			// })
		}
	}),
  withPropsOnChange(
    ['markers'],
    ({ markers = [], clusterRadius, options: { minZoom, maxZoom } }) => ({
      getCluster: supercluster(
        markers,
        {
          minZoom, // min zoom to generate clusters on
          maxZoom, // max zoom level to cluster the points on
          radius: clusterRadius, // cluster radius in pixels
        }
      ),
    })
  ),
  // get clusters specific for current bounds and zoom
  withPropsOnChange(
    ['mapProps', 'getCluster'],
    ({ mapProps, getCluster }) => ({
      clusters: mapProps.bounds
        ? getCluster(mapProps)
          .map(({ wx, wy, numPoints, points }) => (
          	{
	            lat: wy,
	            lng: wx,
	            text: numPoints,
	            numPoints,
	            // id: `${numPoints}_${points[0].key}`,
	            id: points[0].key
	          }
          ))
        : [],
    })
  ),
);

export default composedMapHOC(composedMap);