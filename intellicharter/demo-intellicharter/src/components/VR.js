import 'aframe';
import 'aframe-particle-system-component';
import {Entity, Scene} from 'aframe-react';
import React, { Component } from 'react';
import { AppConsumer } from '../context/app-context';


class VR extends Component {

	// constructor (props) {
	// 	super(props);
	// 	this.state = {
	// 		currentLocation: {
	// 			lat: 0,
	// 			lng: 0
	// 		}
	// 	};
	// }

	componentDidMount () {
		console.log('VR Component mounted')
		window.addEventListener('deviceorientation', (e) => {
			console.log(e)
		})
	}

	componentWillUnmount () {
		console.log('Unmounted')
		window.removeEventListener('deviceorientation', () => {
			console.log('VR Removed orientation watcher')
		});
	}

	render () {

		return (
			<Scene vr-mode-ui="enabled: false">
				<a-assets>
					<AppConsumer>
						{ 
							({state, actions}) => {
								state.nearbyWidgets.map(widget => {
									console.log(widget);
									return <img id={widget.key} src={widget.imageURL}/>;
								});
							}
						}
					</AppConsumer>
				</a-assets>
				<Entity camera look-controls position="0 0 0"/>
        <Entity id="box"
          geometry={{primitive: 'box'}}
          material={{color: '#336699', opacity: 0.6}}
          animation__rotate={{property: 'rotation', dur: 2000, loop: true, to: '360 360 360'}}
          animation__scale={{property: 'scale', dir: 'alternate', dur: 100, loop: true, to: '1.1 1.1 1.1'}}
          position={{x: 0, y: 1, z: -3}}>
          <Entity animation__scale={{property: 'scale', dir: 'alternate', dur: 100, loop: true, to: '2 2 2'}}
                  geometry={{primitive: 'box', depth: 0.2, height: 0.2, width: 0.2}}
                  material={{color: '#24CAFF'}}/>
        </Entity>
        <Entity particle-system={{preset: 'colors'}}/>
        <Entity light={{type: 'point'}}/>
			</Scene>
		);
	}

}

export default VR;