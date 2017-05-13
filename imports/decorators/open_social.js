// Shamelessly copy and paste from SO

function PopupCenter(url, title, w, h) {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
  var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  var top = ((height / 2) - (h / 2)) + dualScreenTop;
  var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus();
  }
}

const openTweet = (text, url) => {
  const tweetText = encodeURI(text.substr(0, 140));
  const tweetLink = encodeURI(url);
  PopupCenter(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetLink}`, "_blank", 500, 300);
}

const openFB = (_, url) => {
  const isDev = Meteor.isDevelopment;
  const fbLink = isDev ? "https://www.brachyon.com/event/world-8-arena-umvc3-pot-bonus" : encodeURI(url);
  const appId = isDev ? 1033113610129174 : 1033113360129199;
  PopupCenter(`https://www.facebook.com/dialog/feed?app_id=1033113610129174&display=popup&link=${fbLink}`, "_blank", 500, 300);
}

export { openTweet, openFB };
