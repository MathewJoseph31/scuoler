const CryptoJs=require("crypto-js");
const symmetricKey='';


export const encrypt=function(text){
  return CryptoJs.AES.encrypt(text, symmetricKey).toString();
};

export const decrypt=function(text){
  var bytes=CryptoJs.AES.decrypt(text, symmetricKey);
  return bytes.toString(CryptoJs.enc.Utf8);
};


export const getMinutesRemaining=(str_start_timestamp, str_duration_minutes)=>{
  const start_timestamp=Date.parse(str_start_timestamp);
  var startTime=new Date();
  startTime.setTime(start_timestamp);
  const current_timestamp=Date.now();
  const MsRemaining=start_timestamp+
                    parseInt(str_duration_minutes)*60*1000-current_timestamp;
  var mins_remaining= Math.round(MsRemaining/60000);
  return mins_remaining;
};

export const nvl=(str)=>{
  if(str===null)
    return '';
  else
    return str;
};

export const getCurrentTimestampString=()=>{
  const current_timestamp=new Date();
  let mm=current_timestamp.getMonth()+1;
  mm=mm<10?"0"+mm:""+mm;
  let dd=current_timestamp.getDate();
  dd=dd<10?"0"+dd:""+dd;
  let hh=current_timestamp.getHours();
  hh=hh<10?"0"+hh:""+hh;
  let mins=current_timestamp.getMinutes();
  mins=mins<10?"0"+mins:""+mins;
  let ss=current_timestamp.getSeconds();
  ss=ss<10?"0"+ss:""+ss;
  return current_timestamp.getFullYear()+'-'+mm+'-'+dd+'T'+hh+':'+mins+':'+ss;
};

export const getPageArray=(currentPage, lastPage)=>{
  let pageArray=[];
  if(currentPage>1){
    pageArray.push(currentPage-1);
    pageArray.push(currentPage);
  }
  else{
    pageArray.push(currentPage);
  }
  if(!lastPage)
    pageArray.push(currentPage+1);

  return pageArray;
};
