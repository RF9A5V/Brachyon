import React, { Component } from 'react';
import ImageModal from '/imports/components/public/img_modal.jsx';
import ImageForm from '/imports/components/public/img_form.jsx';

export default class ProfileImage extends Component {

  componentWillMount() {
    this.setState({
      hover: false,
      open: false
    })
  }

  imgOrDefault() {
    if(this.state.preview != null){
      return this.state.preview;
    }
    if(this.props.imgUrl == null){
      return '/images/profile.png';
    }
    else {
      return this.props.imgUrl;
    }
  }

  updateProfileImage(file, dimensions) {
    Meteor.call('users.update_profile_image', Meteor.userId(), file, dimensions, function(err) {
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated profile image!");
      }
    });
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
              <div className="image-overlay" onClick={() => { this.setState({open: true}); }}>
                <b>Edit</b>
              </div>
            ) : (
              ""
            )
          }
        </div>
        <ImageModal open={this.state.open}>
          <ImageForm handler={this.updateProfileImage.bind(this)} />
        </ImageModal>
      </div>
    );
  }
}
