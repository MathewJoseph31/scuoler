class SimpleInputDialog extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    const visibilityClassName=this.props.show
    ? "simple-dialog-overlay simple-dialog-display-block"
    :"simple-dialog-overlay simple-dialog-display-none";

    return (
          <div className={visibilityClassName}>
             <div className="simple-input-dialog">
                    <input type="text" value={this.props.editObject.marks_awarded}
                    onChange={this.props.handleEdit}/>
                    <button id="x" style={{width:'100px'}}
                     onClick={this.props.handleDismiss}
                    >close
                    </button>
                   <input type="button" id="x" value="Save" style={{width:'100px', float: "right"}}
                   onClick={this.props.handleSave}
                   value="save"/>
              </div>
          </div>
        );
  }

}

export default SimpleInputDialog;
