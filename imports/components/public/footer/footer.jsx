import React from 'react';
import FontAwesome from 'react-fontawesome';
import Headroom from 'react-headroom';
import { Link } from 'react-router';

import SnapModal from './snap_modal.jsx';

export default class Footer extends React.Component {

  constructor() {
    super();
    this.state = {
      useDefaultHeader: window.location.pathname.indexOf("preview") >= 0 ? false : true,
      useSmall: window.innerWidth <= 740,
      cb: () => {
        if(window.innerWidth <= 740 && !this.state.useSmall) {
          this.setState({
            useSmall: true
          })
        }
        else if(window.innerWidth > 740 && this.state.useSmall) {
          this.setState({
            useSmall: false
          })
        }
      }
    }
    window.addEventListener("resize", this.state.cb);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.state.cb);
  }

  socialLinks() {
    return (
      <div className="col-1 row x-center justify-start footer-social" style={{margin: '0 0 0 10px'}}>
        <a href="https://www.twitch.tv/brachyon" target="_blank">
        <div className="social-icon-bg col x-center center" onHover>
          <FontAwesome name="twitch" className="twitch" />
        </div></a>
        <div className="footer-plugin-pad"></div>
        <a href="https://www.youtube.com/channel/UCUrPEefFomt33g048J3nmcg" target="_blank">
        <div className="social-icon-bg col x-center center">
          <FontAwesome name="youtube-play" className="youtube social-icon" />
        </div></a>
        <div className="footer-plugin-pad"></div>
        <a href="https://www.reddit.com/r/brachyon" target="_blank">
        <div className="social-icon-bg col x-center center">
          <FontAwesome name="reddit-alien" className="reddit social-icon" />
        </div></a>
        <div className="footer-plugin-pad"></div>
        <a href="https://www.facebook.com/BrachyonInc/" target="_blank">
        <div className="social-icon-bg col x-center center">
          <FontAwesome name="facebook " className="facebook social-icon" />
        </div></a>
        <div className="footer-plugin-pad"></div>
        <SnapModal />
        <div className="footer-plugin-pad"></div>
        <a href="https://twitter.com/brachyon" target="_blank">
        <div className="social-icon-bg col x-center center">
          <FontAwesome name="twitter" className="twitter social-icon" />
        </div></a>
        <div className="footer-plugin-pad"></div>
        <a href="https://www.instagram.com/brachyon/" target="_blank">
        <div className="social-icon-bg col x-center center">
          <FontAwesome name="instagram" className="instagram social-icon" />
        </div></a>
      </div>
    )
  }

  render() {
    return(
      <Headroom id="footer" disableInlineStyles={true} downTolerance={"calc(100vh - 50px)"}>
        <div className="row footer x-center center">
          { this.socialLinks() }
          <div className="col-1">
            <div className="row footer-hub" style={{margin: '0 10px 0 0'}}>
              <Link to="/about"><div className="footer-hub-bg col x-center center">About</div></Link>
              {/*<Link to="/advertise" className="footer-hub-pad col x-center">Advertise</Link>*/}
              <Link to="/terms"><div className="footer-hub-bg col x-center center">Terms</div></Link>
              <Link to="/privacy"><div className="footer-hub-bg col x-center center">Privacy</div></Link>
              {/*<a href="#" className="footer-hub-pad col x-center">Privacy</a>*/}
              <div className="footer-hub-bg col x-center center">&copy; Brachyon 2016</div>
            </div>
          </div>
        </div>
      </Headroom>
    );
  }
}
