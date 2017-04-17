import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { browserHistory } from "react-router";
import { findDOMnode } from 'react-dom';

const participantSource = {
  beginDrag(props) {
    return {
      alias: props.player.alias
    }
  }
};

const participantTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().alias;
    const hoverIndex = props.player.alias;

    return;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

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
    props.switchparticipant(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },

  drop(props, monitor, connect) {
    const dragIndex = monitor.getItem().alias;
    const hoverIndex = props.player.alias;
    if (dragIndex == hoverIndex)
      return;

    props.swapParticipant(dragIndex, hoverIndex);
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

class Participant extends Component {
  render() {
    const {connectDragSource, connectDropTarget, isDragging} = this.props;
    let p1 = this.props.player;

    return connectDragSource(connectDropTarget(
      <div className="participant" style={this.props.parStyle}>
        <div className={((p1.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"}>
          { p1.alias || "TBD" }
        </div>
        <div className="score">
          { p1.score || 0 }
        </div>
      </div>
    ));
  }
}

const x = DropTarget('participant', participantTarget, collect)(Participant)
export default DragSource('participant', participantSource, collect2)( x )
