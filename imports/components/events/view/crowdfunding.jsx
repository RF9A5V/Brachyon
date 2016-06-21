import React, { Component } from 'react';

import CFNode from '/imports/components/events/editor_tabs/cf_node.jsx';

export default class CrowdfundingPanel extends Component {

  render() {
    return (
      <div className='row'>
        <div className="col x-center">
          {
            this.props.tiers.map(function(tier){
              return (
                <div className="ticket-bg col" style={{alignItems: 'flex-start'}}>
                  <div className="row">
                    <h2>{tier.name}</h2>
                  </div>
                  <div>
                    {tier.description}
                  </div>
                  <div className="col-1 row" style={{alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch'}}>
                    <span>
                      ${(tier.amount / 100).toFixed(2)}
                    </span>
                    <span>
                      <i>0</i>
                      &nbsp;&nbsp;out of&nbsp;
                      <i>{tier.limit}</i>
                    </span>
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className="col x-center col-1" style={{flexDirection: "column-reverse"}}>
          <CFNode />
          <CFNode />
          <div className="row">
            {
              this.props.branches.map(function(branch){
                if(branch == null){
                  return (
                    <div className="col" style={{flexDirection: "column-reverse"}}>
                    </div>
                  )
                }
                return (

                  <div className="col" style={{flexDirection: "column-reverse"}}>
                    {
                      branch.nodes.map(function(node){
                        return <CFNode icon={branch.icon} />
                      })
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
