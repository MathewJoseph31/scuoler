import React from 'react';
import UserEditDialog from './UserEditDialog';
import data from './data';
import {  Redirect } from 'react-router-dom';
import {showSpinner, hideSpinner, loadUsers, setUsers} from '../stores/appStoreActions';

class UserShowSelected extends React.Component{
  constructor(props){
    super(props);
    this.state={
      showEditUserDialog:false,
      userObj:{},
      coursesArray:[],
      userObjForEdit:{},
      avatar: data.avatar,
      icons: data.icons
    }
    this.handleEditUserDialogDismiss=this.handleEditUserDialogDismiss.bind(this);
    this.editUserHandler=this.editUserHandler.bind(this);
    this.saveUpdateHandler=this.saveUpdateHandler.bind(this);
    this.firstNameChange=this.firstNameChange.bind(this);
    this.lastNameChange=this.lastNameChange.bind(this);
    this.address1Change=this.address1Change.bind(this);
    this.address2Change=this.address2Change.bind(this);
    this.selectChange=this.selectChange.bind(this);
    this.cityChange=this.cityChange.bind(this);
    this.zipChange=this.zipChange.bind(this);
    this.phoneChange=this.phoneChange.bind(this);
    this.mobileChange=this.mobileChange.bind(this);
    this.emailChange=this.emailChange.bind(this);
    this.profileImageChange=this.profileImageChange.bind(this);
  }

