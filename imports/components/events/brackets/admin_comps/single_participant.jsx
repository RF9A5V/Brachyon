import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { browserHistory } from "react-router";
import ReactDOM from 'react-dom';
import FontAwesome from "react-fontawesome";

import SeedDropdown from "./seeddropdown.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

const participantSource = {
  beginDrag(props) {
    return {
      index: props.index,
      participant: props.participant
    }
  }
};

const participantTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    //TODO: Create hover effect here. All you need to do is send in a function from the winners.jsx file, pass it through match and pass it through here
    //And then send it the hoverIndex to send the alias.

    // Time to actually perform the action
    props.onHoverEffect(dragIndex, hoverIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,

    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },

  drop(props, monitor, connect) {
    props.onDropEffect();
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

function collect2(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

class SingleParticipant extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: Instances.findOne()._id
    }
  }

  imgOrDefault(user) {
    return user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  participant() {
    const {index, participant, isDragging, hoverIndex, invisibleIndex} = this.props;
    const opacity = ( (index == invisibleIndex) || (isDragging && invisibleIndex == -1) ) ? 0 : 1;
    const user = Meteor.users.findOne(participant.id);
    return (
      <div className="participant-row row x-center" style={{width: this.state.render == "mobile" ? "100%" : "80%"}} key={index}>
        <div className="row center x-center" style={{width: "10%"}}>
          <SeedDropdown seedIndex={this.props.index} pSize={this.props.pSize} index={this.props.bIndex} id={this.state.id} updateList={this.props.onUpdate} />
        </div>
        <img src={this.imgOrDefault(user)} style={{width: this.props.opts.imgDim, height: this.props.opts.imgDim, borderRadius: "100%", marginRight: 20}} />
        <div className="col" style={{width: this.props.opts.mobile ? "25%" : "15%"}}>
          <span style={{fontSize: this.props.opts.fontSize}}>{ participant.alias }</span>
          <span style={{fontSize: `calc(${this.props.opts.fontSize} * 3 / 4)`}}>{ user ? user.username : "Anonymous" }</span>
        </div>
        <div className="row center x-center col-1" style={{opacity}} key={index}>
          {
            participant.checkedIn ? (
              this.props.opts.mobile ? (
                <FontAwesome name="check" style={{fontSize: `calc(${this.props.opts.fontSize} * 1.5)`, color: "#FF6000"}} />
              ) : (
                <span>Checked In</span>
              )
            ) : (
              this.props.opts.mobile ? (
                <FontAwesome name="sign-in" style={{fontSize: `calc(${this.props.opts.fontSize} * 1.5)`}} onClick={() => {
                  const instance = Instances.findOne();
                  if(instance.tickets) {
                    this.setState({ discountOpen: true, participant })
                  }
                  else {
                    this.props.onCheckIn(participant, this.props.index);
                  }
                }}/>
              ) : (
                <button className={this.props.opts.buttonClass} onClick={() => {
                  const instance = Instances.findOne();
                  if(instance.tickets) {
                    this.setState({ discountOpen: true, participant })
                  }
                  else {
                    this.props.onCheckIn(participant, this.props.index);
                  }
                }}>Check In</button>
              )
            )
          }
        </div>
        <div className="row center x-center col-1">
          {
            participant.paid ? (
              <span>Paid ${participant.paymentAmount}</span>
            ) : (
              <span>Unpaid</span>
            )
          }
        </div>
        <div style={{marginLeft: 20, textAlign: "right"}}>
          <FontAwesome name="cog" style={{cursor: "pointer", fontSize: `calc(${this.props.opts.fontSize} * 1.5)`}} onClick={() => { this.props.openOptions(this.props.participant) }} />
        </div>
      </div>
    )
  }

  render() {
    const {connectDragSource, connectDropTarget, completed} = this.props;
    if (completed)
      return( this.participant() );
    else
      return connectDragSource(connectDropTarget( this.participant() ));
  }
}

const x = DropTarget('participant', participantTarget, collect)(SingleParticipant)
export default DragSource('participant', participantSource, collect2)( x )
