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
      `<video autoplay="true" muted="true"/>`
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
    getVideoGrid().insertAdjacentHTML(
      "beforeend",
      `<video class="${call.peer}" autoplay="true"  />`
    );
    let video;
    call.on("stream", (userVideoStream) => {
      video = getVideoGrid().lastChild;
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
    `<video class="${userId}" autoplay="true"  />`
  );
  let video;
  call.on("stream", (userVideoStream) => {
    //const video = document.createElement("video");
    //console.log("stream arrived", userId, userVideoStream);
    video = getVideoGrid().lastChild;
    //video.setAttribute("class", userId);
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    //console.log("closing call");
    video.remove();
  });
  peers[userId] = call;
};

const muteUnmute = () => {
  getMyVideoStream().then((myStream) => {
    console.log(myStream.getTracks());
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

const switchToScreenShare = async () => {
  if (!screenShare) {
    let newStream = await window.navigator.mediaDevices.getDisplayMedia(
      camMediaOptions
    );

    let localStream = await getMyVideoStream();

    await replaceVideoTracks(localStream, newStream);

    screenShare = true;
    setScreenShareButton();
  } else {
    let newStream = await window.navigator.mediaDevices.getUserMedia(
      camMediaOptions
    );

    let localStream = await getMyVideoStream();

    await replaceVideoTracks(localStream, newStream);

    screenShare = false;
    setNoScreenShareButton();
  }
};

const setScreenShareButton = () => {
  const html = `<i class="fas fa-desktop"></i>
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
  let trackArr = [...oldStream.getTracks()];
  for (let i = 0; i < trackArr.length; i++)
    if (trackArr[i].kind === "video") await oldStream.removeTrack(trackArr[i]);

  for (let i = 0; i < newStream.getTracks().length; i++) {
    if (newStream.getTracks()[i].kind === "video")
      await oldStream.addTrack(newStream.getTracks()[i]);
  }
};
