(function() {
  var SHOWING = 'showing';

  var MainController = function(homeView, blogView) {
    this.home_ = homeView;
    this.blog_ = blogView;

    this.blogIsShowing_ = blog.classList.contains(SHOWING);
  };

  /** Shows the blog if it's hiding; hides it if it's showing. */
  MainController.prototype.showOrHideBlog = function() {
    if (this.blogIsShowing_) {
      this.blog_.classList.remove(SHOWING);
      this.home_.classList.add(SHOWING);
    } else {
      this.blog_.classList.add(SHOWING);
      this.home_.classList.remove(SHOWING);
    }

    this.blogIsShowing_ = !this.blogIsShowing_;
  };


  var BlogController = function(listOfPosts, backToPostsButton, backToHomeButton) {
    this.listOfPosts_ = listOfPosts;
    this.btnBackToPosts_ = backToPostsButton;
    this.btnBackToHome_ = backToHomeButton;

    this.shownPost_ = null;
  };

  BlogController.prototype.hideTheBlogPost = function() {
    if (this.shownPost_) this.shownPost_.classList.remove(SHOWING);
  };

  BlogController.prototype.showBackToPostsButton_ = function() {
    this.btnBackToPosts_.classList.add(SHOWING);
  };

  BlogController.prototype.hideBackToPostsButton_ = function() {
    this.btnBackToPosts_.classList.remove(SHOWING);
  };

  BlogController.prototype.hideListOfPosts_ = function() {
    this.listOfPosts_.style.display = 'none';
  };

  BlogController.prototype.showListOfPosts = function() {
    this.listOfPosts_.style.display = 'block';
  };

  BlogController.prototype.showBlogPost = function(postId) {
    this.shownPost_ = document.getElementById(postId);
    this.shownPost_.classList.add(SHOWING);

    this.hideListOfPosts_();
    this.showBackToPostsButton_();
  };

  BlogController.prototype.goBackToPostsList = function() {
    this.hideTheBlogPost();
    this.showListOfPosts();
    this.hideBackToPostsButton_();
  };


  (function() {
    var btnBackToHome = document.getElementById('btn-back-to-home');
    var btnBackToPosts = document.getElementById('btn-back-to-post-links');

    var mainCtrl = new MainController(
        document.getElementById('home'),
        document.getElementById('blog')
    );

    var blogCtrl = new BlogController(
        document.getElementById('blog-post-links'),
        btnBackToPosts,
        btnBackToHome
    );

    document.getElementById('link-from-home-to-blog').addEventListener('click', function() {
      mainCtrl.showOrHideBlog();
    });

    btnBackToHome.addEventListener('click', function() {
      blogCtrl.goBackToPostsList();
      mainCtrl.showOrHideBlog();
    });
    btnBackToPosts.addEventListener('click', function() {
      blogCtrl.goBackToPostsList()
    });

    var blogPostLinks = document.getElementsByClassName('blog-post-link');
    for (var i = 0; i < blogPostLinks.length; i++) {
      var link = blogPostLinks[i];
      var postId = link.children[0].id.slice('link-for-'.length);
      link.addEventListener('click', blogCtrl.showBlogPost.bind(blogCtrl, postId));
    }
  })();
})();
