function toggleItineraryCreator(e) {
  if(document.querySelector('.itinerary').classList.contains('hide')){
    document.querySelector('.itinerary').classList.remove('hide');
  }else{
    document.querySelector('.itinerary').classList.add('hide');
  };
};

document.getElementById('itinerary-btn').addEventListener('click', toggleItineraryCreator);