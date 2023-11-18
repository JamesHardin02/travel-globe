const catNav = document.querySelector('.category-nav');
const url = window.location.href
const id = url.split('/')[url.split('/').length - 1];
function categoryNav(e) {
  switch (e.target.textContent) {
    case "Stay":
      window.location.assign(window.location.href.replace(/\/\d/, '/1'));
      break;
    case "Taste":
      window.location.assign(window.location.href.replace(/\/\d/, '/2'));
      break;
    case "Vibe":
      window.location.assign(window.location.href.replace(/\/\d/, '/3'));
      break;
    case "Experience":
      window.location.assign(window.location.href.replace(/\/\d/, '/4'));
      break;
    default:
      return;
  };
};
catNav.addEventListener('click', categoryNav);