const facebook = (service) => {
  return service.link;
}

const twitter = (service) => {
  return "https://twitter.com/" + service.screenName;
}

const instagram = (service) => {
  return "https://instagram.com/" + service.username;
}

const twitch = (service) => {
  return "https://twitch.tv/" + service.display_name;
}

export {
  facebook,
  twitter,
  instagram,
  twitch
}
