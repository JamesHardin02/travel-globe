async function deleteFormHandler(event) {
  event.preventDefault();

  // gets post_id by last index in url
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  });

  // user taken back to dashboard to see that their post is deleted
  if (response.ok) {
    window.location.assign(`${window.location.protocol + "//" + window.location.host}/dashboard`);
  } else {
    alert(response.statusText);
  }
}

document.getElementById('delete-button').addEventListener('click', deleteFormHandler);