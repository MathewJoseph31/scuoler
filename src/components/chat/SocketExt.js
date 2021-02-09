import React, { Component } from 'react';

class SocketExt extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {socket}=this.props;
    socket.on("connect", this.props.onSocketConnect);
    socket.on("update-user-list", this.props.onUpdateUserList);
    socket.on("remove-user", this.props.onRemoveUser);
    socket.on("call-rcvd", this.props.onCallRcvd);
    socket.on("answer-rcvd", this.props.onAnswerRcvd);
    socket.on("ack-callee-rcvd", this.props.onAckCalleeRcvd);
    socket.on("call-rejected", this.props.onCallRejected);
    socket.on("ice-candidate", this.props.handleIceCandidate);
  }

  render(){
    return (
      <>
      </>
    )
  }
}

export default SocketExt;
