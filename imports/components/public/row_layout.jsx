import React, { Component } from "react";

export default class RowLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itemLength: 0,
      items: [],
      itemCount: props.children.length
    }
  }

  setContent(length, items) {
    var elements = items;
    var remainder = elements.length % length;
    for(var i = 0; i < length - remainder; i ++) {
      elements.push(null);
    }
    var data = [];
    for(var i = 0; i < elements.length; i += length) {
      data.push(elements.slice(i, i + length));
    }
    this.setState({
      itemLength: length,
      items: data
    });
  }

  componentWillMount() {
    this.setContent(this.props.length || 1, this.props.children);
  }

  componentWillReceiveProps(next) {
    this.setContent(next.length || 1, next.children);
  }

  render() {
    return (
      <div className="col">
        {
          this.state.items.map((i, iIn) => {
            return (
              <div className="row" style={{marginBottom: iIn < this.state.items.length - 1 ? 10 : 0}}>
                {
                  i.map((j, jIn) => {
                    return (
                      <div className="col-1" style={{marginRight: jIn < i.length - 1 ? 10 : 0}}>
                        { j }
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}
