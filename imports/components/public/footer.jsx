import React from 'react';
import FontAwesome from 'react-fontawesome';
import Headroom from 'react-headroom';

import SnapModal from './snap_modal.jsx';

export default class Footer extends React.Component {
  render() {
    return(
      <Headroom id="footer" disableInlineStyles={true}>
        <div className="row footer x-center center">
          <div className="col-1"></div>
          <div className="row center x-center">
            <a href="https://www.twitch.tv/brachyon" target="_blank">
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="twitch" className="twitch" />
            </div></a>
            <div className="footer-div"></div>
            <a href="https://www.youtube.com/channel/UCUrPEefFomt33g048J3nmcg" target="_blank">
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="youtube-square" className="youtube social-icon" />
            </div></a>
            <div className="footer-div"></div>
            <a href="https://www.reddit.com/r/brachyon" target="_blank">
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="reddit-square" className="reddit social-icon" />
            </div></a>
            <div className="footer-div"></div>
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="facebook-square " className="facebook social-icon" />
            </div>
            <div className="footer-div"></div>
            <SnapModal />
            <div className="footer-div"></div>
            <a href="https://twitter.com/brachyon" target="_blank">
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="twitter-square" className="twitter social-icon" />
            </div></a>
            <div className="footer-div"></div>
            <a href="https://www.instagram.com/brachyon/" target="_blank">
            <div className="social-icon-bg col x-center center">
              <FontAwesome name="instagram" className="instagram social-icon" />
            </div></a>
          </div>
          <div className="col-1 flex-end" style={{textAlign: 'right'}}>
            <div className="footer-div">&copy; Brachyon 2016</div>
          </div>
        </div>
      </Headroom>
    );
  }
}
