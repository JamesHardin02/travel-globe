const itinerary = document.getElementById('itinerary');
const submitItinerary = document.getElementById('submit-itinerary');
const addSectMenu = document.getElementById("add-sect-menu");
const id = window.location.toString().split('/')[
  window.location.toString().split('/').length - 1
];
const nationSelect = document.getElementById('nation-select')
const tags = Array.from(document.getElementById('tag-check').querySelectorAll('input[type=radio]')).filter(input => input.checked ? input : false);

const stayTemp = document.getElementById("stayTemp").innerHTML;
const tasteTemp = document.getElementById("tasteTemp").innerHTML;
const vibeTemp = document.getElementById("vibeTemp").innerHTML;
const experienceTemp = document.getElementById("experienceTemp").innerHTML;
let tempFunc;

async function getItinerary() {
  const itineraryData = await fetch(`${window.location.protocol + "//" + window.location.host}/api/posts/itinerary/${id}`)
    .then(res => res.json());

  const countries = [...nationSelect.children]
  for(i=0; i< countries.length; i++){
    if(countries[i].getAttribute("data-nation") == itineraryData.nation_A3){
      nationSelect.selectedIndex = i;
    };
  };
  
  const categories =[...document.querySelectorAll('input[type=radio]')];
  categories.forEach(radio => {
    if(radio.value == itineraryData.category){
      radio.checked = true;
    }else{
      radio.checked = false;
    };
  });

  const div = document.createElement('div');
  div.innerHTML = itineraryData.content;

  const categorySectionArr = [...div.querySelectorAll('.category-section')]
  for (i = 0; i < categorySectionArr.length; i++) {
    const category = [...categorySectionArr[i].querySelectorAll('h2')][0].textContent.trim();
    switch (category) {
      case "STAY":
        tempFunc = Handlebars.compile(stayTemp);
        itinerary.insertAdjacentHTML("beforeend", tempFunc());
        break;
      case "TASTE":
        tempFunc = Handlebars.compile(tasteTemp);
        itinerary.insertAdjacentHTML("beforeend", tempFunc());
        break;
      case "VIBE":
        tempFunc = Handlebars.compile(vibeTemp);
        itinerary.insertAdjacentHTML("beforeend", tempFunc());
        break;
      case "EXPERIENCE":
        tempFunc = Handlebars.compile(experienceTemp);
        itinerary.insertAdjacentHTML("beforeend", tempFunc());
        break;
      default:
        return;
    };
  };
  const destinationH2Arr = [...div.querySelectorAll('.destination-h2')];
  const destinationInputArr = [...document.querySelectorAll('.destination')];

  if (destinationH2Arr.length > 0) {
    for (i = 0; i < destinationH2Arr.length; i++) {
      destinationInputArr[i].value = destinationH2Arr[i].textContent;
    };
  };

  const pElArr = [...div.querySelectorAll('.ptag')];
  const taArr = [...document.querySelectorAll('.textarea-itinerary')];

  document.getElementById("itinerary-title-input").value = div.querySelector('#title-itinerary').textContent;
  document.getElementById("introduction").value = pElArr[0].textContent;

  for (i = 0; i < taArr.length; i++) {
    const pContent = pElArr[i + 1].textContent;
    taArr[i].value = pContent;
  };

  const catFileUploadInputs = [...document.querySelectorAll('.image-input')].filter(input => input.id !== "thumbnail-itinerary");
  const figureArr = [...document.querySelectorAll('.cat-figure')];
  const imgArr = [...div.querySelectorAll('img')];

  document.getElementById('blurb').value = itineraryData.blurb;

  for (i = 0; i < figureArr.length; i++) {
    if (imgArr[i]) {
      figureArr[i].appendChild(imgArr[i]);
      catFileUploadInputs[i].required = false;
    }
  }

  $(".image-input").change(function (e) {
    e.stopImmediatePropagation();
    e.target.parentElement.childNodes.forEach(el => {
      if (el.tagName == "FIGURE") {
        while (el.firstChild) {
          el.firstChild.remove();
        };
        var file = e.target.files[0];
        var img = document.createElement("img");
        img.classList.add("img-responsive");
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          img.setAttribute('src', reader.result);
          el.appendChild(img);
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      };
    });
  });

  $(".delete-section-btn").click(function (e) {
    e.stopImmediatePropagation();
    e.target.parentElement.parentElement.remove();
  });
};
getItinerary();

function addSection(e) {
  if (e.target.tagName == "BUTTON") {
    const selectedCat = e.target.textContent.trim();
    switch (selectedCat) {
      case "Stay":
        tempFunc = Handlebars.compile(stayTemp);
        itinerary.insertAdjacentHTML("beforeend", tempFunc());
        break;
      case "Taste":
        tempFunc = Handlebars.compile(tasteTemp);
        itinerary.insertAdjacentHTML("beforeend", tempFunc());
        break;
      case "Vibe":
        tempFunc = Handlebars.compile(vibeTemp);
        itinerary.insertAdjacentHTML("beforeend", tempFunc());
        break;
      case "Experience":
        tempFunc = Handlebars.compile(experienceTemp);
        itinerary.insertAdjacentHTML("beforeend", tempFunc());
        break;
      default:
        return;
    };

    $(".image-input").change(function (e) {
      e.stopImmediatePropagation();
      e.target.parentElement.childNodes.forEach(el => {
        if (el.tagName == "FIGURE") {
          while (el.firstChild) {
            el.firstChild.remove();
          };
          var file = e.target.files[0];
          var img = document.createElement("img");
          img.classList.add("img-responsive");
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            img.setAttribute('src', reader.result);
            el.appendChild(img);
          };
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };
        };
      });
    });

    $(".delete-section-btn").click(function (e) {
      e.stopImmediatePropagation();
      e.target.parentElement.parentElement.remove();
    });
  };
};
addSectMenu.addEventListener('click', addSection);

