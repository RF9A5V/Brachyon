import React, { Component } from 'react';
import Modal from 'react-modal';
import CreditCardForm from '/imports/components/public/credit_card.jsx';

export default class TicketPanel extends Component {
  constructor () {
    super();
    this.state = {
      open: false,
    }
  }

  openModal(){
    this.setState({open: true});
  }

  closeModal(){
    this.setState({open: false});
  }

  creditCardModal(ticket){
    return(
      <Modal
        className = "cred-modal"
        overlayClassName = "cred-overlay"
        isOpen={this.state.open}>
        <div className="div-pad">
          <div className="close" onClick={this.closeModal.bind(this)}>&#10006;</div>
        </div>
        <h1 style={{textAlign: 'center'}}>Payment</h1>
        <CreditCardForm amount={ticket.amount} payableTo={ticket.payableTo}/>
      </Modal>
    );
  }


  render() {
    console.log(this.props);
    return (
      <div className="row">
        {
          this.props.tickets.map((function(ticket){
            return (
              <div>
                <div className="ticket-bg col" style={{alignItems: 'flex-start'}} onClick={this.openModal.bind(this)}>
                  <div className="row">
                    <h2>{ticket.name}</h2>
                  </div>
                  <div>
                    {ticket.description}
                  </div>
                  <div className="col-1 row" style={{alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch'}}>
                    <span>
                      ${(ticket.amount / 100).toFixed(2)}
                    </span>
                    <span>
                      <i>0</i>
                      &nbsp;&nbsp;out of&nbsp;
                      <i>{ticket.limit}</i>
                    </span>
                  </div>
                </div>
                {this.creditCardModal(ticket)}
              </div>
            );
          }).bind(this))
        }
      </div>
    );
  }
}
