import React from 'react';
import FontAwesome from 'react-fontawesome';
import Headroom from 'react-headroom';

import SnapModal from './snap_modal.jsx';

export default class Footer extends React.Component {
  render() {
    return(
      <Headroom
        style = {{
          bottom: 0,
          top: '100%',
        }}>
        <div className="row footer x-center center">
          <div className="col-1"></div>
          <div className="row center x-center">
            <a href="https://www.twitch.tv/brachyon" target="_blank"><FontAwesome name="twitch" className="twitch" /></a>
            <div className="footer-div"></div>
            <a href="https://www.youtube.com/channel/UCUrPEefFomt33g048J3nmcg" target="_blank"><FontAwesome name="youtube-square" className="youtube icon" /></a>
            <div className="footer-div"></div>
            <a href="https://www.reddit.com/r/brachyon" target="_blank"><FontAwesome name="reddit-square" className="reddit icon" /></a>
            <div className="footer-div"></div>
            <FontAwesome name="facebook-square " className="facebook icon" />
            <div className="footer-div"></div>
            <SnapModal />
            <div className="footer-div"></div>
            <a href="https://twitter.com/brachyon" target="_blank"><FontAwesome name="twitter-square" className="twitter icon" /></a>
            <div className="footer-div"></div>
            <a href="https://www.instagram.com/brachyon/" target="_blank"><FontAwesome name="instagram" className="instagram icon" /></a>
          </div>
          <div className="col-1 flex-end" style={{textAlign: 'right'}}>
            <div className="footer-div">&copy; Brachyon 2016</div>
          </div>
        </div>
      </Headroom>
    );
  }
}
