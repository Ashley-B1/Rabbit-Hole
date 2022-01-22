const getPosts = async () => {
  const res = await fetch('/users/get-posts', {
    method: 'GET',
    // body: JSON.stringify(body),
    headers: {"Content-Type": "application/json"},
  })

  const {posts} = await res.json();
  const postsContainer = document.querySelector('.post-con');
  const postsHTML = posts.map(({date, postId, title, content, likesCount, commentsCount}) => 
`
<div class='card'>
  <div class='post-object'>
    <ul class='posts'>
      <li class='postDate'>${date}</li>
      <li class='postTitle'>
        <a href="/posts/${postId}" class='postTitle'>
          ${title}
        </a>
      </li>
      <li class='postContent'>${content}</li>
    </ul>
    <div class='likesAndComments'>
      <div class='likes'>
        <a href="/posts/${postId}"></a>
          <img class='likeIcon' src="./icons/like-thumbs-up.png" alt="like-icon">
        <div class='likesCount'>${likesCount}</div>
      <div class='comments'>
        <a href="/posts/${postId}"></a>
          <img class='commentIcon' src="./icons/comment.svg.png" alt="comment-icon">
        <div class="commentsCount">${commentsCount}</div>
      </div>
    </div>  
  </div>
  <div class='line-break'></div>
</div>
`
  );
  postsContainer.innerHTML += postsHTML.join('');
}


document.addEventListener("DOMContentLoaded", async () => {
  console.log('debugger')
  try {
    await getPosts();
  } catch (e) {
    console.error(e);
  }
});

