import React from 'react';
import data from './data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

class UserEditDialog extends React.Component{

  constructor(props){
    super(props);
    this.state={
      avatar: data.avatar
    }
  }

  render(){
    //console.log(this.props.objectForEdit);
    const visibilityClassName=this.props.show
    ? "simple-dialog-overlay simple-dialog-display-block"
    :"simple-dialog-overlay simple-dialog-display-none";

    return (
      <div id="UserInsert" className={visibilityClassName}>
           <div className="simple-dialog">
               <button id = "x" onClick={this.props.handleDismiss}>
                X
               </button>
               <h2>Edit Profile</h2>
               <hr className="rounded"/>
               <div className="profileParent">
                   <div className="profileCard">
                     <label htmlFor='ProfileUpload'>
                      <img src={this.props.objectForEdit.profile_image_url!=null?this.props.objectForEdit.profile_image_url: (this.props.objectForEdit.sex_male==true?this.state.avatar.male:this.state.avatar.female)} alt="Avatar"/>
                      <div className="profileCardOverlay">{this.props.objectForEdit.profile_image_url!=null?"Update Image": "Upload Image"}
                      </div>
                     </label>
                     <input type='file' id='ProfileUpload' onChange={this.props.profileImageChange} />
                   </div>
               </div>
               <br/>
               <div className="row">
                   <div id="flexColLeft"  style={{textAlign:'left'}}>
                        <div className="line">
                          <label> User Id:</label>
                          <input type="text" id="userId"
                          value={this.props.objectForEdit.id}></input>
                        </div>
                        <br/>
                        <div className="line">
                          <label> First Name: </label>
                          <input type="text" id="firstName"
                          onChange={this.props.firstNameChange}
                          value={this.props.objectForEdit.firstName}></input>
                        </div>
                        <br/>
                        <div className="line">
                          <label>
                          Last Name:
                          </label>
                          <input type="text" id="lastName"
                          onChange={this.props.lastNameChange}
                          value={this.props.objectForEdit.lastName}></input>
                       </div>
                       <br/>
                       <div className="line">
                             <label>
                              Address1:
                             </label>
                              <input type="text" id="address1"
                              onChange={this.props.address1Change}
                              value={this.props.objectForEdit.address1}></input>
                        </div>
                        <br/>
                        <div className="line">
                              <label>
                              Address2:
                              </label>
                              <input type="text" id="address2"
                              onChange={this.props.address2Change}
                              value={this.props.objectForEdit.address2}></input>
                          </div>
                          <br/>
                          <div className="line">
                            <label>
                            Sex:
                            </label>
                            <select id="sex"
                            onChange={this.props.selectChange} name="sex">
                                <option selected={this.props.address2Change.sex_male} value="true">Male</option>
                                <option selected={this.props.address2Change.sex_male===false} value="false">Female</option>
                            </select>
                          </div>
                   </div>
                   <br/>
                   <div id="flexColRight">
                   <div className="line">
                     <label>Email:</label>
                      <input type="text" id="email"
                      onChange={this.props.emailChange}
                      value={this.props.objectForEdit.email}></input>
                    </div>
                      <br/>
                      <div className="line">
                        <label>
                      City:
                       </label>
                      <input type="text" id="city"
                      onChange={this.props.cityChange}
                      value={this.props.objectForEdit.city}></input>
                      </div>
                      <br/>
                      <div className="line">
                        <label>
                          Phone:
                        </label>
                      <input type="text" id="phone"
                      onChange={this.props.phoneChange}
                      value={this.props.objectForEdit.phone}></input>
                      </div>
                      <br/>
                      <div className="line">
                        <label>
                        Zip:
                        </label>
                      <input type="text" id="zip"
                      onChange={this.props.zipChange}
                      value={this.props.objectForEdit.zip}></input>
                      </div>
                      <br/>
                      <div className="line">
                        <label>
                        Mobile:
                        </label>
                        <input type="text" id="mobile"
                        onChange={this.props.mobileChange}
                        value={this.props.objectForEdit.mobile}></input>
                      </div>
                   </div>
               </div>
               <br/>
<input type="button" value="Save Updates" onClick={this.props.handleSubmit}/>
<button id="x" style={{width:'100px', textAlign:'center'}}
  onClick={this.props.handleDismiss}>close
</button>
         </div>
    </div>)
  }
}

export default UserEditDialog;
