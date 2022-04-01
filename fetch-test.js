#test
   const fetch = require("node-fetch");

   var reqBody='id='+encodeURIComponent('356');
   reqBody+='&page='+encodeURIComponent('3');

    fetch(`https://www.geeksforgeeks.org/ajax/quiz_paging.php`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      })
      .then(res=>{console.log(res.body);
        //res.json()
      })
      /*.then(data1=>{
          console.log(data1);
       })*/
      .catch(err=>{
        console.log(err);
       })
