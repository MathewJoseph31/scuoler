import React, { Component } from 'react';

class SocketX extends React.Component{
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
    socket.on("ice-candidate", this.props.handleIceCandidate);
    socket.on("call-organiser", this.props.handleCallOrganiser)
  }

  render(){
    return (
      <>
      </>
    )
  }
}

export default SocketX;
