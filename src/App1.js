import React from 'react';
import logo from './logo.svg';
//import './App.css';
import  './css/style.css'

function App() {
  return (
    <div className="Header">
    <form method="post" action="login">
<table>
<tr>
<td/>
<td><a href='/registerUser'>Register User</a></td>
</tr>
<tr>
<td id="logo">Schools.com</td>
<td>
<button tabindex="3">Login</button>
<input type="password" id="password" name="password" tabindex="2"></input>
<label for="password">password</label>
<input type="text" id="userId" name="userId" tabindex="1"></input>
<label for="userId">user id</label>
</td>
</tr>
</table>
</form>

<div className="h1">
Probability and Statistics
</div>
<fieldset className="fieldSet">
<div className="dropdown">
<button className="problemMenuButton menuButton" onclick="problemClick()">Problem</button>
  <div id="problemMenu" className="problem-dropdown-content dropdown-content">
    <a onclick="insertProblem()">Insert</a>
    <a onclick="browseProblem()">Browse</a>
  </div>
</div>

<div className="dropdown">
<button className="quizMenuButton  menuButton" onclick="quizClick()">Quiz</button>
  <div id="quizMenu" className="quiz-dropdown-content dropdown-content">
    <a onclick="insertQuiz()">Insert</a>
    <a onclick="browseQuiz()">Browse</a>
  </div>
</div>

<div className="dropdown">
<button className="courseMenuButton menuButton" onclick="courseClick()">Course</button>
  <div id="courseMenu" className="course-dropdown-content dropdown-content">
    <a onclick="insertCourse()">Insert</a>
    <a onclick="browseCourse()">Browse</a>
  </div>
</div>

<div className="dropdown">
<button className="userMenuButton menuButton" onclick="userClick()">User</button>
  <div id="userMenu" className="user-dropdown-content dropdown-content">
    <a onclick="insertUser()">Insert</a>
    <a onclick="browseUser()">Browse</a>
  </div>
</div>
</fieldset>
Both probabibility and statistics are key tools in applying reasoning skills
to both real life problems and technical problems at work. It allows you to
predict the future on the basis of how the past was. <br/>

<div id="ShortCut">
If you are already confident about the theory click <a href="./browseProblem">here</a>
to directly go to excercises.
</div>
When you talk about probabibility, you generally talk about an
experiment.
An <i>experiment</i> abstractly is a process with which you generally associate
<i>outcomes</i> or results. For practical experiments, the set of all
possible outcomes are  finite and is called the <b>Sample Space</b>,
often noted as S.   Some examples are the following:
<ul>
<li>
<b>Sports experiment</b>
Tomorrow Syracuse Oranges are playing against
 the Rochester Razor Sharks. The are exactly two outcomes possible:
	<ol>
	<li>Oranges Win (i.e. Sharks looses), denoted o</li>
  <li>Sharks Win (i.e.  Oranges looses), denoted s</li>
   <li> Neither Wins (i.e. match ends in a draw), denoted d</li>
 	</ol>
 Hence the sample space S=[o,s,d].<br/>
 <img src="img/Orange.jpeg" height="200" width="250" className="tab2Allign"/>
</li>
<li>
<b>Tossing a coin.</b> There are two possible outcomes
	<ol>
	<li>Outcome of getting the heads, noted h</li>
	<li>Outcome of getting the heads, noted t</li>
	</ol>
Hence, the sample space S=[h,t].	<br/>
<img src="img/coin.jpeg" height="200" width="400"  className="tab2Allign"/>
</li>
<li>
<b>Playing Cards</b> A standard deck of playing cards has
52 cards (13 spades, 13 hearts, 13 clubs, 13 dice).
It is your neighbours turn, and for the experiment of
her/him throwing the card. <br/> The sample space S=[<br/>
&spades; A, &spades; 2, ..., &spades; 10, &spades; J, &spades; Q, &spades; K, <br/>
   &clubs; A,..., <br/>
   &hearts; A, ..., <br/>
   &diamond; A, ..., &emsp; &emsp; &emsp; ..., &emsp; &emsp; &emsp; &emsp; &diamond; K] <br/>
   <br/>
<img src="img/Cards.jpeg" height="300" width="150"  className="tab2Allign"/>
</li>
</ul>
Naturally, we might often seek to know
the <i>probabibility</i> of a certain outcome o of an experiment. It is
given by the following formula.
<div className="tab2Allign">
p(o)=1/n(S)
</div>
where n(S) is the number of elements in the sample space.

More often, there is a quest about knowing the probability
of a set of outcomes, which abstractly is an <i>event</i>
in probability. Formally, an event is any subset of the sample space.
The probability of an event E is given by:<br/>
  &emsp; P(E) = n(E)/n(S) <br/>
  where n(E) is the number of elements in E and n(S) is the number of elements of the sample space.
<p className="example">
Suppose a card is picked from a standard
 deck of 52 cards. The event H of getting a hearts is as follows:<br/>
 &emsp; H=  [&hearts; A,  &hearts; 2, ..., &hearts; J, &hearts; Q, &hearts; K] <br/>
 The probability of draw a hearts is given by:<br/>
 &emsp; p(H) =  n(H)/n(S) = 13/52 = 1/4 = 0.25
</p>

<div id="ShortCut">
 Click <a href="./browseProblem">here</a> to go to excercises.
</div>
{/*<iframe width="240" height="230" src="http://www.youtube.com/embed/k6U-i4gXkLM" frameborder="0" allowfullscreen></iframe>
<iframe width="240" height="230" src="/home/mathew/Videos/Teena.mpeg">asfd</iframe>*/}
</div>
  );
}

export default App;
