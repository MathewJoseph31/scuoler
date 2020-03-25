   const fetch = require("node-fetch");

   var reqBody="userId="+encodeURIComponent('mathew');
   reqBody+='&password='+encodeURIComponent('josep');

    fetch(`https://ischools.herokuapp.com/api/login`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      })
      .then(res=>res.json())
      .then(data1=>{
          console.log(data1);
       })
      .catch(err=>{
        console.log(err);
       })