  componentDidMount(){

    const {params}= this.props.match;
    let dispatch=this.props.dispatch;
    showSpinner(dispatch);

    var reqBody="userId="+encodeURIComponent(params.id);
    //console.log(params.id);
    fetch(`/api/getTheUser`, {
      headers:{
        'Accept':'application/json',
        'Content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: reqBody
    })
    .then(res=>res.json())
    .then(data=>{
       //console.log(data);
      data.id=params.id;
      fetch(`/api/getCourseListForUser`,{
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      })
      .then(res=>res.json())
      .then(data1=>{
          //console.log(data1);
          this.setState({userObj: data, userObjForEdit: data, coursesArray: data1});
          hideSpinner(dispatch);
      })
    })
  }

  profileImageChange(e){
     const files = Array.from(e.target.files);
     const uploadFile=files[0];
     const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg', 'image/bmp'];

     if (allowedTypes.every(type => uploadFile.type !== type)) {
        alert('File type not supported (Only png/jpg/gif allowed)');
        return;
     }
     else if (uploadFile.size > 150000) {
        alert(`'${uploadFile.name}' is too large, please pick a smaller file`);
        return;
     }

     //console.log(uploadFile);

     const formData = new FormData();
      formData.append(0, uploadFile);

      fetch(`/api/profileImageUpload`, {
        method: 'POST',
        body: formData
      })
      .then(res=>res.json())
      .then(data=>{

        let image_urls_for_delete=this.state.userObjForEdit.image_urls_for_delete===undefined?[]:[...this.state.userObjForEdit.image_urls_for_delete];
        if(this.state.userObjForEdit.profile_image_url!==null)
          image_urls_for_delete.push(this.state.userObjForEdit.profile_image_url);

        const copied = Object.assign({}, this.state.userObjForEdit);
        copied.profile_image_url=data.secure_url;
        copied.image_urls_for_delete=image_urls_for_delete;
        this.setState({userObjForEdit:copied});
        //console.log(copied);
      });

  }

  firstNameChange(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    copied.firstName=e.target.value;
    this.setState({userObjForEdit:copied});
  }

  lastNameChange(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    copied.lastName=e.target.value;
    this.setState({userObjForEdit:copied});
  }

  address1Change(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    copied.address1=e.target.value;
    this.setState({userObjForEdit:copied});
  }

  address2Change(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    copied.address2=e.target.value;
    this.setState({userObjForEdit:copied});
  }

  cityChange(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    copied.city=e.target.value;
    this.setState({userObjForEdit:copied});
  }

  zipChange(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    copied.zip=e.target.value;
    this.setState({userObjForEdit:copied});
  }

  phoneChange(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    copied.phone=e.target.value;
    this.setState({userObjForEdit:copied});
  }

  mobileChange(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    copied.mobile=e.target.value;
    this.setState({userObjForEdit:copied});
  }
  emailChange(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    copied.email=e.target.value;
    this.setState({userObjForEdit:copied});
  }

  selectChange(e){
    const copied = Object.assign({}, this.state.userObjForEdit)
    var new_sex_male=e.target.value==="true"?true:false;
    var new_sex_description=e.target.options[e.target.selectedIndex].text;
    copied.sex_male=new_sex_male;
    copied.sex_description=new_sex_description;
      console.log(copied);
    this.setState({userObjForEdit:copied});
  }

  handleEditUserDialogDismiss(){
    this.setState({userObjForEdit: this.state.userObj, showEditUserDialog:false});
  }

  editUserHandler(){
    this.setState({showEditUserDialog:true});
  }

  saveUpdateHandler(){
    let dispatch=this.props.dispatch;
    let globalState=this.props.state;

    showSpinner(dispatch);
    //console.log(newCourseObj);
    var reqBody="id="+encodeURIComponent(this.state.userObjForEdit.id);
    reqBody+='&firstName='+encodeURIComponent(this.state.userObjForEdit.firstName);
    reqBody+='&lastName='+encodeURIComponent(this.state.userObjForEdit.lastName);
    reqBody+='&address1='+encodeURIComponent(this.state.userObjForEdit.address1);
    reqBody+='&address2='+encodeURIComponent(this.state.userObjForEdit.address2);
    reqBody+='&sex_male='+encodeURIComponent(this.state.userObjForEdit.sex_male);
    reqBody+='&city='+encodeURIComponent(this.state.userObjForEdit.city);
    reqBody+='&zip='+encodeURIComponent(this.state.userObjForEdit.zip);
    reqBody+='&phone='+encodeURIComponent(this.state.userObjForEdit.phone);
    reqBody+='&mobile='+encodeURIComponent(this.state.userObjForEdit.mobile);
    reqBody+='&email='+encodeURIComponent(this.state.userObjForEdit.email);
    reqBody+='&profile_image_url='+encodeURIComponent(this.state.userObjForEdit.profile_image_url);
    if(this.state.userObjForEdit.image_urls_for_delete!==undefined)
        reqBody+='&image_urls_for_delete='+encodeURIComponent(JSON.stringify(this.state.userObjForEdit.image_urls_for_delete));

    fetch(`/api/updateUser`, {
      headers:{
        'Accept':'application/json',
        'Content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: reqBody
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
        if(data.updatestatus==="ok"){
            loadUsers(dispatch);
            let usersArrayCopy=JSON.parse(JSON.stringify(globalState.usersArray));
            usersArrayCopy.forEach((obj)=>{
              if(obj.id===this.state.userObjForEdit.id){
                 obj.firstName=this.state.userObjForEdit.firstName;
                 obj.lastName=this.state.userObjForEdit.lastName;
                 obj.address1=this.state.userObjForEdit.address1;
                 obj.address2=this.state.userObjForEdit.address2;
                 obj.sex_male=this.state.userObjForEdit.sex_male;
                 obj.city=this.state.userObjForEdit.city;
                 obj.zip=this.state.userObjForEdit.zip;
                 obj.mobile=this.state.userObjForEdit.mobile;
                 obj.phone=this.state.userObjForEdit.phone;
                 obj.email=this.state.userObjForEdit.email;
                 obj.profile_image_url=this.state.userObjForEdit.profile_image_url;
              }
            });
            let copyObj=Object.assign({},this.state.userObjForEdit);
            copyObj.image_urls_for_delete=[];
            setUsers(usersArrayCopy, dispatch);
            this.setState({userObj: copyObj, showEditUserDialog:false});
            hideSpinner(dispatch);
            alert('User updated');
        }
    })
  }

  render(){
    {/*if(this.props.loggedInUser===''){
      return <Redirect to="/errorLogin"/>
    }*/}
    //console.log(this.state.userObj);
    let globalState=this.props.state;
    return (
      <div>
      <a className="HomeLink" href="/">
          <img class="homeIcon" src={this.state.icons.home} alt="back to home"/>
          {/*back to home*/}
      </a>
      <div class="h1">
        User Profile
      </div>
      <div className="Panel">
          {/*
            this.state.spinner===true?(<div id="spinner" className="container"><div className="loading"></div></div>):null
          */}
          <div class="h1">
            {this.state.userObj.firstName} {this.state.userObj.lastName}
          </div>
          <br/><br/>
          <div className="profileParent" style={{width:'100%', textAlign:'center'}}>
              <div className="profileCard">
                <img src={this.state.userObj.profile_image_url!=null?this.state.userObj.profile_image_url: ( this.state.userObj.sex_male==true?this.state.avatar.male:this.state.avatar.female)} alt="Avatar"/>
                {/*<div class="profileCardOverlay">Upload Image</div>*/}
              </div>
          </div>
          <br/><br/>
          {(globalState.loggedInUser===this.state.userObj.id||globalState.admin==="1")?
            (<input type="button" className="LeftButton"
            onClick={()=>this.editUserHandler()}
            id={`e${this.state.userObj.id}`} value="Edit User"/>):null
          }
          <br/> <br/>
          <b>Address:</b> {this.state.userObj.address1} {this.state.userObj.address2}  <br/>
          <p><b>Sex:</b> {this.state.userObj.sex_male===true?"Male":"Female"}</p>
          <p>  <b>City:</b> {this.state.userObj.city}</p>
          <p>  <b>Zip:</b> {this.state.userObj.zip}</p>
          <b>Phone:</b> {this.state.userObj.phone}  <br/><br/>
          <b>Mobile:</b> {this.state.userObj.mobile} <br/><br/>
          <b>Email:</b> {this.state.userObj.email}
          <div className="row">
            <div>
              <br/>
              <b>List of Courses:</b>
              <br/><br/>
              {
                this.state.coursesArray.map(obj=>(
                   <div>
                      <a href={`https://${window.location.hostname}:${window.location.port}/courseShowSelected/${obj.id}`}>{obj.name}</a><br/>
                   </div>
                  )
                )
              }
            </div>
          </div>
          <UserEditDialog
                  objectForEdit={this.state.userObjForEdit}
                  show={this.state.showEditUserDialog}
                  handleDismiss={this.handleEditUserDialogDismiss}
                  handleSubmit={this.saveUpdateHandler}
                  firstNameChange={this.firstNameChange}
                  lastNameChange={this.lastNameChange}
                  address1Change={this.address1Change}
                  address2Change={this.address2Change}
                  selectChange={this.selectChange}
                  cityChange={this.cityChange}
                  zipChange={this.zipChange}
                  phoneChange={this.phoneChange}
                  mobileChange={this.mobileChange}
                  emailChange={this.emailChange}
                  profileImageChange={this.profileImageChange}
          />
     </div>
     </div>
    )
  }


}

export default UserShowSelected;
