/*try {
      myVideo = document.createElement("video");
      myVideo.autoplay = false;
      myVideo.muted = true;
    } catch (err) {
      console.log("video createing error", err);
}*/

let path = window.location.pathname;
let ROOM_ID = path.substring(path.lastIndexOf("/") + 1);

let socket;
let videoGrid;
let myVideo;
let myVideoStream;
let myName;
const peers = {};

let peer;
let screenShare = false;
let recording = false;
let myMediaRecorder;

const getPeer = () => {
  if (!peer) {
    peer = new Peer(undefined, {
      path: "/peerjsServer",
      host: "/",
      port: "443",
    });
  }
  return peer;
};

const getSocket = () => {
  if (!socket) {
    socket = io("/");
  }
  return socket;
};

const getVideoGrid = () => {
  if (!videoGrid) {
    videoGrid = document.getElementById("videoChat-left-video-grid");
    videoGrid.insertAdjacentHTML(
      "beforeend",
      `<video autoplay="true" muted="true" onclick="videoClicked(event, this)" />`
    );
  }
  return videoGrid;
};

const getMyVideo = () => {
  if (!myVideo) {
    myVideo = getVideoGrid().firstChild;
  }
  return myVideo;
};

const nameClicked = () => {
  let name = document.getElementById("videChat__Dialog__input").value;
  myName = name;
  let overlayDialog = document.getElementById("videChat__Dialog");
  overlayDialog.remove();
};

const getMyName = (defaultName) => {
  let wholeWindow = document.getElementsByClassName("videoChat")[0];
  wholeWindow.insertAdjacentHTML(
    "beforeend",
    `<div id="videChat__Dialog" >
    <span><strong>Enter your name:</strong></span>
    <input id="videChat__Dialog__input" type="text" value="${defaultName}"/>
    <button onclick="nameClicked()">OK</button>
    </div>`
  );
};

const scrollToBottom = (node) => {
  node.scrollTop = node.scrollHeight;
};

/*let getUserMedia =
  window.navigator.mediaDevices.getUserMedia ||
  window.navigator.getUserMedia ||
  window.navigator.webkitGetUserMedia ||
  window.navigator.mozGetUserMedia;*/

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.onloadedmetadata = function (e) {
    video.play();
  };
  /*video.addEventListener("loadedmetadata", () => {
      video.play();
    });*/
  //videoGrid.append(video);
};

const camMediaOptions = {
  video: true,
  audio: true,
};

const getMyVideoStream = () => {
  return new Promise(function (resolve, reject) {
    if (myVideoStream) {
      resolve(myVideoStream);
    } else {
      window.navigator.mediaDevices
        //.getDisplayMedia(camMediaOptions)
        .getUserMedia(camMediaOptions)
        .then((stream) => {
          myVideoStream = stream;
          addVideoStream(getMyVideo(), myVideoStream);
          resolve(myVideoStream);
        })
        .catch((err) => {
          console.log(`err in getting user media ${err}`);
          reject(err);
        });
    }
  });
};

const init = () => {
  getMyVideoStream()
    .then()
    .catch((err) => {
      console.log(`err in getting user media ${err}`);
    });

  const textEle = document.getElementById("chat_message");

  textEle.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === "Enter" && textEle.value?.length > 0) {
      let chatMsg = { name: myName, message: textEle.value };
      getSocket().emit("message", JSON.stringify(chatMsg));
      textEle.value = "";
    }
  });

  getSocket().on("createMessage", (jsonChatMsg) => {
    let chatMsg = JSON.parse(jsonChatMsg);
    liEl = document.createElement("li");
    liEl.setAttribute("class", "MessageElement");

    liEl.innerHTML = `<b>${chatMsg.name.substring(0, 11)}</b><br/>${
      chatMsg.message
    }`;
    ulEl = document.getElementById("chat-right-MessagesUl");
    ulEl.appendChild(liEl);
    scrollToBottom(ulEl);
  });

  getPeer().on("open", (myId) => {
    //console.log("room peer", ROOM_ID, myId);

    getMyVideo()?.setAttribute("class", myId);
    getSocket().emit("join-room", ROOM_ID, myId);

    if (!myName) {
      getMyName(myId);
    }
  });

  getSocket().on("user-connected", (userId) => {
    console.log("user connected");
    getMyVideoStream()
      .then((mystream) => {
        connectToNewUser(userId, mystream);
      })
      .catch((err) => {
        console.log(`err in getting user media ${err}`);
      });
  });

  getSocket().on("user-disconnected", (userId) => {
    let videoEle = document.getElementsByClassName(userId)[0];
    if (videoEle) {
      videoEle.remove();
    }
    if (peers[userId]) peers[userId].close();
  });

  getPeer().on("call", (call) => {
    // Answer the call, providing our mediaStream
    peers[call.peer] = call;
    getMyVideoStream()
      .then((myStream) => {
        call.answer(myStream);
      })
      .catch((err) => {
        console.log(`err in getting user media ${err}`);
      });
    //console.log("on call", myVideoStream);
    if (getVideoGrid().getElementsByClassName(call.peer).length === 0) {
      getVideoGrid().insertAdjacentHTML(
        "beforeend",
        `<video class="${call.peer}" autoplay="true"   onclick="videoClicked(event, this)" />`
      );
    }
    let video;
    call.on("stream", (userVideoStream) => {
      video = getVideoGrid().getElementsByClassName(call.peer)[0];
      //video = getVideoGrid().lastChild;
      //video.setAttribute("class", call.peer);
      //const video = document.createElement("video");
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      //console.log("closing call");
      video.remove();
    });
  });
};

