   const fetch = require("node-fetch");

   var reqBody="quizDescription="+encodeURIComponent('mathew');
   reqBody+='&courseId='+encodeURIComponent('joseph');
   reqBody+='&authorName='+encodeURIComponent('joseph');

    fetch(`http://localhost:3000/api/insertQuizAction`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      })
      .then(res=>{console.log(res);res.json()})
      .then(data1=>{
          console.log(data1);
       })
      .catch(err=>{
        console.log(err);
       })
