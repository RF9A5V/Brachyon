import React from "react";
import Modal from 'react-modal';
import CreditCardForm from '/imports/components/public/credit_card.jsx';
import FontAwesome from 'react-fontawesome';

export default class PaymentModal extends React.Component {

  componentWillMount(){
    this.setState({
      open: this.props.open
    })
  }

  componentWillReceiveProps(next){
    this.setState({
      open: next.open
    })
  }

  closeModal() {
    this.setState({
      open: false
    })
  }

  ccForm() {
    return (
      <CreditCardForm amount={this.props.price} payableTo={this.props.owner} closeHandler={this.closeModal.bind(this)}/>
    )
  }

  ticketPay(){
    return(
      <Modal
        className="create-modal"
        overlayClassName="overlay-class"
        isOpen={this.state.open}
        onRequestClose={this.closeModal.bind(this)}
      >
        <div className="row justify-end">
          <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="3x" className="close-modal"/>
        </div>
        <h1 style={{textAlign: 'center'}}>Ticket Payment</h1>
        {this.ccForm()}
      </Modal>
    );
  }

  cfPay() {
    return (
      <Modal
        className="create-modal"
        overlayClassName="overlay-class"
        isOpen={this.state.open}
        onRequestClose={this.closeModal.bind(this)}
      >
        <div className="row justify-end">
          <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="3x" className="close-modal"/>
        </div>
        <h1 style={{textAlign: 'center'}}>Tier Payment</h1>
        {this.ccForm()}
      </Modal>
    )
  }

  walletPay() {
    return (
      <Modal
        className="create-modal"
        overlayClassName="overlay-class"
        isOpen={this.state.open}
        onRequestClose={this.closeModal.bind(this)}
      >
        <div className="row justify-end">
          <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="3x" className="close-modal"/>
        </div>
        <h1 style={{textAlign: 'center'}}>Add Funds to Your Wallet</h1>
        {this.ccForm()}
      </Modal>
    )
  }

  promotionPayment() {
    return (
      <Modal
        className="create-modal"
        overlayClassName="overlay-class"
        isOpen={this.state.open}
        onRequestClose={this.closeModal.bind(this)}
      >
        <div className="row justify-end">
          <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="3x" className="close-modal"/>
        </div>
        <h1 style={{textAlign: 'center'}}>Promotion Payment</h1>
        {this.ccForm()}
      </Modal>
    )
  }

  render() {
    if(this.props.type == "ticket")
    {
      return(
        <div>
          {
            this.ticketPay()
          }
        </div>
      )
    }
    else if (this.props.type == "tier")
    {
      return(
        <div>
        {
          this.cfPay()
        }
        </div>
      )
    }
    else if (this.props.type == "wallet")
    {
      return(
        <div>
        {
          this.walletPay()
        }
        </div>
      )
    }
    else if (this.props.type == "promotion")
    {
      return(
        <div>
        {
          this.promotionPay()
        }
        </div>
      )
    }
    else
    {
        return (<span> Oops.. </span>)
    }
  }
}
