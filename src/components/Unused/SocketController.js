var activeSockets = [];
var socketUserMap={};

var activeUserIds = [];

var userIdSocketMap={};
var userIdNameMap={};

var socketHandler=async function(socket) {
    // write all the realtime communication functions here
     socket.on("map", (data)=>{
       garbageCollect(data.userName, data.userId, socket.id);

       const existingUser = activeUserIds.find(
           user => user === data.userId
       );

       if (!existingUser) {
           activeUserIds.push(data.userId);
           userIdSocketMap[data.userId]=socket.id;
           userIdNameMap[data.userId]=data.userName;
           //console.log('sockets '+activeSockets);
           //console.log('socketMap '+JSON.stringify(socketUserMap));
          socket.emit("update-user-list", {
            userIds: activeUserIds.filter(
              existingUser => existingUser !== data.userId
            ),
            nameMap: userIdNameMap
          });

          socket.broadcast.emit("update-user-list", {
            userIds: [data.userId],
            nameMap: userIdNameMap
          });
       }
      //else console.log('Map handler: socketMap '+JSON.stringify(socketUserMap));
     })

     socket.on("ice-candidate", (data)=>{
       socket.broadcast.emit("ice-candidate", data);
     })

     socket.on("call-user", (data) => {
       //console.log('in call-user');
       socket.to(userIdSocketMap[data.to]).emit("call-rcvd", {
         offer: data.offer,
         from: data.from
       });
     });

     socket.on("make-answer", data => {
       console.log('in make-answer');
       socket.to(userIdSocketMap[data.to]).emit("answer-rcvd", {
         from: data.from,
         answer: data.answer
       });
     });

     socket.on("reject-call", data => {
      socket.to(userIdSocketMap[data.to]).emit("call-rejected", {
        from: data.from
      });
     });

     socket.on("ack-callee", (data) => {
       //console.log('in call-user');
       socket.to(userIdSocketMap[data.to]).emit("ack-callee-rcvd", {
         from: data.from
       });
     });

     socket.on("disconnect", () => {
       console.log('a user disconnected');
       for(let attr in userIdSocketMap){
         if(userIdSocketMap[attr]===socket.id){
           activeUserIds=activeUserIds.filter(
             userId => userId!==attr
           );
           delete userIdSocketMap[attr];
           delete userIdNameMap[attr];
           socket.broadcast.emit("remove-user", {
             userId: attr
             //socketId: socket.id
           });
         }
       }

     });
}

var socketHandler1=async function(socket) {
    // write all the realtime communication functions here

     socket.on("map", (data)=>{
       garbageCollect(data.user, socket.id);
       //copied from begginning

       const existingSocket = activeSockets.find(
           existingSocket => existingSocket === socket.id
       );

       if (!existingSocket) {
         activeSockets.push(socket.id);
         socketUserMap[socket.id]=data.user;


         //console.log('sockets '+activeSockets);
         //console.log('socketMap '+JSON.stringify(socketUserMap));

        socket.emit("update-user-list", {
          users: activeSockets.filter(
            existingSocket => existingSocket !== socket.id
          ),
          socketMap: socketUserMap
        });

        socket.broadcast.emit("update-user-list", {
          users: [socket.id],
          socketMap: socketUserMap
        });
      }
      //else console.log('Map handler: socketMap '+JSON.stringify(socketUserMap));
     })

     socket.on("ice-candidate", (data)=>{
       socket.broadcast.emit("ice-candidate", data);
     })

     socket.on("call-user", (data) => {
       //console.log('in call-user');
       socket.to(data.to).emit("call-rcvd", {
         offer: data.offer,
         socket: socket.id
       });
     });

     socket.on("make-answer", data => {
       console.log('in make-answer');
       socket.to(data.to).emit("answer-rcvd", {
         socket: socket.id,
         answer: data.answer
       });
     });

     socket.on("reject-call", data => {
      socket.to(data.from).emit("call-rejected", {
        socket: socket.id
      });
     });

     socket.on("ack-callee", (data) => {
       //console.log('in call-user');
       socket.to(data.to).emit("ack-callee-rcvd", {
         socket: socket.id
       });
     });

     socket.on("disconnect", () => {
       console.log('a user disconnected');
        activeSockets = activeSockets.filter(
         existingSocket => existingSocket !== socket.id
       );
       delete socketUserMap[socket.id];
       socket.broadcast.emit("remove-user", {
         socketId: socket.id
       });
     });
}


function garbageCollect(userName,userId, p_socketId){
  if(Object.keys(userIdSocketMap).includes(userId)){
    if(userIdSocketMap[userId]!==p_socketId){
      delete userIdSocketMap[userId];
    }
  }
  if(Object.keys(userIdNameMap).includes(userId)){
    if(userIdNameMap[userId]!==userName){
      delete userIdNameMap[userId];
    }
  }
}

/*function garbageCollect(userName,userId, p_socketId){
  if(Object.values(socketUserMap).includes(userName))
  {
    for(let sockId in socketUserMap)
    {
      if(socketUserMap[sockId]===userName && sockId!==p_socketId){
        //console.log('reacted'+sockId);
         delete socketUserMap[sockId];
         activeSockets=activeSockets.filter(
           existingSocketId => existingSocketId !== sockId
         )
      }
      if(!activeSockets.includes(sockId)&&sockId!==p_socketId)
         delete socketUserMap[sockId];
    }

  }
}*/

const dbControllerMeeting=require('./DBcontrollerMeeting');

/*Export method that accepts an http server instance as param and performs the necessary
socket io initialization and message handling definitions*/
exports.handleSocketIO=function(server){
  //const io = require('socket.io')(server);
  const io = require('socket.io')({
    "transports": ["xhr-polling"],
    "polling duration": 10
  });
  io.listen(server);
  getMeetings(io).then();

  io.on('connection', socketHandler);

}

var namespaceHandler=async function(socket, organiserId) {
  socket.on("map", (data)=>{
    console.log('in map'+data.user+' '+socket.id);
    //copied from begginning

  })
}

async function getMeetings(io){
  let data=await dbControllerMeeting.getMeetingsListAsync();
  data.map(obj=>{
    let nspId='/'+obj.id;
    console.log(nspId+' '+obj.organiser_id);
    let nsp=io.of(nspId);
    nsp.on('connection', (socket)=>namespaceHandler(socket, obj.organiser_id).then())
  })
  //console.log('results1\n');
  //console.log(data);
}
