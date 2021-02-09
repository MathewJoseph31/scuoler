import React from 'react';
import Card from './Card';
import data from './data';
import '../css/ImageSlider.css';

class ImageSlider extends React.Component {

    constructor(props){
        super(props);
        this.state={
          properties:data.properties,
          property: data.properties[0],
          direction:1
        }
        this.nextProperty=this.nextProperty.bind(this);
        this.prevProperty=this.prevProperty.bind(this);
        this.rotateImage=this.rotateImage.bind(this);
    }

    componentDidMount() {
      var timer = setInterval(() => {this.rotateImage();}, 3000)
    }

    rotateImage(){
      var newDirection=this.state.direction;
      if(this.state.property.index===data.properties.length-1){
        newDirection=-1;
      }
      else if (this.state.property.index===0) {
        newDirection=1;
      }

      const newIndex=this.state.property.index+newDirection;

      this.setState(
        {
          direction:newDirection,
          property:data.properties[newIndex]
        })

    }

    nextProperty=()=>{
      const newIndex=this.state.property.index+1;
      this.setState(
        {
          property:this.state.properties[newIndex]
        }
      )
    }

    prevProperty=()=>{
      const newIndex=this.state.property.index-1;
      this.setState(
        {
          property:this.state.properties[newIndex]
        }
      )
    }

    render(){
      const {properties, property, direction}=this.state;

      return (
        <div className="SliderApp">
            <button
              disabled={this.state.property.index===data.properties.length-1}
              onClick={()=>this.nextProperty()}>Next
            </button>
            <button
              disabled={this.state.property.index===0}
              onClick={()=>this.prevProperty()}
              >Prev
            </button>
            <div className="page">
              <div className={`cards-slider active-slide-${property.index}`}>
                <div className="cards-slider-wrapper" style={{
                  'transform': `translateX(-${(property.index*100/properties.length)}%)`
                }}>
                  {
                    properties.map(property=> <Card key={property.index} property={property}/>)
                  }
                  {/*<Card key={property.index} property={property}/>*/}
                </div>
              </div>
            </div>
        </div>
      )
    }
}

export default ImageSlider;
