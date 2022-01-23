const { Json } = require("sequelize/types/lib/utils");

const deleteCommentForm = document.querySelector(".delete-comment-form")

deleteCommentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(deleteCommentForm);
  const content = formData.get(content);

  const body = { content };

  try {
    //not sure about the fetch url
    const res = await fetch(`http://localhost:8080/${postId}/comments/`, {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw res;
    }

    window.location.href = `/posts/${postId}`
  } catch (err) {

  }
})
