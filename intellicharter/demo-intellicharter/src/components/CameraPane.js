import React, { Component } from 'react';
import { AppConsumer } from '../context/app-context';

class CameraPane extends Component {
	
	render () {
		return (
			<AppConsumer>
				{({ state, actions }) => (
					<div className="camera-pane" style={{ display: state.cameraVisible ? 'flex' : 'none' }}>
						<div className="upload" style={{ display: state.progressMessage ? 'flex' : 'none' }}>
							{state.progressMessage}
						</div>
						<video style={{ width: '100vw', height: 'auto' }} autoPlay playsInline></video>
						<div className="camera-buttons-holder">
							<button 
								className="button"
								onClick={actions.switchCamera}>
									<i className="ion-ios-reverse-camera"></i>
							</button>
							<button 
								className="button"
								onClick={actions.takePhoto}>
									<i className="ion-ios-aperture"></i>
							</button>
							<button 
								className="button"
								onClick={actions.toggleCamera}>
									<i className="ion-md-close"></i>
							</button>
						</div>
					</div>
				)}
			</AppConsumer>
		);
	}

}

export default CameraPane;