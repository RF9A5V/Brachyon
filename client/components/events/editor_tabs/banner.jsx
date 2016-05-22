import React from 'react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';

export default class EventBanner extends React.Component {

  componentWillMount(){
    this.setState({file: null});
  }

  onDrop(files) {
    this.setState({file: files[0]});
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
        <Dropzone accept="image/*" multiple="false" onDrop={this.onDrop.bind(this)}>
          <div style={style}>
            <span>Drag file here to upload!</span>
          </div>
        </Dropzone>
      </div>
    );
    if(this.state.file != null) {
      rez = (
        <div style={style}>
          <Cropper src={this.state.file.preview} aspectRatio={16/9} style={{height: 400, width: 710}} />
        </div>
      );
    }
    return rez;
  }
}
