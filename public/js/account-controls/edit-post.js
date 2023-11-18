const cityInput = document.getElementById("cityInput");
const catSelect = document.getElementById("catSelect");
const thumbInput = document.getElementById("thumbnail");
const titleInput = document.getElementById("titleInput");
const itinerarySelect = document.getElementById("itinerary-select");
const id = window.location.toString().split('/')[
  window.location.toString().split('/').length - 1
];
const route = `${window.location.protocol + "//" + window.location.host}/api/posts/${id}`
let getHtml;

const editor = new FroalaEditor('#example', {
  saveInterval: 0,
}, function () {
  getHtml = () => editor.html.get()
});

function insertHTML() {
  FroalaEditor.DefineIcon('insertHTML', { NAME: 'plus', SVG_KEY: 'add' });
  FroalaEditor.RegisterCommand('insertHTML', {
    title: 'Insert HTML',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback: async function () {
      const post = await fetch(route).then(response => response.json()).then(data => data);
      editor.html.insert(post.content);
      cityInput.value = post.city;
      titleInput.value = post.title;
      catSelect.selectedIndex = post.category_id - 1;
      // thumbInput.files[0] =
      editor.undo.saveStep();
    }
  })
};
insertHTML();
editor.o_win.FroalaEditor.COMMANDS.insertHTML.callback();

async function blobTobase64(imgSrc) {
  try {
    function convertBlob(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.readAsDataURL(blob)
        reader.onloadend = function () {
          resolve(reader.result);
        }
      });
    }
    const response = await fetch(imgSrc).then(response => response.blob())
    return await convertBlob(response);
  } catch (err) {
    console.log(`could not convert blob to 64 ${err}`);
  };
};

async function saveBlog() {
  const city = cityInput.value;
  const category = catSelect.options[catSelect.selectedIndex].text;
  const thumbnail = thumbInput.files[0];
  const title = titleInput.value;
  const srcArr = [];
  const imageDoc = this.FroalaEditor.INSTANCES[0]['$doc'][0].images;
  const html = getHtml();
  for (const key1 in imageDoc) {
    for (const key2 in imageDoc[key1].classList) {
      if (typeof imageDoc[key1].classList[key2] == 'string' &&
        imageDoc[key1].classList[key2].includes("fr-fic") &&
        imageDoc[key1].classList[key2].includes("fr-draggable")
      ) {
        const imgSrc = imageDoc[key1].currentSrc;
        const base64data = await blobTobase64(imgSrc);
        const imgData = { src: imgSrc, base64: base64data };
        srcArr.push(imgData);
      };
    };
  };
  const formData = new FormData();
  const blogBody = {
    category_id: category,
    city: city,
    imgData: JSON.stringify(srcArr),
    title: title,
    content: html,
    thumbnail: thumbnail
  };
  Object.keys(blogBody).forEach(key => formData.append(key, blogBody[key]));
  setTimeout(() => {
    fetch(route,
      {
        method: 'PUT',
        body: formData
      }).then((res)=>{
        if(res){
          window.location.assign(`${window.location.protocol + "//" + window.location.host}/dashboard`);
        }
      });
  }, 1000);
};

document.getElementById('saveButton').addEventListener("click", (e) => {
  e.preventDefault();
  cityValid = cityInput.value;
  thumbValid = thumbInput.value;
  titleValid = titleInput.value;
  itineraryValid = itinerarySelect[itinerarySelect.selectedIndex].getAttribute('data-id');
  categoryValid = catSelect[catSelect.selectedIndex].text == 'Blog limit reached'? false : true;
  console.log(categoryValid)
  if (cityValid && thumbValid && titleValid && categoryValid && itineraryValid !== 'no-data' && getHtml().length > 0) {
    $('document').ready(() => {
      saveBlog()
    })
  };
});