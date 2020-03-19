   const fetch = require("node-fetch");

    var reqBody="courseId="+encodeURIComponent('Mathew08112018201553');
    fetch(`https://ischools.herokuapp.com/api/getQuizListForCourse`, {
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
