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
  // `
  // <div class="card">
  //   <div class="card-header">${title}</div>
  //   <div class="card-body">
  //     <p class="card-text">${content}</p>
  //   </div>
  // </div>
  // `

`
  <div class='post-object'>
    <ul class='posts'>
      <li class='postDate'>{date}</li>
      <li class='postTitle'>
        <a href="/posts/{postId}" class='postTitle'>
          ${title}
        </a>
      </li>
      <li class='postContent'>${content}</li>
    </ul>
    <div class='likesAndComments'>
      <div class='likes'>
        <a href="/posts/{postId}"></a>
          <img class='likeIcon' src="./icons/like-thumbs-up.png" alt="like-icon">
        <div class='likesCount'>{post.commentsCount}</div>
      <div class='comments'>
        <a href="/posts/{postId}"></a>
          <img class='commentIcon' src="./icons/comment.svg.png" alt="comment-icon">
        <div class="commentsCount">{commentsCount}</div>
      </div>
    </div>  
  </div>
  <div class='line-break'></div>
`


  );
  postsContainer.innerHTML = postsHTML.join('');
}



// const getPosts = async () => {
//   const res = await fetch('/likes/', {
//     method: 'GET',
//     headers: {"Content-Type": "application/json"},
//   })
  
//   const {posts} = await res.json();
//   const postsContainer = document.querySelector('.postsContainer');
//   const postsHTML = posts.map(({date, title, postId, content, postId, likesCount, commentsCount}) => 
//   `
//   <div class='post-object'>
//     <ul class='posts'>
//       <li class='postDate'>${date}</li>
//       <li class='postTitle'>
//         <a href="/posts/${postId}" class='postTitle'>
//           ${title}
//         </a>
//       </li>
//       <li class='postContent'>${content}</li>
//     </ul>
//     <div class='likesAndComments'>
//       <div class='comments'>
//         <a href="/posts/${postId}"></a>
//           <img class='commentIcon' src="./iconts/comment.svg.png" alt="logo">
//         <div class="commentsCount">${commentsCount}</div>
//       </div>
//     </div>  
//   </div>
//   <div class='line-break'></div>
//   `
//   );
//   postsContainer.innerHTML = postsHTML.join('');
// }


document.addEventListener("DOMContentLoaded", async () => {
  console.log('debugger')
  try {
    // await fetchTweets();
    await getPosts();
  } catch (e) {
    console.error(e);
  }
});

