var configuration={
host:"ec2-107-20-193-202.compute-1.amazonaws.com",
//host:"localhost",
userId:"vyskpwrahuyzia",
//userId:"testing1",
password:"8c2734f8c3522cf405cf22f6836b8c078891867992a857291c842ff9bbec8ff6",
//password:"password",
database:"d201samrnq0t0f",
//database:"ischoools",
port:5432,
getHost: function(){
          return this.host;
         },
getUserId: function(){
          return this.userId;
         },
getPassword: function(){
          return this.password;
         },
getDatabase: function(){
          return this.database;
        },
getPort: function(){
          return this.port;
        }
};

module.exports = configuration;
