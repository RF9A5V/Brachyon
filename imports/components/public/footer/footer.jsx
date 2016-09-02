import React from 'react';
import FontAwesome from 'react-fontawesome';
import Headroom from 'react-headroom';
import { Link } from 'react-router';

import SnapModal from './snap_modal.jsx';

export default class Footer extends React.Component {
  render() {
    return(
      <Headroom id="footer" disableInlineStyles={true}>
        <div className="row col-2 footer x-center center">
          <div className="col-1 row x-center justify-start" style={{margin: '0 0 0 10px'}}>
            <a href="https://www.twitch.tv/brachyon" target="_blank">
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="twitch" className="twitch" />
            </div></a>
            <div className="footer-plugin-pad"></div>
            <a href="https://www.youtube.com/channel/UCUrPEefFomt33g048J3nmcg" target="_blank">
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="youtube" className="youtube social-icon" />
            </div></a>
            <div className="footer-plugin-pad"></div>
            <a href="https://www.reddit.com/r/brachyon" target="_blank">
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="reddit-alien" className="reddit social-icon" />
            </div></a>
            <div className="footer-plugin-pad"></div>
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="facebook " className="facebook social-icon" />
            </div>
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
          <div className="col-1">
            <div className="row justify-end" style={{margin: '0 10px 0 0'}}>
                <Link to="/advertise" className="footer-hub-pad col x-center">Advertise</Link>
                <Link to="/terms" className="footer-hub-pad col x-center">Terms</Link>
                <div className="footer-hub-pad col x-center">Privacy</div>
                <div className="footer-hub-pad col x-center">&copy; Brachyon 2016</div>
            </div>
          </div>
        </div>
      </Headroom>
    );
  }
}
