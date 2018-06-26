import React, { Component } from 'react';
import { Menu, MainButton, ChildButton } from 'react-mfb';
import { AppConsumer } from '../context/app-context';
import '../mfb.css';

class MainMenu extends Component {

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
              label="Find me"
              href="#" />
            <ChildButton
              onClick={actions.getCurrentLocation}
              icon="ion-md-calendar"
              label="Add an event"
              disabled={true}
              href="#" />
            <ChildButton
              onClick={actions.toggleCamera}
              icon="ion-ios-image"
              label="Take a photo"
              disabled={!state.currentLocation.lat}
              href="#" />
            <ChildButton
              onClick={actions.getCurrentLocation}
              icon="ion-md-megaphone"
              label="Leave a message"
              disabled={true}
              href="#" />
          </Menu>
          ) : null
        )}
      </AppConsumer>
    );
  }

}

export default MainMenu;