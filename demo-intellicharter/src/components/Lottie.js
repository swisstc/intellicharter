import React from 'react';
import Lottie from 'react-lottie';
import * as animationData from '../lotties/beakon.json';
 
export default class LottieControl extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {isStopped: true, isPaused: false};
    this.lottie = null;
    this.showLottie = this.showLottie.bind(this);
  }

  showLottie () {
    console.log(this.lottie);
  }
 
  render() {
 
    const defaultOptions = {
      loop: false,
      autoplay: false, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };
 
    return (
      <div style={{ border: '1px solid #000' }}>
        <Lottie options={defaultOptions}
          style={{padding: 0, margin: 0}}
          isStopped={this.state.isStopped}
          isPaused={this.state.isPaused}
          key={this.props.key}/>
      </div>
    );
  }
}