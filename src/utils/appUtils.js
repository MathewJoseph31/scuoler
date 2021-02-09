import {decrypt} from './utils';

export async function retrieveProblems(state){
  let url='/api/getProblems';

  if(state.currentProblemsPage!==undefined&&state.pageSize!==undefined){
    url+='?currentPage='+state.currentProblemsPage+'&pageSize='+state.pageSize;
  }

  let resObj=await fetch(url, {
    headers:{
      'Accept':'application/json'
    }
  });

  let jsonStr=await resObj.json();
  let decStr=decrypt(jsonStr);
  let jsonArray=JSON.parse(decStr);
  //console.log(jsonArray);

  return jsonArray;

}

export async function retrieveQuizes(state){
  let url='/api/getQuizes';

  if(state.currentQuizesPage!==undefined&&state.pageSize!==undefined){
    url+='?currentPage='+state.currentQuizesPage+'&pageSize='+state.pageSize;
  }

  let resArray=await fetch(url, {
    headers:{
      'Accept':'application/json'
    }
  });
  let jsonArray=await resArray.json();
  return jsonArray;
}

export async function retrieveCourses(state){
  let url='/api/getCourses';

  if(state.currentCoursesPage!==undefined&&state.pageSize!==undefined){
    url+='?currentPage='+state.currentCoursesPage+'&pageSize='+state.pageSize;
  }

  let resArray=await fetch(url, {
    headers:{
      'Accept':'application/json'
    }
  });
  let jsonArray=await resArray.json();
  return jsonArray;
}

export async function retrieveUsers(state){
  let url='/api/getUsers';

  if(state.currentUsersPage!==undefined&&state.pageSize!==undefined){
    url+='?currentPage='+state.currentUsersPage+'&pageSize='+state.pageSize;
  }

  let resArray=await fetch(url, {
    headers:{
      'Accept':'application/json'
    }
  });
  let jsonArray=await resArray.json();
  return jsonArray;
}

export async function retrieveMeetings(state){
  let url='/api/getMeetings';

  if(state.currentMeetingsPage!==undefined&&state.pageSize!==undefined){
    url+='?currentPage='+state.currentMeetingsPage+'&pageSize='+state.pageSize;
  }

  let resArray=await fetch(url, {
    headers:{
      'Accept':'application/json'
    }
  });
  let jsonArray=await resArray.json();
  return jsonArray;
}