init();

const connectToNewUser = (userId, myStream) => {
  const call = getPeer().call(userId, myStream);
  console.log("another new user", userId, call);
  getVideoGrid().insertAdjacentHTML(
    "beforeend",
    `<video class="${userId}" autoplay="true"  onclick="videoClicked(event, this)" />`
  );
  let video;
  call.on("stream", (userVideoStream) => {
    //const video = document.createElement("video");
    //console.log("stream arrived", userId, userVideoStream);
    //video = getVideoGrid().lastChild;
    video = getVideoGrid().getElementsByClassName(userId)[0];
    //video.setAttribute("class", userId);
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    //console.log("closing call");
    video.remove();
  });
  peers[userId] = call;
};

const reconnectToExistingUser = (peerId, myStream) => {
  const call = getPeer().call(peerId, myStream);
  console.log("reconnect to existing user", peerId, call);
  let video;
  call.on("stream", (userVideoStream) => {
    //const video = document.createElement("video");
    //console.log("stream arrived", userId, userVideoStream);
    video = getVideoGrid().getElementsByClassName(peerId)[0];
    //video.setAttribute("class", userId);
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    //console.log("closing call");
    video.remove();
  });
  peers[peerId] = call;
};

const muteUnmute = () => {
  getMyVideoStream().then((myStream) => {
    if (myStream.getAudioTracks().length > 0) {
      const enabled = myStream.getAudioTracks()[0].enabled;
      if (enabled) {
        myStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
      } else {
        myStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
      }
    }
  });
};

