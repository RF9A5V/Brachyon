import React from 'react';
import FontAwesome from 'react-fontawesome';
import Headroom from 'react-headroom';
import { Link } from 'react-router';

import SnapModal from './snap_modal.jsx';
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class Footer extends ResponsiveComponent {

  constructor() {
    super();
    this.state = {};
  }

  socialLinks() {
    return (
      <div className="col-1 row x-center justify-start footer-social" style={{margin: '0 0 0 10px'}}>
        <a href="https://www.twitch.tv/brachyon" target="_blank">
        <div className="social-icon-bg col x-center center">
          <FontAwesome name="twitch" className="twitch" />
        </div></a>
        <div className="footer-plugin-pad"></div>
        <a href="https://www.youtube.com/channel/UCUrPEefFomt33g048J3nmcg" target="_blank">
        <div className="social-icon-bg col x-center center">
          <FontAwesome name="youtube-play" className="youtube social-icon" />
        </div></a>
        <div className="footer-plugin-pad"></div>
        {/*<a href="https://www.reddit.com/r/brachyon" target="_blank">
                <div className="social-icon-bg col x-center center">
                  <FontAwesome name="reddit-alien" className="reddit social-icon" />
                </div></a>*/}
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

  renderBase(opts) {
    return(
      <Headroom id="footer" disableInlineStyles={true} downTolerance={document.body.clientHeight - 50}>
        <div className="row footer x-center center" style={{height: opts.height}}>
          { opts.useSocial ? this.socialLinks() : null }
          <div className="col-1">
            <div className="row" style={{margin: '0 10px 0 0', justifyContent: opts.justify}}>
              <Link to="/about"><div className="footer-hub-bg col x-center center" style={{fontSize: opts.fontSize}}>About</div></Link>
              {/*<Link to="/advertise" className="footer-hub-pad col x-center">Advertise</Link>*/}
              <Link to="/terms"><div className="footer-hub-bg col x-center center" style={{fontSize: opts.fontSize}}>Terms</div></Link>
              <Link to="/privacy"><div className="footer-hub-bg col x-center center" style={{fontSize: opts.fontSize}}>Privacy</div></Link>
              {/*<a href="#" className="footer-hub-pad col x-center">Privacy</a>*/}
              <div className="footer-hub-bg col x-center center" style={{cursor: "default", backgroundColor: "transparent", color: "white", fontSize: opts.fontSize}}>&copy; Brachyon 2017</div>
            </div>
          </div>
        </div>
      </Headroom>
    );
  }

  renderDesktop() {
    return this.renderBase({
      useSocial: true,
      fontSize: "1rem",
      justify: "flex-end",
      height: "50px"
    })
  }

  renderMobile() {
    return this.renderBase({
      useSocial: false,
      fontSize: "3rem",
      justify: "center",
      height: "126px"
    })
  }

}
