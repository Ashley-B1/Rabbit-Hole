import { handleErrors } from "./utils.js";

const fetchTweets = async () => {
  const res = await fetch("http://localhost:8080/tweets", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        "TWITTER_LITE_ACCESS_TOKEN"
      )}`,
    },
  });
  if (res.status === 401) {
    window.location.href = "/log-in";
    return;
  }
  const { likes } = await res.json(); //* match frontend/routes/tweets.js line 65
  const likesContainer = document.querySelector(".likesContainer");
  const tweetsHtml = likes.map(
    ({ message, user: { username } }) => `
      <div class="card">
        <div class="card-header">
          ${username}
        </div>
        <div class="card-body">
          <p class="card-text">${message}</p>
        </div>
      </div>
    `
  );
  tweetsContainer.innerHTML = tweetsHtml.join("");
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchTweets();
  } catch (e) {
    console.error(e);
  }
});

const form = document.querySelector(".create-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const message = formData.get("message");
  const body = { message };
  try {
    const res = await fetch("http://localhost:8080/tweets", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(
          "TWITTER_LITE_ACCESS_TOKEN"
        )}`,
      },
    });
    if (res.status === 401) {
      window.location.href = "/log-in";
      return;
    }
    if (!res.ok) {
      throw res;
    }
    form.reset();
    await fetchTweets();
  } catch (err) {
    handleErrors(err);
  }
});




// const likes = document.querySelector(".likes");

// likes.addEventListener('click', e => {
//     console.log('click!')

//     // e.preventDefault();
//     // const formData = new FormData(logInForm);
//     // const email = formData.get("email");
//     // const password = formData.get("password");
//     // const body = { email, password };
//     // try {
//     //   const res = await fetch("http://localhost:8080/users/token", {
//     //     method: "POST",
//     //     body: JSON.stringify(body),
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //   });
//     //   if (!res.ok) {
//     //     throw res;
//     //   }
//     //   const {
//     //     token,
//     //     user: { id },
//     //   } = await res.json();
//     //   // storage access_token in localStorage:
//     //   localStorage.setItem("TWITTER_LITE_ACCESS_TOKEN", token);
//     //   localStorage.setItem("TWITTER_LITE_CURRENT_USER_ID", id);
//     //   // redirect to home page to see all tweets:
//     //   window.location.href = "/";
//     // } catch (err) {
//     //   handleErrors(err);
//     // }
// });
