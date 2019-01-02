document.body.onload=changeHandler;

function closeUpdateWindow(){
  var updateDiv=document.getElementById("updateWindow");
  updateDiv.style.display='none';
}

function saveUpdateHandler(){
  var problemId=document.getElementById('problemId').value;
  var description=document.getElementById('probDescription').value;
  description=description.replace(/%20/g, '+');

  var option1=document.getElementById('option1').value;
  var option2=document.getElementById('option2').value;
  var option3=document.getElementById('option3').value;
  var option4=document.getElementById('option4').value;
  var answerkey=document.getElementById('answerKey').value;
  var quizId=document.getElementById('quizId').value;
  var solution=document.getElementById('ansDescription').value;
  solution=solution.replace(/%20/g, '+');

  var authorId=document.getElementById('authorName').value;

  var updateDiv=document.getElementById("updateWindow");

  var FD  = new FormData();
  FD.append("id", problemId);
  FD.append("description", description);
  FD.append("option1", option1);
  FD.append("option2", option2);
  FD.append("option3", option3);
  FD.append("option4", option4);
  FD.append("answerkey", answerkey);
  FD.append("quizId", quizId);
  FD.append("solution", solution);
  FD.append("authorId", authorId);

  var reqBody="id="+encodeURIComponent(problemId)+"&description="+encodeURIComponent(description)+
  "&option1="+encodeURIComponent(option1)+"&option2="+encodeURIComponent(option2)+"&option3="+encodeURIComponent(option3)+"&option4="+encodeURIComponent(option4)+
  "&answerkey="+encodeURIComponent(answerkey)+"&quizId="+encodeURIComponent(quizId)+"&solution="+encodeURIComponent(solution)+"&authorId="+encodeURIComponent(authorId);
//  alert(reqBody);

  if(updateDiv.style.display!='none')
      updateDiv.style.display='none';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var responseObj=JSON.parse(this.responseText);
      if(responseObj.updatestatus=="ok"){
        var sel=document.getElementById('quizId');
        document.getElementById('quizDescription$,'+problemId).innerHTML= sel.options[sel.selectedIndex].text;;
        document.getElementById('problemDescription$,'+problemId).innerHTML=description;
        document.getElementsByName('answerDescription$,'+problemId).innerHTML=solution;
        alert("problem updated");
      }
      else{
        alert("problem updation failed");
      }

    }
  };

  xhttp.open("POST", "updateProblem", true);
  //xhttp.setRequestHeader("Content-type", "multipart/form-data");
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(reqBody);
  //xhttp.send(FD);
}

function editProblemHandler(id, description, option1, option2, option3, option4,
 answerkey, solution, author_id, quiz_id){

 //alert(''+id+' '+description+' \n '+solution+' '+option3+' '+option4+' '+answerkey+' '+author_id+' '+quiz_id);
 var updateDiv=document.getElementById("updateWindow");
 if(updateDiv.style.display!='block')
     updateDiv.style.display='block';

 document.getElementById('problemId').value=id;
 document.getElementById('probDescription').value=description;
 document.getElementById('option1').value=option1;
 document.getElementById('option2').value=option2;
 document.getElementById('option3').value=option3;
 document.getElementById('option4').value=option4;
 document.getElementById('answerKey').value=answerkey;
 document.getElementById('ansDescription').value=solution;
 document.getElementById('authorName').value=author_id;

 var options=document.getElementById('quizId').options;
 for(var i=0;i<options.length;i++){
   if(quiz_id===options[i].value){
      options.selectedIndex=i;
      break;
   };
 }


  /*var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      updateDiv.innerHTML = this.responseText;

    }
  };
  xhttp.open("GET", "editProblem?id="+problemId, true);
  xhttp.send();*/
}

dragElement(document.getElementById("updateWindow"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id+"Header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id+"Header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/*
document.getElementById('showButton').onclick=makeVisible;

function makeVisible(){
	var qEle=document.getElementById('question');
	var aEle=document.getElementById('answer');
	var html1=qEle.innerHTML;
	var html2=aEle.innerHTML;

	qEle.innerHTML=html2;
	aEle.innerHTML=html1;

	document.getElementById('test').appendChild(qEle);

	document.getElementById('question').style.visibility='visible';
	document.getElementById('answer').style.visibility='visible';
	return true;
}*/
