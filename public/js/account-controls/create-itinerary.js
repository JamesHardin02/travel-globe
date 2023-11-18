const submitItinerary = document.getElementById('submit-itinerary');
const nationSelect = document.getElementById('nation-select');
const addSectMenu = document.getElementById("add-sect-menu");
const itinerary = document.getElementById("itinerary");
const stayTemp = document.getElementById("stayTemp").innerHTML;
const tasteTemp = document.getElementById("tasteTemp").innerHTML;
const vibeTemp = document.getElementById("vibeTemp").innerHTML;
const experienceTemp = document.getElementById("experienceTemp").innerHTML;
let tempFunc;

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

  const fileArr = [...itinerary.getElementsByTagName('input')].filter(input => input.getAttribute('type') == 'file');
  const fileExists = (input) => input.files[0] !== undefined;
  const fileValid = fileArr.every(fileExists);

  function postData({ srcArr, title }) {
    const formData = new FormData();
    const tags = Array.from(document.getElementById('tag-check').querySelectorAll('input[type=radio]')).filter(input => input.checked ? input : false);
    
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
      fetch(`${window.location.protocol + "//" + window.location.host}/api/posts/itinerary`,
        {
          method: 'POST',
          body: formData
        }).then((res) => {
          if (res) {
            window.location.reload();
          };
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