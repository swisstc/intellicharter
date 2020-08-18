import React, { Component } from 'react';
import { Menu, MainButton, ChildButton } from 'react-mfb';
import { AppConsumer } from '../context/app-context';
import '../mfb.css';

class CameraMenu extends Component {

  render () {
    return (
      <AppConsumer>
        { ({state, actions}) => (
          state.menuVisible ? (
          <Menu effect="zoomin" method="click" position={state.menuPosition}>
            <MainButton iconResting="ion-md-add" iconActive="ion-md-close" />
            <ChildButton
              onClick={actions.getCurrentLocation}
              icon="ion-md-locate"
              label="Switch camera"
              href="#" />
            <ChildButton
              onClick={actions.getCurrentLocation}
              icon="ion-md-calendar"
              label="Add an event"
              href="#" />
            <ChildButton
              onClick={actions.toggleCamera}
              icon="ion-ios-image"
              label="Take a photo"
              href="#" />
            <ChildButton
              onClick={actions.getCurrentLocation}
              icon="ion-md-megaphone"
              label="Leave a message"
              href="#" />
          </Menu>
          ) : null
        )}
      </AppConsumer>
    );
  }

}

export default CameraMenu;