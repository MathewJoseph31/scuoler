import React from 'react';
import socketIOClient from "socket.io-client";
import {  Redirect } from 'react-router-dom';
import '../../css/Chat.css';
import VideoExt from './VideoExt';
import SocketExt from './SocketExt';
import PeerConnectionExt from './PeerConnectionExt';
//const ENDPOINT = "http://localhost:5000";
const ICE_SERVERS=[
  {
    urls: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
    username: 'webrtc@live.com'
  },
  {
      url: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
  },
  {
      url: 'turn:turn.anyfirewall.com:443?transport=tcp',
      credential: 'webrtc',
      username: 'webrtc'
  },
  {
      url: 'turn:13.250.13.83:3478?transport=tcp',
      credential: 'YzYNCouZM1mhqhmseWk6',
      username: 'YzYNCouZM1mhqhmseWk6'
  },
  { urls: 'stun:stun.l.google.com:19302' },
  /*{ urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },*/
  { urls: 'stun:stun.ekiga.net'}
];

class ChatHome extends React.Component {
  constructor(props){
    super(props);
    this.state={
      callRcvd: false,
      answerRcvd: false,
      localStream: null,
      remoteStream: null,
      shareScreen: false,
      userIds:[],
      userNameMap:{},
      message: 'Select a user on the left menu to start sharing.'
    }
    this.isRemotePlaying=false;
    this.peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    //this.socket = socketIOClient(ENDPOINT);
    this.socket = socketIOClient();
    //console.log(this.socket);
    this.displayMediaOptions = {
      video: {
        cursor: "always"
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    };

    this.camMediaOptions={
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    };
    this.callAttempts=0;
  }

  dualShareHandler=(mediaStream)=>{
    this.setState({localStream: mediaStream}, ()=>{
      //mediaStream.getTracks().forEach(track => this.peerConnection.addTrack(track, mediaStream));
      mediaStream.getTracks().forEach(track => this.peerConnection.addTrack(track));
    });
  };

  errorHandler=error => {
    console.log(error.message);
  };

  shareScreenChange=async (e)=>{
      let isChecked=e.target.checked;
      let {localStream}=this.state;
      //console.log(e.target.checked);
      //console.log('value '+e.target.value);
      let dualStream;
      if(isChecked){
          dualStream=await navigator.mediaDevices.getDisplayMedia(this.displayMediaOptions);
      }
      else{
        dualStream=await navigator.mediaDevices.getUserMedia(this.camMediaOptions);
      }

      if(localStream===null){
        //dualStream.getTracks().forEach(track => this.peerConnection.addTrack(track,dualStream));
        dualStream.getTracks().forEach(track => this.peerConnection.addTrack(track));
        this.setState({localStream: dualStream, shareScreen: isChecked})
      }
      else{
        //console.log(dualStream);
        //console.log(localStream.getTracks());
        /*let vidTrack, audTrack;
        if(dualStream.getVideoTracks())
          vidTrack= dualStream.getVideoTracks()[0];
        if(dualStream.getAudioTracks())
          audTrack=dualStream.getAudioTracks()[0];*/

        let trackArr=[...localStream.getTracks()];
        for(let i=0;i<trackArr.length;i++)
            await localStream.removeTrack(trackArr[i]);

        //
        const senders = this.peerConnection.getSenders();
        for(let i=0;i<dualStream.getTracks().length;i++){
            await localStream.addTrack(dualStream.getTracks()[i]);
            senders.forEach((sender) => {
                                if(dualStream.getTracks()[i].kind===sender.track.kind)
                                    sender.replaceTrack(dualStream.getTracks()[i]);
                                  //this.peerConnection.removeTrack(sender)
                              });
            //this.peerConnection.addTrack(dualStream.getTracks()[i]);
        }
        console.log(this.peerConnection.getSenders());

        //localStream.addTrack(vidTrack)
        //const transceiver = this.peerConnection.getTransceivers()[0];
        //transceiver['sender'].replaceTrack(vidTrack);
        this.setState({shareScreen: isChecked});
      }

  }

  componentDidMount(){
    let globalState=this.props.state;
    if(globalState.loggedInUserFullName!==''){
        if(this.state.shareScreen){
            navigator.mediaDevices.getDisplayMedia(this.displayMediaOptions).then(this.dualShareHandler).catch(this.errorHandler);
        }
        else{
          navigator.mediaDevices.getUserMedia(this.camMediaOptions).then(this.dualShareHandler).catch(this.errorHandler);;
        }
        const remoteStream = new MediaStream();
        //console.log(remoteStream.getTracks());
        this.setState({remoteStream});
   }
  }

  onSocketConnect=()=>{
    let globalState=this.props.state;
    this.socket.emit("map", {
      userName: globalState.loggedInUserFullName,
      userId: globalState.loggedInUser
    });
    console.log(this.socket.id+' mapped to '+globalState.loggedInUserFullName);
  }

  onUpdateUserList=(data) => {
    let userIds=[...this.state.userIds];
    let newUserIds=data.userIds;
    newUserIds.forEach(id=>{
      if(!userIds.includes(id))
        userIds.push(id);
    });
    console.log('In update user list');
    console.log(userIds);
    console.log(data.nameMap);
    this.setState({userIds, userNameMap: data.nameMap});
  };


  callUser=async (userId, e)=>{
    let globalState=this.props.state;
    console.log('Call User '+userId+' '+this.state.userNameMap[userId]);
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    console.log(JSON.stringify(offer));
    //console.log(this.peerConnection);

    this.socket.emit("call-user", {
      offer,
      to: userId,
      from: globalState.loggedInUser
    });
    this.setState({message: `Talking with: user: ${this.state.userNameMap[userId]} (${userId})`});
  }



  sendAnswer=async (data)=>{
      let globalState=this.props.state;
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      console.log('call received');
      console.log('answer \n'+JSON.stringify(answer));
      //console.log(this.peerConnection);

      this.socket.emit("make-answer", {
        answer,
        to: data.from,
        from: globalState.loggedInUser
      });
      this.setState({callRcvd: true});
  }

  onCallRcvd=async (data) => {
    let globalState=this.props.state;
    console.log('callRcvd '+this.state.callRcvd);

    if (!this.state.callRcvd && !this.state.answerRcvd) {
      const confirmed = window.confirm(
        `User : ${data.from}" wants to call you. Do accept this call?`
      );
      if (!confirmed) {
        this.socket.emit("reject-call", {
          to: data.from,
          from: globalState.loggedInUser
        });
      }
      else{
        await this.sendAnswer(data);
      }
    }
    else{
         await this.sendAnswer(data);
    }

  }

  onAnswerRcvd=async (data) => {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
    console.log('on Answer Rcvd'+JSON.stringify(data.answer));
    if (!this.state.answerRcvd && !this.state.callRcvd)
    {
      console.log(this.peerConnection);
      //this.callUser(data.socket, null).then();
      this.setState({answerRcvd: true});
    }
    //if(this.state.remoteStream.getTracks().length<=0)
    await this.AckCallee(data.from);
  }

  AckCallee=async (userId)=>{
    let globalState=this.props.state;
    console.log('Ack Callee  '+userId+' '+ this.state.userNameMap[userId]);
    //console.log(JSON.stringify(offer));
    //console.log(this.peerConnection);

    this.socket.emit("ack-callee", {
      to: userId,
      from: globalState.loggedInUser
    });
    //this.setState({message: `Talking with: user: ${userName} (${sockId})`});
  }

  onAckCalleeRcvd=(data)=>{
      console.log('on ack callee received, callAttempts '+this.callAttempts+' remotePlaying'+this.isRemotePlaying);
     this.callAttempts++;
     //if(this.state.remoteStream.getTracks().length<=0 && this.callAttempts<3){
     if(!this.isRemotePlaying && this.callAttempts<3){
        this.callUser(data.from, null).then();
     }
  }

  onCallRejected=data => {
    alert(`User: ${this.state.userNameMap[data.from]} (${data.from}) rejected your call.`);
    //unselectUsersFromList();
  }

  onRemoveUser=({ userId }) => {
    let userIds=this.state.userIds.filter((val)=>val!==userId);
    let userNameMap={};
    for(let attr in this.state.userNameMap){
      if(userIds.includes(attr))
        userNameMap[attr]=this.state.userNameMap[attr];
    }
    this.setState({userNameMap, userIds});
  }


  handleOnIceEvent = (rtcPeerConnectionIceEvent) => {
    console.log('ICE event handle')
    if (rtcPeerConnectionIceEvent.candidate && this.peerConnection) {
      const { candidate } = rtcPeerConnectionIceEvent;
      this.socket.emit("ice-candidate", JSON.stringify(candidate));
    }
  }

  handleIceCandidate = async (data) => {
    //console.log('new ice candidate to add');
    //console.log(data);
   const candidate = JSON.parse(data);
   const revCandidate=new RTCIceCandidate({
     sdpMLineIndex: candidate.sdpMLineIndex,
     candidate: candidate.candidate
   });
   await this.peerConnection.addIceCandidate(revCandidate);
  }

  setRemoteStream=(remoteStream) => {
    this.setState({ remoteStream: remoteStream });
  }

  onRemoteVideoPlaying=(e)=>{
    this.isRemotePlaying= true;
    console.log('remote video playing event');
    console.log(e);
  }


  render(){
    let globalState=this.props.state;
    if(globalState.loggedInUserFullName===''){
      return <Redirect to="/errorLogin"/>
    }
    else
    {
        return(
          <div>
                <SocketExt
                  socket={this.socket}
                  onSocketConnect={this.onSocketConnect}
                  onUpdateUserList={this.onUpdateUserList}
                  onRemoveUser={this.onRemoveUser}
                  onCallRcvd={this.onCallRcvd}
                  onAckCalleeRcvd={this.onAckCalleeRcvd}
                  onAnswerRcvd={this.onAnswerRcvd}
                  onCallRejected={this.onCallRejected}
                  handleIceCandidate={this.handleIceCandidate}
                />
                <PeerConnectionExt
                 peerConnection={this.peerConnection}
                 localStream={this.state.localStream}
                 remoteStream={this.state.remoteStream}
                 setRemoteStream={this.setRemoteStream}
                 handleOnIceEvent={this.handleOnIceEvent}
                />
                <div className="content-container">
                      <div className="active-users-panel"  id="active-user-container">
                        <h3 className="panel-title">Callable Users:</h3>
                        {this.state.userIds.map(val=>(<div id={val} key={val} onClick={(e)=>{this.callUser(val, e).then()}} className="active-user">
                                                          <p className="username">
                                                            {this.state.userNameMap[val]}({val})
                                                          </p>
                                                         </div>
                                                         )
                                              )}
                      </div>
                      <div className="video-chat-container">
                            {/*<h2>Logged In User: {this.props.loggedInUserFullName}</h2>*/}
                            <h2 className="talk-info" id="talking-with-info">
                              {this.state.message}
                            </h2>
                            <div className="video-container">
                              Share Screen: <input type="checkbox" id="shareScreen" checked={this.state.shareScreen}
                                              onChange={this.shareScreenChange}/>
                              <br/>
                              <VideoExt
                              controls={true}
                              muted="muted"
                              mediaStream={this.state.localStream} />
                              <VideoExt
                              controls
                              mediaStream={this.state.remoteStream}
                              onPlaying={this.onRemoteVideoPlaying}
                              />
                            </div>
                      </div>
                </div>
          </div>
        )
      }
  }
}

export default ChatHome;
