const generateMetaTags = (title, description, image, url) => {
  // FB Tags
  document.querySelector("[property='og:title']").setAttribute("content", title);
  document.querySelector("[property='og:description']").setAttribute("content", description);
  document.querySelector("[property='og:image']").setAttribute("content", image);
  document.querySelector("[property='og:url']").setAttribute("content", url);

  // Twitter Tags
  document.querySelector("[name='twitter:title']").setAttribute("content", title);
  document.querySelector("[name='twitter:description']").setAttribute("content", description);
  document.querySelector("[name='twitter:image']").setAttribute("content", image);
}

const resetMetaTags = () => {
  // FB Tags
  document.querySelector("[property='og:title']").setAttribute("content", "Brachyon");
  document.querySelector("[property='og:description']").setAttribute("content", "Beyond the Brackets");
  document.querySelector("[property='og:image']").setAttribute("content", "/images/card_default.png");
  document.querySelector("[property='og:url']").setAttribute("content", window.location.href);

  // Twitter Tags
  document.querySelector("[name='twitter:title']").setAttribute("content", "Brachyon");
  document.querySelector("[name='twitter:description']").setAttribute("content", "Brachyon - Beyond the Brackets");
  document.querySelector("[name='twitter:image']").setAttribute("content", "/images/card_default.png");
}

export { generateMetaTags, resetMetaTags }
