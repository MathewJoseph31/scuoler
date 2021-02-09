import React from 'react';
import {  Redirect } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import data from "./data";
import '../css/Chat.css';
import VideoExt from './chat/VideoExt';
import SocketX from './chat/SocketX';
import PeerConnectionX from './chat/PeerConnectionX';

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

class MeetingShowSelected extends React.Component{
  constructor(props){
    super(props);
    this.state={
      localStream: null,
      remoteStreams: {},
      shareScreen: false,
      icons: data.icons,
      userIds:[],
      userNameMap:{},
      message: 'Select a user on the left menu to start sharing.',
    }
    const {params}= this.props.match;


    this.meetingId=params.id;
    this.organiserId=params.organiserId;

    this.peerConnections={};
    this.callAttempts={};
    this.isRemotePlaying={};
    this.isLocalStreamAdded={};

    //this.socket = socketIOClient(ENDPOINT);
    this.socket = socketIOClient("/"+this.meetingId);

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
  }

  dualShareHandler=(mediaStream)=>{
    console.log('in dual share handler');
    this.setState({localStream: mediaStream}, ()=>{
       for(let key in this.peerConnections)
          this.addLocalStreamToPeerCon(key);
    });
  }


  errorHandler=error => {
    console.log(error.message);
  }

  shareScreenChange=async (e)=>{
    let isChecked=e.target.checked;
    let {localStream}=this.state;
    let dualStream;
    if(isChecked){
        dualStream=await navigator.mediaDevices.getDisplayMedia(this.displayMediaOptions);
    }
    else{
      dualStream=await navigator.mediaDevices.getUserMedia(this.camMediaOptions);
    }
    if(localStream===null){
      for(let key in this.peerConnections)
          dualStream.getTracks().forEach(track => this.peerConnections[key].addTrack(track));

      this.setState({localStream: dualStream, shareScreen: isChecked})
    }
    else{
      let trackArr=[...localStream.getTracks()];
      for(let i=0;i<trackArr.length;i++)
          await localStream.removeTrack(trackArr[i]);

      for(let i=0;i<dualStream.getTracks().length;i++){
          await localStream.addTrack(dualStream.getTracks()[i]);
          for(let key in this.peerConnections){
              const senders = this.peerConnections[key].getSenders();
              senders.forEach((sender) => {
                                  if(dualStream.getTracks()[i].kind===sender.track.kind)
                                      sender.replaceTrack(dualStream.getTracks()[i]);
                                });
          }

      }
      this.setState({localStream, shareScreen: isChecked});
    }
  }

  componentDidMount(){
    let globalState=this.props.state;
    if(globalState.loggedInUserFullName!==''){
      let globalState=this.props.state;
        if(this.state.shareScreen){
            navigator.mediaDevices.getDisplayMedia(this.displayMediaOptions).then(this.dualShareHandler).catch(this.errorHandler);
        }
        else{
          navigator.mediaDevices.getUserMedia(this.camMediaOptions).then(this.dualShareHandler).catch(this.errorHandler);
        }
   }
  }

  onSocketConnect=()=>{
    let globalState=this.props.state;
    if(this.socket){
      this.socket.emit("map", {
        userName: globalState.loggedInUserFullName,
        userId: globalState.loggedInUser
      });
      console.log(this.socket.id+' mapped to '+globalState.loggedInUser);
    }
  }

  addLocalStreamToPeerCon=(sourceId)=>{
    if(this.state.localStream && this.isLocalStreamAdded[sourceId]!==true){
      console.log('local stream tracks length '+this.state.localStream.getTracks().length);
      this.state.localStream.getTracks().forEach(track => this.peerConnections[sourceId].addTrack(track));
      this.isLocalStreamAdded[sourceId]=true;
    }
  }

