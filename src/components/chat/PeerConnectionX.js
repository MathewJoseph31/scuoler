import React from 'react';

class PeerConnectionX extends React.Component{
  constructor(props) {
    super(props);
  }

  handleOnTrack = async(trackEvent) => {
    let {remoteStream}=this.props;
    console.log('in onTrack');
    console.log(trackEvent);
    //const remoteStream = new MediaStream([ trackEvent.track ]);
    await remoteStream.addTrack(trackEvent.track);
    //this.props.setRemoteStream(remoteStream);
  }

  /*handleOnTrack1=(trackEvent) => {
      console.log('in onTrack');
      console.log(trackEvent);
      const stream=trackEvent.streams[0];
      this.props.setRemoteStream(stream);
  };*/

   handleOnNegotiationNeeded = async (negotiationNeededEvent) => {
     console.log('In negotitation needed');
     console.log(negotiationNeededEvent);
     this.props.callUser(this.props.userId).then();
   }



    componentDidMount() {
        const { peerConnection } = this.props;
        peerConnection.onnegotiationneeded = this.handleOnNegotiationNeeded;
        peerConnection.onicecandidate = this.props.handleOnIceEvent;
        peerConnection.ontrack = this.handleOnTrack;
        console.log('PeerConnectionExt component mounted');
        console.log(peerConnection);
    }

    render() {
        return(
          <>
          </>
        );
    }
}

export default PeerConnectionX;
