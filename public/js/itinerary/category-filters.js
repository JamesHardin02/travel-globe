document.querySelector('.category-nav').addEventListener('click', (e) => {
  function filterItineraries(category) {
    const allItineraries = [...document.querySelector('.itinerary-feed-ol').querySelectorAll('li')]
    const filteredArr = [...document.querySelector('.itinerary-feed-ol').querySelectorAll('li')].filter(li => li.getAttribute('data-cat') == category);
    const h2 = document.querySelector('#itinerary-feed-h2')
    if (category == "all itineraries") {
      h2.textContent = "All Itineraries"
      allItineraries.forEach(iti => !iti.getAttribute('data-none') ? iti.style.display = "block" : iti.style.display = "none");
    } else if (filteredArr.length == 0) {
      h2.textContent = "Become A Voyager!"
      allItineraries.forEach(iti => {
        if(iti.getAttribute('data-none')){
          iti.style.display = "block"
        } else{
          iti.style.display = "none"
        };
      });
    } else {
      h2.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      allItineraries.forEach(iti => iti.style.display = "none");
      filteredArr.forEach(iti => iti.style.display = "block");
    }
  }

  if ([...e.target.parentElement.classList].indexOf("cat-a") > -1) {
    filterItineraries(e.target.innerText.toLowerCase());
  };
});

const li = document.createElement('li');
li.classList.add("itinerary-li")
li.style.display = 'none'
li.innerHTML = `
<a href="/login-signup">
<figure class="gallery-figure itinerary-figure no-itinerary-figure" >
  <h2 class="gallery-h2" >
    This country doesn't have an itinerary of this type yet,<br/><br/>
    Become a Voyager and Create One!
  </h2>
  <img style="background-color:lightgrey;" src="/public/img/homepage/orange.webp" class="img-responsive" alt="Vacation picture">
</figure>
</a>
`
li.setAttribute('data-none', true);
document.querySelector('.itinerary-feed-ol').appendChild(li);

const catTags = [...document.querySelectorAll('.cat-tags')];

for(i=0; i<catTags.length; i++){
  console.log(catTags[i].innerText)
  switch(catTags[i].textContent){
    case "stay":
      catTags[i].style.backgroundColor = "blue"
      break;
    case "taste":
      catTags[i].style.backgroundColor = "#c4c414"
      break;
    case "vibe":
      catTags[i].style.backgroundColor = "purple"
      break;
    case "experience":
      catTags[i].style.backgroundColor = "green"
      break;

    default:
      catTags[i].style.backgroundColor = "orange"
  }
}