  onUpdateUserList=(data) => {
    let globalState=this.props.state;
    console.log('In update user list');
    let userIds=[...this.state.userIds];
    let newUserIds=data.userIds;
    let remoteStreams=Object.assign({}, this.state.remoteStreams);
    newUserIds.forEach(id=>{
      if(!userIds.includes(id)){
        userIds.push(id);
        if(this.organiserId===globalState.loggedInUser){
            this.peerConnections[id] = new RTCPeerConnection({ iceServers: ICE_SERVERS });
            this.isLocalStreamAdded[id] = false;
            this.callAttempts[id]=0;
            this.isRemotePlaying[id]=false;
            remoteStreams[id] = new MediaStream();
        }
        else if(this.organiserId===id){
          this.peerConnections[id] = new RTCPeerConnection({ iceServers: ICE_SERVERS });
          this.isLocalStreamAdded[id] = false;
          this.callAttempts[id]=0;
          this.isRemotePlaying[id]=false;
          remoteStreams[id] = new MediaStream();
        }
      }
    });
    console.log(userIds);
    console.log(data.nameMap);
    this.setState({remoteStreams, userIds, userNameMap: data.nameMap});
  };

  invokeCallOrganiser=()=>{
      this.socket.emit("call-organiser", {});
  }

  handleCallOrganiser=()=>{
    console.log('handle call organiser');
    if(this.state.userIds.includes(this.organiserId)){
        this.callAttempts[this.organiserId]=0;
        this.isRemotePlaying[this.organiserId]=false;
        this.callUser(this.organiserId).then();
    }
  }


  callUser=async (userId)=>{
    let globalState=this.props.state;
    console.log('Call User '+userId+' '+this.state.userNameMap[userId]);

    if(this.callAttempts[userId]===undefined)
      this.callAttempts[userId]=1;
    else
      this.callAttempts[userId]++;

    console.log('remoteStreams');
    console.log(this.state.remoteStreams[userId]);
    console.log(this.peerConnections[userId]);

    if(this.peerConnections[userId]===undefined){
        this.peerConnections[userId] = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        this.isLocalStreamAdded[userId]=false;
    }
    this.addLocalStreamToPeerCon(userId);

    if(this.state.remoteStreams[userId]===undefined){
      let remoteStreams=Object.assign({}, this.state.remoteStreams);
      remoteStreams[userId] = new MediaStream();
      this.setState({remoteStreams});
    }

    //console.log(this.peerConnection);

    console.log('Call Attempts '+this.callAttempts[userId]);
    const offer = await this.peerConnections[userId].createOffer();
    await this.peerConnections[userId].setLocalDescription(new RTCSessionDescription(offer));
    this.socket.emit("call-user", {
      offer,
      to: userId,
      from: globalState.loggedInUser
    });
    this.setState({message: `Talking with: user: ${this.state.userNameMap[userId]} (${userId})`});

  }

  onCallRcvd=async (data) => {
    let globalState=this.props.state;
    console.log('callRcvd ');
    console.log('remoteStreams');
    console.log(this.state.remoteStreams[data.from]);
    console.log(this.peerConnections[data.from]);

    if(this.peerConnections[data.from]===undefined){
        this.peerConnections[data.from] = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        this.isLocalStreamAdded[data.from] = false;
    }
    this.addLocalStreamToPeerCon(data.from);

    if(this.state.remoteStreams[data.from]===undefined){
      let remoteStreams=Object.assign({}, this.state.remoteStreams);
      remoteStreams[data.from]= new MediaStream();
      this.setState({remoteStreams});
    }

    await this.peerConnections[data.from].setRemoteDescription(
      new RTCSessionDescription(data.offer)
    );
    const answer = await this.peerConnections[data.from].createAnswer();
    console.log('answer \n'+JSON.stringify(answer));
    await this.peerConnections[data.from].setLocalDescription(new RTCSessionDescription(answer));
    //console.log(this.peerConnections[data.from]);
    this.socket.emit("make-answer", {
      answer,
      to: data.from,
      from: globalState.loggedInUser
    });
  }

  onAnswerRcvd=async (data) => {
     let globalState=this.props.state;
     console.log('on Answer Rcvd'+JSON.stringify(data.answer));
     console.log(this.state.remoteStreams[data.from])
     console.log(this.peerConnections[data.from])
     if(this.peerConnections[data.from].signalingState!== "stable"){
       await this.peerConnections[data.from].setRemoteDescription(
          new RTCSessionDescription(data.answer)
       );
     }
     this.socket.emit("ack-callee", {
        to: data.from,
        from: globalState.loggedInUser
     });
  }

