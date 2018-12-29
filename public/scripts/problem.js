document.body.onload=changeHandler;

function closeUpdateWindow(){
  var updateDiv=document.getElementById("updateWindow");
  updateDiv.style.display='none';
}


function editProblemHandler(id, description, option1, option2, option3, option4,
 answerkey, solution, author_id, quiz_id){

 //alert(''+id+' '+description+' \n '+solution+' '+option3+' '+option4+' '+answerkey+' '+author_id+' '+quiz_id);
 var updateDiv=document.getElementById("updateWindow");
 updateDiv.style.display='block';

 document.getElementById('probDescription').value=description;
 document.getElementById('ansDescription').value=solution;
 document.getElementById('authorName').value=author_id;

  /*var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      updateDiv.innerHTML = this.responseText;

    }
  };
  xhttp.open("GET", "editProblem?id="+problemId, true);
  xhttp.send();*/
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
