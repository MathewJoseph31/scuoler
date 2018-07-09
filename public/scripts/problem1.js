document.body.onload=changeHandler;
document.getElementById('showButton').onclick=makeVisible;

function makeVisible(){
	var qEle=document.getElementById('question');
	var aEle=document.getElementById('answer');
	var html1=qEle.innerHTML;
	var html2=aEle.innerHTML;

	qEle.innerHTML=html2;
	aEle.innerHTML=html1;
	
	//document.getElementById('test').appendChild(qEle);
	
	document.getElementById('question').style.visibility='visible';
	document.getElementById('answer').style.visibility='visible';
//	return true;
}

function changeHandler(){
	alert('hello to all');
	document.getElementById('question').style.visibility='hidden';
	document.getElementById('answer').style.visibility='hidden';
}
