// import { handleErrors } from "./utils.js";

// const fetchTweets = async () => {
//   const res = await fetch("http://localhost:8080/tweets", {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem(
//         "TWITTER_LITE_ACCESS_TOKEN"
//       )}`,
//     },
//   });
//   if (res.status === 401) {
//     window.location.href = "/log-in";
//     return;
//   }
//   const { likes } = await res.json(); //* match frontend/routes/tweets.js line 65
//   const likesContainer = document.querySelector(".likesContainer");
//   const tweetsHtml = likes.map(
//     ({ message, user: { username } }) => `
//       <div class="card">
//         <div class="card-header">
//           ${username}
//         </div>
//         <div class="card-body">
//           <p class="card-text">${message}</p>
//         </div>
//       </div>
//     `
//   );
//   tweetsContainer.innerHTML = tweetsHtml.join("");
// };

const getPosts = async () => {
  const res = await fetch('/users/follows', {
    method: 'GET',
    // body: JSON.stringify(body),
    headers: {"Content-Type": "application/json"},
  })

  const {posts} = await res.json();
  const postsContainer = document.querySelector('.postsContainer');
  const postsHTML = posts.map(({title, content}) => 
  `
  <div class="card">
    <div class="card-header">${title}</div>
    <div class="card-body">
      <p class="card-text">${content}</p>
    </div>
  </div>
  `
  );
  postsContainer.innerHTML = postsHTML.join('');
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log('debugger')
  try {
    // await fetchTweets();
    await getPosts();
  } catch (e) {
    console.error(e);
  }
});


// const button = document.querySelector('#likes-icon')
// button.addEventListener('click', async (e) => {
//   e.preventDefault();

//   try {
//     const res = await fetch("http://localhost:8080/tweets", {
//       method: "POST",
//       body: JSON.stringify(body),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }),
//   } catch (err) {
//     console.error(err);
//   }
// }
// )

const res = await fetch('/users/likes', {
  method: 'POST',
  headers: {"Content-Type": "application/json"},
})

const {posts} = await res.json();
const postsContainer = document.querySelector('.postsContainer');
const postsHTML = posts.map(({title, content}) => 
`
<div class="card">
  <div class="card-header">${title}</div>
  <div class="card-body">
    <p class="card-text">${content}</p>
  </div>
</div>
`
);
postsContainer.innerHTML = postsHTML.join('');



// const form = document.querySelector(".create-form");

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const formData = new FormData(form);
//   const message = formData.get("message");
//   const body = { message };
//   try {
//     const res = await fetch("http://localhost:8080/tweets", {
//       method: "POST",
//       body: JSON.stringify(body),
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem(
//           "TWITTER_LITE_ACCESS_TOKEN"
//         )}`,
//       },
//     });
//     if (res.status === 401) {
//       window.location.href = "/log-in";
//       return;
//     }
//     if (!res.ok) {
//       throw res;
//     }
//     form.reset();
//     await fetchTweets();
//   } catch (err) {
//     handleErrors(err);
//   }
// });

