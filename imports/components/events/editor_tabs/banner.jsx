import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';

export default class EventBanner extends TrackerReact(React.Component) {

  image() {
    return Images.find({}).fetch()[0];
  }

  componentWillMount(){
    this.setState({
      file: null,
      fileUrl: null
    });
  }

  onDrop(files) {
    this.setState({
      file: files[0],
      fileUrl: files[0].preview
    });
  }

  onClick(e){
    e.preventDefault();
    self = this;
    reader = new FileReader();
    reader.onload = function() {
      data = this.result;
      len = data.length;
      arr = new Uint8Array(len);
      for(var i = 0; i < len; i ++){
        arr[i] = data.charCodeAt(i);
      }
      Meteor.call('events.update_banner', self.props.id, arr, self.state.file.type, function(err){
        console.log('done')
        if(err){
          toastr.error(err.reason);
        }
        else {
          toastr.success("Successfully updated event banner!");
        }
      })
    }
    reader.readAsBinaryString(self.state.file);
  }

  render(){
    style = {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
    rez = (
      <div style={style}>
        <span>Drag file here to upload!</span>
      </div>

    );
    if(this.state.fileUrl || this.image()) {
      url = this.state.fileUrl;
      if(this.image() && !this.state.fileUrl){
        url = this.image().url();
      }
      console.log(url);
      rez = (
        <div className="col" style={style}>
          <Cropper src={url} aspectRatio={16/9} style={{height: 450, width: 800}} />
        </div>
      );
    }
    return (
      <div className="col x-center" style={style}>
        <Dropzone accept="image/*" multiple={false} onDrop={this.onDrop.bind(this)} style={{width: '100%'}}>
          { rez }
        </Dropzone>
        { (this.state.file != null) ? <button onClick={this.onClick.bind(this)}>Submit!</button> : "" }
      </div>
    );
  }
}
