import React, { Component } from 'react';
import { AppConsumer } from '../context/app-context';
import firebase from 'firebase';
require('firebase/firestore');

const config = {
  apiKey: "AIzaSyDOQjmfMTZasS7V4R3wPnPTbeGtXjxIdS0",
  authDomain: "hipswich-1337.firebaseapp.com",
  databaseURL: "https://hipswich-1337.firebaseio.com",
  projectId: "hipswich-1337",
  storageBucket: "hipswich-1337.appspot.com",
  messagingSenderId: "1004965395503"
};

if (!firebase) {
	firebase.initializeApp(config);
	firebase.firestore().settings({timestampsInSnapshots: true});
}

class Modal extends Component {
	
	constructor (props) {
		super(props);
		this.state = {
			images: []
		};
		this.locationID = null;
		this.handleButtonPress = this.handleButtonPress.bind(this);
		this.handleButtonRelease = this.handleButtonRelease.bind(this);
	}

	handleButtonPress () {
		this.buttonTimer = setTimeout(this.removeContent(), 1000);
	}

	handleButtonRelease () {
		clearTimeout(this.buttonTimer)
	}

	removeContent () {
		firebase.firestore().collection('locations').doc(this.locationID).delete()
			.then(removed => console.log(removed))
			.catch(err => console.log(err))
	}

	populateContent (locationID) {
		this.locationID = locationID;
		firebase.firestore().collection('locations').doc(locationID).collection('images').get()
			.then(items => {
				let newImages = [];
				items.forEach(item => {
					newImages.push(item.data().imageURL);
				})
				this.setState((prevState, props) => ({
					images: newImages
				}));
			})
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.activeLocation !== this.props.activeLocation) {
			console.log(nextProps, nextState)
			this.populateContent(nextProps.activeLocation);
		}
	}

	componentDidMount () {
		this.populateContent(this.props.activeLocation);
	}

	render () {
		return (
			<AppConsumer>
			{ ({ state, actions }) => (
					<div className="modal-container">
						<button 
							className="button"
							onClick={() => actions.toggleModal(null)}><i className="ion-md-close"></i></button>
						<div className="modal-content">
							{ this.state.images.map((image, i) => (
								<div key={i} className="modal-image" style={{ backgroundImage: `url(${image})` }} onTouchStart={this.handleButtonPress} onTouchEnd={this.handleButtonRelease} onMouseDown={this.handleButtonPress} onMouseUp={this.handleButtonRelease}></div>
								// <img key={i} src={image} alt="It's fucking amazing!" width="100%" height="auto" />
							)) }
						</div>
					</div>
			) }
			</AppConsumer>
		);
	}

}

export default Modal;