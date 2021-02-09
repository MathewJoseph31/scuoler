import React from 'react';

const Card = ({property})=>{
  const {index, image} = property;
  return (
    <div id={`card-${index}`} className="card">
      <img src={image} alt="Hello img"/>
    </div>
  )
}
export default Card;
