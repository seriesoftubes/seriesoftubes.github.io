(function() {
  var SHOWING = 'showing';

  var blog = document.getElementById('blog');
  var home = document.getElementById('home');

  var blogIsShowing = false;
  var toggleBlogSection = function() {
    if (blogIsShowing) {
      blog.classList.remove(SHOWING);
      home.classList.add(SHOWING);
    } else {
      blog.classList.add(SHOWING);
      home.classList.remove(SHOWING);
    }

    blogIsShowing = !blogIsShowing;
  };
  document.getElementById('link-from-home-to-blog').addEventListener('click', toggleBlogSection);


  var btnBackToPosts = document.getElementById('btn-back-to-post-links');
  var btnBackToHome = document.getElementById('btn-back-to-home');

  var listOfPosts = document.getElementById('blog-post-links');
  var hideListOfPosts = function() { listOfPosts.style.display = 'none' };
  var showListOfPosts = function() { listOfPosts.style.display = 'block' };

  var shownPost = null;
  var hideTheBlogPost = function() { shownPost && shownPost.classList.remove(SHOWING) };
  var showBlogPost = function(postId) {
    shownPost = document.getElementById(postId);
    shownPost.classList.add(SHOWING);
    hideListOfPosts();
    btnBackToPosts.classList.add(SHOWING);
  };

  var backToPosts = function() {
    hideTheBlogPost();
    showListOfPosts();
    btnBackToPosts.classList.remove(SHOWING);
  };
  btnBackToHome.addEventListener('click', function() {
    backToPosts();
    toggleBlogSection();
  });
  btnBackToPosts.addEventListener('click', backToPosts);

  // Initialize the blog post links.
  (function() {
    var blogPostLinks = document.getElementsByClassName('blog-post-link');
    for (var i = 0; i < blogPostLinks.length; i++) {
      var link = blogPostLinks[i];
      var postId = link.children[0].id.slice('link-for-'.length);
      link.addEventListener('click', showBlogPost.bind(null, postId));
    }
  })();

})();
