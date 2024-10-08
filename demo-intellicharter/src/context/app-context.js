import React, { Component } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
require('firebase/firestore');
//import firebase from 'firebase';
//require('firebase/firestore');
// const uuid = require('uuid/v4');

const config = {
  apiKey: "AIzaSyC2FpbJZ76KM5QZqrGJx6D9mN4ImjhVF2U",
  authDomain: "intellicharter-300216.firebaseapp.com",
  projectId: "intellicharter-300216",
  storageBucket: "intellicharter-300216.appspot.com",
  messagingSenderId: "924772209237",
  appId: "1:924772209237:web:335e2c5aa096170f0ebadc",
  measurementId: "G-GTSF3RY49D"
};

firebase.initializeApp(config);
firebase.firestore().settings({timestampsInSnapshots: true});

export const AppContext = React.createContext();
export const AppConsumer = AppContext.Consumer;

export class AppProvider extends Component {

	constructor (props) {
		super(props);
		this.state = {
			uid: null,
			mapVisible: true,
			cameraVisible: false,
			menuVisible: true,
			menuPosition: 'br',
			currentLocation: {
	   			lat: 0,
    			lng: 0
			},

			widgets: [],
			progressMessage: null,
			activeLocation: null
		};

		this.getCurrentLocation = this.getCurrentLocation.bind(this);
		this.attachMap = this.attachMap.bind(this);
		this.toggleModal = this.toggleModal.bind(this);

		this.initFirebase();
	}

	initFirebase () {
		firebase.auth().onAuthStateChanged(user => {
			if (!user) {
				firebase.auth().signInAnonymously()
					.then(anon => {
						this.setState({
							uid: anon.uid
						});
					})
					.catch(err => console.log('Sign in error', err));
			} else {
				this.setState({
					uid: user.uid
				});

				console.log('Signed in to Firebase');
			}
		});

		console.log('Doing some location stuff');
		const locationsRef = firebase.firestore().collection('locations');

		locationsRef.onSnapshot((snapShot) => {
			snapShot.docChanges().forEach(item => {
				if (item.type === 'added') {
					this.setState((prevState, props) => ({ 
						widgets: [
							...prevState.widgets,
							{
								key: item.doc.id,
								loc: {
									lat: item.doc.data().location.latitude,
									lng: item.doc.data().location.longitude
								}
							}
						] 
					}));
				}
			});
		})
	}

	getCurrentLocation () {
		navigator.geolocation.getCurrentPosition(
			(location) => {
				this.setState({
					currentLocation: {
						lat: location.coords.latitude,
						lng: location.coords.longitude
					}
				});
				let newCoords = new this.maps.LatLng(location.coords.latitude,location.coords.longitude);
				this.map.panTo(newCoords);
				this.map.setZoom(19);
			},
			(err) => console.log(err), { maximumAge: 0 });
	}

	setLocation (latLng) {
		console.log('Set loc', latLng)
		firebase.firestore().collection('locations').add({
			location: new firebase.firestore.GeoPoint(latLng[0],latLng[1])
		})
		.then(ref => {
			console.log(ref)
		});
	}

	attachMap (map, maps) {
		this.map = map;
		this.maps = maps;
		this.map.addListener('click', (data) => {
			console.log('Clicked', data.latLng.lat())
			this.setLocation([data.latLng.lat(),data.latLng.lng()])
		})
	}

	toggleModal (location = null) {
		// if (location) {
		// 	let activeWidget = this.state.widgets.filter(item => item.key === location);
		// 	console.log(activeWidget)
		// 	let newCoords = new this.maps.LatLng(activeWidget[0].loc.lat,activeWidget[0].loc.lng);
		// 	this.map.panTo(newCoords);
		// }
		this.setState({
			menuVisible: location ? true : false
		});
		this.setState({
			activeLocation: location
		});
	}

	render () {
		return (
			<AppContext.Provider value={{ 
				state: this.state,
				actions: {
					getCurrentLocation: this.getCurrentLocation,
					attachMap: this.attachMap,
					toggleModal: this.toggleModal
				}}}>
				{this.props.children}
			</AppContext.Provider>
		);
	}

}