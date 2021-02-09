import React, { PureComponent } from 'react';

class VideoExt extends PureComponent {
  constructor(props) {
    super(props)
  }

  addStreamTrack = async () => {
      const { localStream, peerConnection } = this.props
      //console.log('addMediaStream: ', localMediaStream);
      if (localStream) {
        await localStream.getTracks().forEach((streamTrack) => {
          peerConnection.addTrack(streamTrack);
        });
      }
  }

  addStream = (video) => {
    const { mediaStream } = this.props;
    // Prevents throwing error upon a setState change when mediaStream is null
    // upon initial render
    if (mediaStream && video) video.srcObject = mediaStream;
  }

  render() {
    const { mediaStream, controls, muted, ...rest} = this.props;
    //console.log('mediaStream: ', mediaStream);

    return (
      <video
        className="rtc__video"
        controls={controls}
        muted={muted}
        style={{width: '480px', backgroundColor: 'black'}}
        autoPlay
        ref={mediaStream ? this.addStream : null}
        {...rest}
      >
        <track default kind="captions" />
      </video>
    );
  }
};

export default VideoExt;
