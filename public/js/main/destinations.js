window.addEventListener('click', (e) => {
  if(e.target.hasAttribute('data-href')){
    window.location.assign(e.target.getAttribute('data-href'));
  };
});