  onAckCalleeRcvd=(data)=>{
    console.log('remoteStreams');
    console.log(this.state.remoteStreams[data.from]);
    console.log(this.peerConnections[data.from]);
    console.log('on ack callee received, callAttempts '+this.callAttempts[data.from]+' remotePlaying'+this.isRemotePlaying[data.from]);
    //if(this.state.remoteStreams[data.from].getVideoTracks().length<=0 && this.state.remoteStreams[data.from].getAudioTracks().length<=0 && this.callAttempts[data.from]<3)
    if(!this.isRemotePlaying[data.from] && this.callAttempts[data.from]<4){
      this.callUser(data.from).then();
    }
  }


  onRemoveUser=({ userId }) => {
    console.log('removing user '+userId);
    let userIds=this.state.userIds.filter((val)=>val!==userId);
    let userNameMap={};
    for(let attr in this.state.userNameMap){
      if(userIds.includes(attr))
        userNameMap[attr]=this.state.userNameMap[attr];
    }
    delete this.peerConnections[userId];
    let remoteStreams=Object.assign({}, this.state.remoteStreams);
    delete remoteStreams[userId];
    this.isLocalStreamAdded[userId] = false;
    this.callAttempts[userId]=0;
    this.isRemotePlaying[userId]=false;

    if(userId===this.organiserId)
      this.setState({userNameMap, remoteStreams, userIds});
    else
      this.setState({userNameMap, remoteStreams, userIds});
  }

  handleIceCandidate = async (data) => {
    const candidate = JSON.parse(data);
    const revCandidate=new RTCIceCandidate({
      sdpMLineIndex: candidate.sdpMLineIndex,
      candidate: candidate.candidate
    });
    for(let key in this.peerConnections){
      if(this.peerConnections[key].remoteDescription)
          await this.peerConnections[key].addIceCandidate(revCandidate);
    }
  }

  handleOnIceEvent = (rtcPeerConnectionIceEvent) => {
    console.log('ICE event handle');
    if (rtcPeerConnectionIceEvent.candidate && this.peerConnections) {
        const { candidate } = rtcPeerConnectionIceEvent;
        this.socket.emit("ice-candidate",  JSON.stringify(candidate));
    }
  }

  onRemoteVideoPlaying=(e, key)=>{
    this.isRemotePlaying[key]=true;
    console.log('remote video playing event for remote user '+key);
    console.log(e);
  }


  render(){
      let globalState=this.props.state;
      if(globalState.loggedInUserFullName===''){
        return <Redirect to="/errorLogin"/>
      }
      else
      {
          return (
            <div>
            Meeting Show Selected
             <SocketX
              socket={this.socket}
              onSocketConnect={this.onSocketConnect}
              onUpdateUserList={this.onUpdateUserList}
              onRemoveUser={this.onRemoveUser}
              onCallRcvd={this.onCallRcvd}
              onAnswerRcvd={this.onAnswerRcvd}
              onAckCalleeRcvd={this.onAckCalleeRcvd}
              handleIceCandidate={this.handleIceCandidate}
              handleCallOrganiser={this.handleCallOrganiser}
              />
              {Object.keys(this.state.remoteStreams).map((key)=>(
                <PeerConnectionX
                 peerConnection={this.peerConnections[key]}
                 localStream={this.state.localStream}
                 remoteStream={this.state.remoteStreams[key]}
                 handleOnIceEvent={this.handleOnIceEvent}
                 userId={key}
                 callUser={this.callUser}
                />
              ))
              }
              <div className="content-container">
                    <div className="active-users-panel"  id="active-user-container">
                      <h3 className="panel-title">Callable Users:</h3>
                      {this.state.userIds.map(val=>(<div id={val} key={val}    className="active-user">
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
                             {Object.keys(this.state.remoteStreams).map(key=>(
                               <VideoExt
                               controls
                               mediaStream={this.state.remoteStreams[key]}
                               onPlaying={(e)=>this.onRemoteVideoPlaying(e, key)}
                               />
                             ))}

                          </div>
                    </div>
              </div>
            </div>
          )
      }
  }
}

export default MeetingShowSelected;