const setMuteButton = () => {
  const html = `<i class="fas fa-microphone"></i>
                <span>Mute</span>`;
  const muteEle = document.getElementsByClassName(
    "videoChat__left__mute__button"
  )[0];
  muteEle.innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="unmute fas fa-microphone-slash"></i>
                <span>Unmute</span>`;
  const muteEle = document.getElementsByClassName(
    "videoChat__left__mute__button"
  )[0];
  muteEle.innerHTML = html;
};

const stopUnstopVideo = () => {
  getMyVideoStream().then((myStream) => {
    const enabled = myStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myStream.getVideoTracks()[0].enabled = false;
      setPlayVideoButton();
    } else {
      myStream.getVideoTracks()[0].enabled = true;
      setStopVideoButton();
    }
  });
};

const setStopVideoButton = () => {
  const html = `<i class="fa-solid fa-video"></i>
                <span>Stop Video</span>`;
  const videoEle = document.getElementsByClassName(
    "videoChat__left__stopVideo__button"
  )[0];
  videoEle.innerHTML = html;
};

const setPlayVideoButton = () => {
  const html = `<i class="stop fa-solid fa-video-slash"></i>
                <span>Play Video</span>`;
  const videoEle = document.getElementsByClassName(
    "videoChat__left__stopVideo__button"
  )[0];
  videoEle.innerHTML = html;
};

//////////////////////Screen share///////////////////////////////

const switchToScreenShare = async () => {
  let localStream = await getMyVideoStream();
  if (!screenShare) {
    let newStream = await window.navigator.mediaDevices.getDisplayMedia(
      camMediaOptions
    );

    await replaceVideoTracks(localStream, newStream);

    screenShare = true;
    setScreenShareButton();
  } else {
    let newStream = await window.navigator.mediaDevices.getUserMedia(
      camMediaOptions
    );

    await replaceVideoTracks(localStream, newStream);

    screenShare = false;
    setNoScreenShareButton();
  }

  Object.keys(peers).map((peerId) => {
    reconnectToExistingUser(peerId, localStream);
  });
};

const setScreenShareButton = () => {
  const html = `<i class="screenShare fas fa-desktop"></i>
                <span>Screenshare</span>`;
  const screenshareEle = document.getElementsByClassName(
    "videoChat__left__screenshare__button"
  )[0];
  screenshareEle.innerHTML = html;
};

const setNoScreenShareButton = () => {
  const html = `<i class="noScreenShare fas fa-desktop"></i>
                <span>Screenshare</span>`;
  const screenshareEle = document.getElementsByClassName(
    "videoChat__left__screenshare__button"
  )[0];
  screenshareEle.innerHTML = html;
};

const replaceVideoTracks = async (oldStream, newStream) => {
  //console.log(oldStream);
  let trackArr = [...oldStream.getTracks()];
  for (let i = 0; i < trackArr.length; i++)
    if (trackArr[i].kind === "video") await oldStream.removeTrack(trackArr[i]);

  for (let i = 0; i < newStream.getTracks().length; i++) {
    if (newStream.getTracks()[i].kind === "video")
      await oldStream.addTrack(newStream.getTracks()[i]);
  }
};
///////////End of Screenshare area ///////////////

///////////Record Video area ///////////////

const saveFile = (recordedChunks) => {
  const blob = new Blob(recordedChunks, {
    type: "video/webm",
  });

  let filename = window.prompt("Enter file name"),
    downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${filename}.webm`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  URL.revokeObjectURL(blob); // clear from memory
  document.body.removeChild(downloadLink);
};

const createRecorder = (stream, mimeType) => {
  // the stream data is stored in this array
  let recordedChunks = [];

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };
  mediaRecorder.onstop = function () {
    saveFile(recordedChunks);
    recordedChunks = [];
  };
  mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
  return mediaRecorder;
};

const addAudioTracks = async (screenStream) => {
  let myStream = await getMyVideoStream();

  let audioTracksArr = [...myStream.getAudioTracks()];
  for (let i = 0; i < audioTracksArr.length; i++)
    await screenStream.addTrack(audioTracksArr[i]);
};

const startRecord = async () => {
  if (!recording) {
    let recordStream;
    if (!screenShare) {
      recordStream = await window.navigator.mediaDevices.getDisplayMedia(
        camMediaOptions
      );
      await addAudioTracks(recordStream);
    } else {
      recordStream = await getMyVideoStream();
    }
    let mimeType = "video/webm";
    myMediaRecorder = createRecorder(recordStream, mimeType);

    recording = true;
    setRecordButton();
  } else {
    myMediaRecorder.stop();
    recording = false;
    setNoRecordButton();
  }
};

const setRecordButton = () => {
  const html = `<i class="record fas fa-record-vinyl"></i>
                <span>Record</span>`;
  const recordEle = document.getElementsByClassName(
    "videoChat__left__record__button"
  )[0];
  recordEle.innerHTML = html;
};

const setNoRecordButton = () => {
  const html = `<i class="noRecord fas fa-record-vinyl"></i>
                <span>Record</span>`;
  const recordEle = document.getElementsByClassName(
    "videoChat__left__record__button"
  )[0];
  recordEle.innerHTML = html;
};

/////////////End of record Video area //////////////

const leaveMeeting = () => {
  if (window.confirm("Do you really want to leave the Meeting?")) {
    window.location.replace("/");
  }
};

const videoClicked = (e, ele) => {
  let videoElement;
  videoElement = document.getElementById("maxVideo");
  if (!videoElement) {
    let wholeWindow = document.getElementsByClassName("videoChat")[0];
    wholeWindow.insertAdjacentHTML(
      "beforeend",
      ` <video id="maxVideo" autoplay="true" muted="true" onclick="maxVideoClicked(this)"></video>`
    );
    videoElement = document.getElementById("maxVideo");
  }
  videoElement.srcObject = ele.srcObject;
};

const maxVideoClicked = (ele) => {
  ele.remove();
};
