import React from 'react';
import FontAwesome from 'react-fontawesome';
import Headroom from 'react-headroom';

import SnapModal from './snap_modal.jsx';

export default class Footer extends React.Component {
  render() {
    return(
      <Headroom
        className="footer-room"
      >
        <div className="row footer x-center center">
          <a href="https://www.twitch.tv/brachyon" target="_blank"><FontAwesome name="twitch" className="twitch" /></a>
          <span className="footer-div">.</span>
          <a href="https://www.youtube.com/channel/UCUrPEefFomt33g048J3nmcg" target="_blank"><FontAwesome name="youtube-square" className="youtube icon" /></a>
          <span className="footer-div">.</span>
          <a href="https://www.reddit.com/r/brachyon" target="_blank"><FontAwesome name="reddit-square" className="reddit icon" /></a>
          <span className="footer-div">.</span>
          <FontAwesome name="facebook-square " className="facebook icon" />
          <span className="footer-div">.</span>
          <SnapModal />
          <span className="footer-div">.</span>
          <a href="https://twitter.com/brachyon" target="_blank"><FontAwesome name="twitter-square" className="twitter icon" /></a>
          <span className="footer-div">.</span>
          <a href="https://www.instagram.com/brachyon/" target="_blank"><FontAwesome name="instagram" className="instagram icon" /></a>
        </div>
      </Headroom>
    );
  }
}
