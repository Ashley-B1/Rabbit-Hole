const postId = document.querySelector('#postId').value;
let numberOfComments = 0;

export const handleErrors = async (err) => {
  if (err.status >= 400 && err.status < 600) {
    const errorJSON = await err.json();
    const errorsContainer = document.querySelector(".errors-container");
    let errorsHtml = [
      `
        <div class="alert alert-danger">
            Something went wrong. Please try again.
        </div>
      `,
    ];
    const { errors } = errorJSON;
    if (errors && Array.isArray(errors)) {
      errorsHtml = errors.map(
        (message) => `
          <div class="alert alert-danger">
              ${message}
          </div>
        `
      );
    }
    errorsContainer.innerHTML = errorsHtml.join("");
  } else {
    alert(
      "Something went wrong. Please check your internet connection and try again!"
    );
  }
};


const handleDelete = (commentId) => async () => {
  try {
    const res = await fetch(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
    });
    
    if (!res.ok) {
      throw res;
    }
    numberOfComments -= 1;
    document.querySelector(`#comment-${commentId}`).remove();

    const commentsContainer = document.querySelector('.comments-here');
    if(numberOfComments === 0) commentsContainer.innerHTML = 'No comments written yet'

  } catch (err) {
    console.error(err);
  }
};

const fetchComments = async () => {
  const postId = document.querySelector('#postId').value;
  const res = await fetch(`/posts/${postId}/comments/`, {
    method: 'GET',
    headers: {"Content-Type": "application/json"},
  });
  if (res.status === 401) {
    window.location.href = "/";
    return;
  }
  const { comments } = await res.json();

  const commentsContainer = document.querySelector(".comments-here");
  const commentsHtml = [];
  
  for(const comment of comments) {
    const {users, content, id} = comment;
    numberOfComments += 1;

    commentsHtml.push(
      `
      <div id=comment-${id} class='comment-content'>
        <ul class='comment-details'>
          <li class='postId'>${postId}</li>
          <li class='username'>${users.userName}</li>
          <li id=comment-content-${id} class='comment'> ${content}</li>
          <li id=edit-${id} class='edit-comment'></li>
            <a href="/posts/${postId}/comments/${id}/edit">Edit</a>
          <li id=${id} class='delete-comment'>Delete</li>
        </ul>    
      </div>
      `
    );
  };
    
  commentsContainer.innerHTML = commentsHtml.join(""); 
};

document.addEventListener("DOMContentLoaded", async () => {
  const commentsContainer = document.querySelector('.comments-here');
  try {
    await fetchComments();

    const deleteButtons = document.querySelectorAll('.delete-comment');
    if(deleteButtons){
      deleteButtons.forEach(button => {
        button.addEventListener('click', handleDelete(button.id));
      });
    };
    
    if(numberOfComments === 0) commentsContainer.innerHTML = 'No comments written yet'

  } catch (e) {
    console.error(e);
    handleErrors(e);
  }
});


const form = document.querySelector('.comment-form');
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const content = formData.get('content');

  const body = { content };
  try {
    const res = await fetch(`/posts/${postId}/comments/`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"},
    });
    if (res.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!res.ok) {
      throw res;
    }
    form.reset();
    await fetchComments();

    const deleteButtons = document.querySelectorAll('.delete-comment');
    if(deleteButtons){
      deleteButtons.forEach(button => {
      button.addEventListener('click', handleDelete(button.id));
      });
    }

  } catch (err) {
    handleErrors(err);
  }
});

