function showAnswerHandler(id){
 var index=id.id.indexOf('$')
 var answerId='d'+id.id.substring(1,index);
 //document.getElementById(answerId).style.color='blue';
 if(document.getElementById(answerId).style.display==='none'){
  // document.getElementById(answerId).style.visibility='hidden';
 document.getElementById(answerId).style.display='block';
 }
 else{
   document.getElementById(answerId).style.display='none';
 }
}

function changeHandler(){

  var i;
  var answerElements=document.getElementsByClassName('Answer');
        for(i=0;i<answerElements.length;i++){
             answerElements[i].style.display='none';
         }
  var showAnswerElements=document.getElementsByClassName('showAnswer');
  
}


function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
}

includeHTML();
