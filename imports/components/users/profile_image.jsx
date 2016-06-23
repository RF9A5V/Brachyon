import React, { Component } from 'react';

export default class ProfileImage extends Component {

  componentWillMount() {
    this.setState({
      hover: false,
      temp: null,
      file: null
    })
  }

  imgOrDefault() {
    if(this.state.temp != null){
      return this.state.temp;
    }
    if(this.props.imgUrl == null){
      return '/images/profile.png';
    }
    else {
      return this.props.imgUrl;
    }
  }

  previewImage(e){
    self = this;
    reader = new FileReader();
    file = e.target.files[0];
    reader.onload = function(e){
      self.setState({
        temp: e.target.result,
        file
      })
    }
    console.log(file.type)
    reader.readAsDataURL(file);
  }

  uploadImage() {
    self = this;
    reader = new FileReader();
    reader.onload = function(e) {
      data = this.result;
      len = data.length;
      arr = new Uint8Array(len);
      for(var i = 0; i < len; i ++){
        arr[i] = data.charCodeAt(i);
      }
      f = {
        type: self.state.file.type,
        content: arr
      }
      Meteor.call('users.update_profile_image', Meteor.userId(), f, function(err){
        if(err){
          toastr.error(err.reason);
        }
        else {
          toastr.success("Successfully updated profile image.");
        }
        self.setState({
          file: null
        })
      })
    }
    reader.readAsBinaryString(this.state.file);
  }

  render() {
    return (
      <div className="col x-center">
        <div className="profile-photo" onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})} style={
          {
            backgroundImage: `url(${this.imgOrDefault()})`,
            backgroundSize: '100% 100%'
          }
        }>
          {
            this.state.hover ? (
              <div className="image-overlay" onClick={() => { this.refs.img.click() }}>
                <b>Edit</b>
              </div>
            ) : (
              ""
            )
          }
        </div>
        <input type="file" style={{display: 'none'}} ref="img" onChange={this.previewImage.bind(this)} />
        {
          this.state.file != null ? (
            <button style={{marginTop: 15}} onClick={this.uploadImage.bind(this)}>Update Profile Image</button>
          ) : (
            ""
          )
        }
      </div>
    );
  }
}
