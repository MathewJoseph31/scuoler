import React from 'react';
import {  Redirect } from 'react-router-dom';
import data from './data';
import {showSpinner, hideSpinner, setUsers} from '../stores/appStoreActions';

class UserInsert extends React.Component{

  constructor(props){
    super(props);
    this.state={
      spinner:false,
      userId:'',
      password:'',
      firstName:'',
      lastName:'',
      address1:'',
      address2:'',
      city:'',
      zip:'',
      phone:'',
      cell:'',
      email:'',
      sex_male: true,
      profile_image_url:null,
      image_urls_for_delete:[],
      avatar: data.avatar,
      icons: data.icons
    }
    this.baseState=this.state;
    this.userIdChange=this.userIdChange.bind(this);
    this.passwordChange=this.passwordChange.bind(this);
    this.firstNameChange=this.firstNameChange.bind(this);
    this.lastNameChange=this.lastNameChange.bind(this);
    this.address1Change=this.address1Change.bind(this);
    this.address2Change=this.address2Change.bind(this);
    this.profileImageChange=this.profileImageChange.bind(this);
    this.cityChange=this.cityChange.bind(this);
    this.zipChange=this.zipChange.bind(this);
    this.phoneChange=this.phoneChange.bind(this);
    this.cellChange=this.cellChange.bind(this);
    this.emailChange=this.emailChange.bind(this);
    this.selectChange=this.selectChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.setBaseState=this.setBaseState.bind(this);
  }

