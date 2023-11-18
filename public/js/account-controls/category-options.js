const categorySelectEl = document.getElementById('catSelect');
const itinerarySelectEl = document.getElementById('itinerary-select');
const optionNames = ['Stay', 'Taste', 'Vibe', 'Experience'];
const findEdit = window.location.toString().split('/')[
  window.location.toString().split('/').length - 2
];
const ifEdit = findEdit == 'edit' ? true : false;
const postId = window.location.toString().split('/')[
  window.location.toString().split('/').length - 1
];

function getBlog() {
  return new Promise(async function (resolve, reject) {
    resolve(await fetch(`${window.location.protocol + "//" + window.location.host}/api/posts/${postId}`)
      .then(res => res.json()));
  });
};

async function editorSetUp() {
  const blog = await getBlog();
  const itineraryOptions = [...itinerarySelectEl.querySelectorAll('option')];
  for (i = 0; i < itineraryOptions.length; i++) {
    if (itineraryOptions[i].getAttribute('data-id') == blog.BlogMetaDatum.itinerary_id) {
      itinerarySelectEl.selectedIndex = i
    };
  };
  while (categorySelectEl.firstChild) {
    categorySelectEl.firstChild.remove();
  };
  return blog;
};

async function getPosts(blog) {
  const itinerary = itinerarySelectEl[itinerarySelectEl.selectedIndex].getAttribute('data-id');
  const posts = await fetch(`${window.location.protocol + "//" + window.location.host}/api/posts/user`)
    .then(res => res.json());
  const existingBlogs = posts.map(post => post.BlogMetaDatum.itinerary_id == itinerary ? post : false);
  const checkBlogsExist = existingBlogs.filter(blog => blog !== false);

  if (checkBlogsExist.length == 0) {
    while (categorySelectEl.firstChild) {
      categorySelectEl.firstChild.remove();
    };
    optionNames.forEach(option => {
      const optionEl = document.createElement('option');
      optionEl.classList.add('.cat-option');
      optionEl.textContent = option;
      categorySelectEl.appendChild(optionEl);
    })
  } else {
    const existingCatNames = checkBlogsExist.map(blog => blog.category.category_name);
    const nonExistingOptions = optionNames.filter(name => !existingCatNames.includes(name));
    if (nonExistingOptions.length == 4) {
      while (categorySelectEl.firstChild) {
        categorySelectEl.firstChild.remove();
      };
      const optionEl = document.createElement('option');
      optionEl.classList.add('.cat-option');
      optionEl.textContent = 'Blog limit reached';
      categorySelectEl.appendChild(optionEl);
    } else {
      while (categorySelectEl.firstChild) {
        categorySelectEl.firstChild.remove();
      };
      if (ifEdit && itinerary == blog.BlogMetaDatum.itinerary_id) {
        console.log('current itinerary')
        const currentOptionEl = document.createElement('option');
        currentOptionEl.classList.add('.cat-option');
        currentOptionEl.textContent = blog.category.category_name;
        categorySelectEl.append(currentOptionEl);
      }
      nonExistingOptions.forEach(option => {
        if (option) {
          const optionEl = document.createElement('option');
          optionEl.classList.add('.cat-option');
          optionEl.textContent = option;
          categorySelectEl.appendChild(optionEl);
        };
      });
    };
  };
};
let blog;

async function getResend() {
  if(!ifEdit){
    blog = null;
  }else{
    blog = await getBlog().then(blog => { return blog });
  }
  // wait for response
  if(blog || blog == null){
    getPosts(blog);
  }
};

async function startOptions() {
  if (ifEdit) {
    editorSetUp()
      .then(res => {
        getPosts(res);
      });
    itinerarySelectEl.addEventListener('change', getResend);
  } else {
    getPosts(blog)
    itinerarySelectEl.addEventListener('change', getResend);
  };
};
startOptions();