const fbDescriptionParser = (description) => {
  description = description.replace("<br>", "");
  var startIndex = description.indexOf("<p>");
  if(startIndex == -1) {
    return "No description available.";
  }
  var endIndex = description.indexOf("</p>", startIndex);
  var tempDesc = description.substring(startIndex + 3, endIndex);
  if(tempDesc.length > 200) {
    tempDesc = tempDesc.substring(0, 196) + "...";
  }
  return tempDesc;
}

const setHeader = (details) => {
  return (`
    <html>
      <head>
        <meta property="fb:app_id" content="1033113360129199">
        <meta name="twitter:site" content="@brachyon">
        <meta name="og:card" content="summary_large_image">
        <meta property="og:type" content="website">
        <meta property="og:title" content="${details.name}">
        <meta property="og:description" content="${details.parse ? fbDescriptionParser(details.description) : details.description}">
        <meta property="og:image" content="${details.banner ? details.banner : "https://www.brachyon.com/images/card_default.png"}">
        <meta property="og:image:width" content="1280">
        <meta property="og:image:height" content="720">
        <meta property="og:url" content="https://www.brachyon.com${details.path}">
      </head>
      <body></body>
    </html>
  `)
}

export { setHeader }
