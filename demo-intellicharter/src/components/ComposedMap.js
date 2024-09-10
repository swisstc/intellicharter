import React from 'react';
import {
	compose,
	defaultProps,
	withState,
	withHandlers,
	withProps
} from 'recompose';
import supercluster from 'points-cluster';
import GoogleMapReact from 'google-map-react';
import UserMarker from './UserMarker';
import LocationMarker from './LocationMarker';
import LocationCluster from './LocationCluster';
import { AppConsumer } from '../context/app-context';
// . import firebase from 'firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
require('firebase/firestore');

const config = {
	apiKey: "AIzaSyC2FpbJZ76KM5QZqrGJx6D9mN4ImjhVF2U",
	authDomain: "intellicharter-300216.firebaseapp.com",
	projectId: "intellicharter-300216",
	storageBucket: "intellicharter-300216.appspot.com",
	messagingSenderId: "924772209237",
	appId: "1:924772209237:web:20f382c374eeb80c0ebadc",
	measurementId: "G-CV6MFL7CGG"
};

if (!firebase) {
	firebase.initializeApp(config);
	// const analytics = analytics = getAnalytics(app);
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
			    bootstrapURLKeys={{ key: ['AIzaSyC2FpbJZ76KM5QZqrGJx6D9mN4ImjhVF2U'] }}
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
			    { clusters.map(({ markerProps, id, numPoints }) => (
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
			locationsRef.get((snapShot) => {
			 	console.log(snapShot)
			 	snapShot.docChanges.forEach(item => {
			 		console.log(item);
			 	});
			 })
		}
	}),
  withProps(
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
  withProps(
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