  handleSubmit(e){
    let dispatch=this.props.dispatch;
    let globalState=this.props.state;
    if(this.state.userId===''||this.state.password===''){
      alert('UserId/Password cannot be empty');
      return;
    }
    else{
      showSpinner(dispatch);
      var reqBody='userId='+encodeURIComponent(this.state.userId.trim());
      reqBody+='&password='+encodeURIComponent(this.state.password);
      reqBody+='&firstName='+encodeURIComponent(this.state.firstName);
      reqBody+='&lastName='+encodeURIComponent(this.state.lastName);
      reqBody+='&address1='+encodeURIComponent(this.state.address1);
      reqBody+='&address2='+encodeURIComponent(this.state.address2);
      reqBody+='&city='+encodeURIComponent(this.state.city);
      reqBody+='&zip='+encodeURIComponent(this.state.zip);
      reqBody+='&phone='+encodeURIComponent(this.state.phone);
      reqBody+='&cell='+encodeURIComponent(this.state.cell);
      reqBody+='&email='+encodeURIComponent(this.state.email);
      reqBody+='&sex_male='+encodeURIComponent(this.state.sex_male);
      reqBody+='&profile_image_url='+encodeURIComponent(this.state.profile_image_url);
      reqBody+='&image_urls_for_delete='+encodeURIComponent(JSON.stringify(this.state.image_urls_for_delete));

      fetch(`/api/insertUserAction`, {
        headers:{
          'Accept':'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: reqBody
      })
      .then(res=>{
                  if(res.ok)
                    return res.json();

                  throw new Error('Something went wrong with the last request, please try again or contact the maintenance team.');
                 })
      .then(data=>{
          //if(data.updatestatus=="ok")
              let usersArrayCopy=[...globalState.usersArray];
              let obj={
                id:this.state.userId,
                password:this.state.password,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                address1: this.state.address1,
                address2: this.state.address2,
                city:this.state.city,
                zip:this.state.zip,
                phone:this.state.phone,
                mobile:this.state.cell,
                email:this.state.email,
                profile_image_url: this.state.profile_image_url,
                sex_male: this.state.sex_male
              };
              usersArrayCopy.push(obj);
              setUsers(usersArrayCopy, dispatch);
              this.setState(this.baseState);
              hideSpinner(dispatch);
              alert('User inserted');
              window.location.assign("https://"+window.location.hostname+':'+window.location.port);
      })
      .catch(error=>{
        this.setBaseState();
        alert(' '+ error);
      });

    }
  }

  setBaseState(){
    this.setState(this.baseState);
    hideSpinner(this.props.dispatch);
  }

  emailChange(e){
    this.setState({email:e.target.value})
  }

  cellChange(e){
    this.setState({cell:e.target.value})
  }

  phoneChange(e){
    this.setState({phone:e.target.value})
  }

  zipChange(e){
    this.setState({zip:e.target.value})
  }

  cityChange(e){
    this.setState({city:e.target.value})
  }

  address2Change(e){
    this.setState({address2:e.target.value})
  }

  address1Change(e){
    this.setState({address1:e.target.value})
  }

  lastNameChange(e){
    this.setState({lastName:e.target.value})
  }

  firstNameChange(e){
    this.setState({firstName:e.target.value})
  }

  passwordChange(e){
    this.setState({password:e.target.value})
  }

  userIdChange(e){
    this.setState({userId:e.target.value})
  }

  selectChange(e){
    var new_sex_male=e.target.value==="true"?true:false;
    this.setState({sex_male:new_sex_male});
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
       console.log(data);

       let image_urls_for_delete=this.state.image_urls_for_delete===undefined?[]:[...this.state.image_urls_for_delete];
       if(this.state.profile_image_url!==null)
         image_urls_for_delete.push(this.state.profile_image_url);

       this.setState({profile_image_url: data.secure_url, image_urls_for_delete: image_urls_for_delete});
     });
  }

  render(){
    let globalState=this.props.state;
    if(globalState.loggedInUser!==''){
      return <Redirect to="/errorLogin"/>
    }
    return (
      <div id="UserInsert">
      <a class="HomeLink" href="/">
          <img className="homeIcon" src={this.state.icons.home} alt="back to home"/>
          {/*back to home*/}
      </a>
          <div class="h1">
          Register User
          </div>
          <fieldset>
          <br/><br/>
          <div className="profileParent">
              <div className="profileCard">
                <label htmlFor='ProfileUpload'>
                <img src={this.state.profile_image_url!=null?this.state.profile_image_url: ( this.state.sex_male==true?this.state.avatar.male:this.state.avatar.female)} alt="Avatar"/>
                <div className="profileCardOverlayInsert">{this.state.profile_image_url!=null?"Update Image": "Upload Image"}
                </div>
               </label>
               <input type='file' id='ProfileUpload' onChange={this.profileImageChange} />
              </div>
          </div>
          <br/>
            <div className="row">
                <div id="flexColLeft">
                  <div className="line">
                        <label>User Id:</label>
                        <input id="userId" name="userId"  type="text"
                        value={this.state.userId}
                        onChange={this.userIdChange}>
                        </input>
                   </div>
                   <br/>
                  <div className="line">
                           <label>
                        Password:</label>
                        <input id="password" name="password" type="password"
                        value={this.state.password}
                        onChange={this.passwordChange}>
                        </input>
                  </div><br/>
                  <div className="line">
                          <label>
                        First Name:
                         </label>
                        <input id="firstName" name="firstName" type="text"
                        value={this.state.firstName}
                        onChange={this.firstNameChange}
                        ></input>
                  </div>
                  <br/>
                  <div className="line">
                          <label>
                        Last Name:
                         </label>
                        <input id="lastName" name="lastName" type="text"
                        value={this.state.lastName}
                        onChange={this.lastNameChange}>
                        </input>
                  </div>
                  <br/>
                  <div className="line">
                          <label>
                        Phone:
                        </label>
                        <input id="phone" name="phone"  type="text"
                        value={this.state.phone}
                        onChange={this.phoneChange}
                        ></input>
                  </div>
                  <br/>
                  <div className="line">
                          <label>
                          Cell num:
                          </label>
                         <input id="cell" name="cell" type="text"
                         value={this.state.cell}
                         onChange={this.cellChange}
                         ></input>
                  </div>
                </div> {/*end of flexColLeft*/}
                <br/>
                <div id="flexColRight" >
                    <div className="line">
                        <label>Address1:</label>
                       <input id="address1" name="address1" type="text"
                       value={this.state.address1}
                       onChange={this.address1Change}
                       ></input>
                    </div>
                    <br/>
                    <div className="line">
                      <label>
                       Address2:
                       </label>
                      <input id="address2" name="address2" type="text"
                      value={this.state.address2}
                      onChange={this.address2Change}
                        ></input>
                    </div>
                        <br/>
                    <div className="line">
                      <label>
                        City:
                      </label>
                        <input  id="city" name="city" type="text"
                        value={this.state.city}
                        onChange={this.cityChange}
                         ></input>
                    </div>
                    <br/>
                    <div className="line">
                        <label>
                      Zip:
                      </label>
                      <input  id="zip" name="zip" type="text"
                      value={this.state.zip}
                      onChange={this.zipChange}
                      ></input>
                    </div>
                    <br/>
                    <div className="line">
                        <label>
                       Email:
                       </label>
                       <input  id="email" name="email" type="text"
                       value={this.state.email}
                       onChange={this.emailChange}
                        >
                       </input>
                    </div>
                    <br/>
                    <div className="line">
                         <label>
                       Sex:
                        </label>
                         <select id="sex"
                         onChange={this.selectChange} name="sex">
                             <option value="true">Male</option>
                             <option value="false">Female</option>
                         </select>
                    </div>
                    <div style={{width: '100%', textAlign: 'right'}}>
                        <input type="submit" style={{width: '20%'}} value="submit"
                        onClick={this.handleSubmit}/>
                    </div>
                </div> {/*end of flexColRight*/}
              </div>{/*end of row*/}
          </fieldset>
      </div>
    )
  }

}

export default UserInsert;
