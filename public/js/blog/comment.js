async function commentFormHandler(event) {
  event.preventDefault();

  let comment_text = document.getElementById('comment-text').value.trim();
  // gets post_id by last index in url
  const post_id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  // will add comment if text is provided
  if (comment_text) {
    const formData = new FormData();
    const blogBody = {
      post_id: post_id,
      comment_text: comment_text
    };
    Object.keys(blogBody).forEach(key => formData.append(key, blogBody[key]));

    const response = await fetch(`/api/comments/`, {
      method: 'POST',
      body: formData
    });

    comment_text = false;
    // refreshes page
    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
}

document.getElementById("addComment").addEventListener('click', commentFormHandler);