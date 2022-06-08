/*try {
      myVideo = document.createElement("video");
      myVideo.autoplay = false;
      myVideo.muted = true;
    } catch (err) {
      console.log("video createing error", err);
}*/

let path = window.location.pathname;
let ROOM_ID = path.substring(path.lastIndexOf("/") + 1);

const socket = io("/");
const videoGrid = document.getElementById("videoChat-left-video-grid");
videoGrid.insertAdjacentHTML("beforeend", `<video autoplay="true" />`);
let myVideo = videoGrid.firstChild;
let myVideoStream;
let myPeerId;
let myName;
const peers = {};

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

const textEle = document.getElementById("chat_message");

textEle.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.key === "Enter" && textEle.value?.length > 0) {
    let chatMsg = { name: myName, message: textEle.value };
    socket.emit("message", JSON.stringify(chatMsg));
    textEle.value = "";
  }
});

socket.on("createMessage", (jsonChatMsg) => {
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

const scrollToBottom = (node) => {
  node.scrollTop = node.scrollHeight;
};

let peer = new Peer(undefined, {
  path: "/peerjsServer",
  host: "/",
  port: "443",
});

const camMediaOptions = {
  video: true,
  audio: true,
};

/*let getUserMedia =
  window.navigator.mediaDevices.getUserMedia ||
  window.navigator.getUserMedia ||
  window.navigator.webkitGetUserMedia ||
  window.navigator.mozGetUserMedia;*/

//const initializePeer = () => {
peer.on("open", (myId) => {
  myPeerId = myId;
  //console.log("room peer", ROOM_ID, myPeerId);

  myVideo?.setAttribute("class", myId);
  socket.emit("join-room", ROOM_ID, myId);

  if (!myName) {
    getMyName(myId);
  }
});
//};

window.navigator.mediaDevices
  .getUserMedia(camMediaOptions)
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, myVideoStream);
  })
  .catch((err) => {
    console.log(`err in getting user media ${err}`);
  });

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

socket.on("user-connected", (userId) => {
  console.log("user connected");
  connectToNewUser(userId, myVideoStream);
});

socket.on("user-disconnected", (userId) => {
  let videoEle = document.getElementsByClassName(userId)[0];
  if (videoEle) {
    videoEle.remove();
  }
  if (peers[userId]) peers[userId].close();
});

peer.on("call", (call) => {
  // Answer the call, providing our mediaStream
  if (!myVideoStream) {
    window.navigator.mediaDevices
      .getUserMedia(camMediaOptions)
      .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, myVideoStream);
        call.answer(myVideoStream);
      })
      .catch((err) => {
        console.log(`err in getting user media ${err}`);
      });
    //initVideoStream(myVideoStream);
  } else {
    call.answer(myVideoStream);
  }
  //console.log("on call", myVideoStream);
  videoGrid.insertAdjacentHTML(
    "beforeend",
    `<video class="${call.peer}" autoplay="true"  />`
  );
  let video;
  call.on("stream", (userVideoStream) => {
    video = videoGrid.lastChild;
    //video.setAttribute("class", call.peer);
    //const video = document.createElement("video");
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    //console.log("closing call");
    video.remove();
  });
  peers[call.peer] = call;
});

const connectToNewUser = (userId, myStream) => {
  const call = peer.call(userId, myStream);
  console.log("another new user", userId, call);
  videoGrid.insertAdjacentHTML(
    "beforeend",
    `<video class="${userId}" autoplay="true" />`
  );
  let video;
  call.on("stream", (userVideoStream) => {
    //const video = document.createElement("video");
    //console.log("stream arrived", userId, userVideoStream);
    video = videoGrid.lastChild;
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
  if (!myVideoStream.getAudioTracks()[0]) return;

  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    setMuteButton();
  }
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
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideoButton();
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    setStopVideoButton();
  }
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
