import React from 'react';
import ReactQuill from 'react-quill';

export default class EventDescription extends React.Component {

  formats() {
    return [
      { label:'Text', type:'group', items: [
    		{ type:'bold', label:'Bold' },
    		{ type:'italic', label:'Italic' },
    		{ type:'separator' },
    		{ type:'link', label:'Link' },
        { type:'separator' },
        { type:'bullet', label:'Bullet' },
    		{ type:'separator' },
    		{ type:'list', label:'List' },
        { type:'separator' },
        { type:'image', label:'Image' }
    	]},
    ];
  }

  onSubmit(e) {
    e.preventDefault();
    self = this;
    Meteor.call('events.update_description', self.props.id, self.editor.getEditor().getHTML(), function(err){
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated event description!");
      }
    })
  }

  render() {
    return (
      <div className="row center">
        <form className="col x-center" style={{width: '75%'}} onSubmit={this.onSubmit.bind(this)}>
          <ReactQuill ref={(ref) => {this.editor = ref}} value={this.props.description} theme="snow"
          toolbar={this.formats()} style={{alignSelf: 'stretch'}}/>
          <div>
            <input style={{marginTop: '15px'}} type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  }
}