function createItinerary(e) {
  e.preventDefault();
  const thumbnailEl = document.getElementById('thumbnail-itinerary');

  const textAreaArr = [...document.querySelectorAll('textarea')].filter(ta => ta.id !== 'example' && ta.id !== 'blurb');
  const notNull = (ta) => ta.value.match(/\w+/) !== null;
  const taValid = textAreaArr.every(notNull);

  const textInputArr = [...itinerary.getElementsByTagName('input')].filter(input => input.getAttribute('type') == 'text');
  const textExists = (input) => input.checkValidity();
  const textInputValid = textInputArr.every(textExists);

  const fileArr = [...itinerary.querySelectorAll('input[type="file"]')].filter(input => input.required == true);
  const fileExists = (input) => input.files[0] !== undefined;
  const fileValid = fileArr.every(fileExists);

  function postData({ srcArr, title }) {
    const formData = new FormData();
    const blogBody = {
      title: title,
      blurb: document.getElementById('blurb').value,
      nation_A3: nationSelect.options[nationSelect.selectedIndex].getAttribute("data-nation"),
      nation_name: nationSelect.options[nationSelect.selectedIndex].innerText,
      category: tags[0].getAttribute('value'),
      itinerary: itinerary.innerHTML,
      srcArr: JSON.stringify(srcArr),
      thumbnail: thumbnailEl.files[0]
    };
    Object.keys(blogBody).forEach(key => formData.append(key, blogBody[key]));
    setTimeout(() => {
      fetch(`${window.location.protocol + "//" + window.location.host}/api/posts/itinerary/${id}`,
        {
          method: 'PUT',
          body: formData
        }).then((res) => {
          if (res) {
            window.location.assign(`${window.location.protocol + "//" + window.location.host}/dashboard/itinerary`);
          }
        })
    }, 1000);
  };

  function formatItinerary() {
    const h2Arr = [...itinerary.querySelectorAll('.guider')];
    h2Arr.forEach(h2 => {
      h2.remove();
    });
    const deleteBtnArr = [...itinerary.querySelectorAll('.edit-buttons')];
    deleteBtnArr.forEach(btnParent => {
      btnParent.remove();
    });

    const h2 = document.createElement('h2');
    const title = document.getElementById('itinerary-title');
    const titleInput = document.getElementById('itinerary-title-input');
    h2.textContent = titleInput.value;
    h2.id = 'title-itinerary'
    title.replaceWith(h2);
    titleInput.remove();

    let count = 0;
    textAreaArr.forEach((ta) => {
      count++
      const p = document.createElement('p');
      p.classList.add('text');
      p.textContent = ta.value;
      p.id = count;
      p.classList.add(`ptag`);
      ta.parentElement.replaceChild(p, ta);
    });

    if (document.querySelector('.destination')) {
      const allDestinations = [...document.querySelectorAll('.destination')]
      allDestinations.forEach(input => {
        const h2 = document.createElement('h2');
        h2.style = "margin-top: 8px;";
        h2.classList.add("destination-h2");
        h2.textContent = input.value;
        input.replaceWith(h2);
      })
    };

    const imgArr = [...itinerary.getElementsByTagName('img')];
    let srcArr = [];
    imgArr.forEach(img => {
      srcObj = {
        src: img.src,
        base64: img.src
      };
      srcArr.push(srcObj);
    });
    const inputArr = [...itinerary.getElementsByTagName('input')];
    inputArr.forEach(input => input.remove());
    const data = { srcArr: srcArr, title: h2.textContent }
    postData(data);
  }

  if (textInputValid && taValid && fileValid) {
    formatItinerary();
  } else {
    fileArr.forEach(input => input.reportValidity());
    textAreaArr.forEach((ta) => {
      if (ta.value.match(/\w+/) == null) {
        ta.reportValidity();
      };
    });
    textInputArr.forEach(input => input.reportValidity());
  };
};
submitItinerary.addEventListener('click', createItinerary);

async function deleteItinerary(e) {
  e.preventDefault();
  const response = await fetch(`${window.location.protocol + "//" + window.location.host}/api/posts/itinerary/${id}`, {
    method: 'DELETE'
  })

  // user taken back to dashboard to see that their itinerary is deleted
  if (response.ok) {
    window.location.assign(`${window.location.protocol + "//" + window.location.host}/dashboard/itinerary`);
  } else {
    alert(response.statusText);
  }
}

// document.getElementById('delete-section-btn').addEventListener('click', deleteSection);
document.getElementById('delete-button').addEventListener('click', deleteItinerary);