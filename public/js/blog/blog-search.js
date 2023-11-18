const searchBtn = document.getElementById('city-search');
const input = document.getElementById('city-input');
const form = document.getElementById('city-search-form');

function searchCity(e){
  e.preventDefault(); 
  var validEntry = input.checkValidity();
  input.reportValidity();
  if(validEntry){
    let initCity = input.value.trim();
    //Gets city, caps 1st letter, and puts it in the url
    let cityCap = initCity.toLowerCase();
    let city = cityCap.charAt(0).toUpperCase() + cityCap.slice(1);
    window.location.assign(`/blog/city/${city}/0`);
  };
};

form.addEventListener('submit', searchCity);