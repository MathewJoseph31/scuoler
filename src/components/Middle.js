import React from 'react';
import '../css/Middle.css';
import pieImg from '../img/target-groups-of-corporate-e-learning-pie-graph.jpg';

class Middle extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div class="Middle">
         <div className="academiaTitle Title"><h1>Elearning for Schools</h1></div>
         <div class="top-schools-row-flex">
               <div class="k12Div">
                 <h3 class="k12h3">K-12 <br/>Students</h3>
                 <p>The new generation of schoolchildren is not only digitally adept, but also highly motivated to use online learning tools.</p>
               </div>
               <div class="Mandela-quote">
                  <cite>
                     Nelson Mandela
                  </cite>
                  <p>
                      “Education is the most powerful weapon which you can use to change the world.”
                  </p>
               </div>
               <div  class="howToStudyOnline">
                  <br/><br/><br/>
                   <a href="https://e-student.org/how-to-study-online/">
                        <h3>How to Study Online: <br/>Tips & Tricks</h3>
                   </a>
               </div>
         </div>
         <div className="corporateTitle  Title"><h1>Elearning for Corporate</h1></div>
         <div class="corporate-row-flex">
            <div class="do-you-know-div-col">
              <img src="https://i1.wp.com/learningrebels.com/wp-content/uploads/2015/02/STipton_blog-229x300-80.jpg" alt="Thinking"  width="229" height="300"/>
              <p>Do you know what your employees know?</p>
            </div>
            <div class="target-groups-div-col">
              <img src={pieImg} class="attachment-large size-large lazyloaded" alt="" sizes="(max-width: 800px) 100vw, 800px"
               data-ll-status="loaded" width="800" height="387"/>
            </div>
         </div>
      </div>
    )
  }
}

export default Middle;
