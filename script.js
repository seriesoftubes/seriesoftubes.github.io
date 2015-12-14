(function() {
  var SHOWING = 'showing';

  var MainController = function(homeView, blogView) {
    this.home_ = homeView;
    this.blog_ = blogView;

    this.blogIsShowing_ = blog.classList.contains(SHOWING);
  };

  MainController.prototype.showBlog = function() {
    this.blog_.classList.add(SHOWING);
    this.home_.classList.remove(SHOWING);
  };

  MainController.prototype.hideBlog = function() {
    this.blog_.classList.remove(SHOWING);
    this.home_.classList.add(SHOWING);
  };


  var BlogController = function(postContainer, listOfPosts, backToPostsButton) {
    this.postContainer_ = postContainer;
    this.listOfPosts_ = listOfPosts;
    this.btnBackToPosts_ = backToPostsButton;

    this.cachedPosts_ = {};
  };

  BlogController.prototype.showTheBlogPost_ = function() {
    this.postContainer_.classList.add(SHOWING);
  };

  BlogController.prototype.hideTheBlogPost_ = function() {
    this.postContainer_.classList.remove(SHOWING);
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

  BlogController.prototype.showListOfPosts_ = function() {
    this.listOfPosts_.style.display = 'block';
  };

  BlogController.prototype.refillPostContainer_ = function(postDomNode) {
    this.postContainer_.innerHTML = '';
    this.postContainer_.appendChild(postDomNode);
  };

  BlogController.prototype.loadBlogPostAsync_ = function(postId) {
    var request = new XMLHttpRequest();
    request.responseType = 'document';
    request.overrideMimeType('text/html; charset=utf-8');
    var self = this;
    request.onload = function() {
      // Assumes that your post has 1 div that contains the whole post.
      self.cachedPosts_[postId] = request.response.body.childNodes[0];
      self.refillPostContainer_(self.cachedPosts_[postId]);
    };
    request.open('GET', '/posts/' + postId + '.html');
    request.send();
  };

  BlogController.prototype.showBlogPost = function(postId) {
    if (postId in this.cachedPosts_) {
      this.refillPostContainer_(this.cachedPosts_[postId]);
    } else  {
      this.loadBlogPostAsync_(postId);
    }

    this.hideListOfPosts_();
    this.showBackToPostsButton_();
    this.showTheBlogPost_();
  };

  BlogController.prototype.goBackToPostsList = function() {
    this.hideTheBlogPost_();
    this.showListOfPosts_();
    this.hideBackToPostsButton_();
  };


  var Router = function(mainCtrl, blogCtrl, blogPostLinkContainers) {
    this.mainCtrl_ = mainCtrl;
    this.blogCtrl_ = blogCtrl;

    var blogPostHashes = {};
    for (var i = 0; i < blogPostLinkContainers.length; i++) {
      var anchor = blogPostLinkContainers[i].children[0];
      blogPostHashes[anchor.getAttribute('href')] = true;
    };
    this.blogPostHashes_ = blogPostHashes;
  };

  Router.prototype.toHomeView_ = function() {
    this.blogCtrl_.goBackToPostsList();
    this.mainCtrl_.hideBlog();
  };

  Router.prototype.toListOfBlogPosts_ = function() {
    this.blogCtrl_.goBackToPostsList();
    this.mainCtrl_.showBlog();
  };

  Router.prototype.toBlogPost_ = function(postId) {
    this.mainCtrl_.showBlog();
    this.blogCtrl_.showBlogPost(postId);
  };

  Router.prototype.syncShownViewWithUrlHash = function() {
    var urlHash = window.location.hash;

    if (urlHash in {'#': 1, '/': 1, '': 1, '#/': 1}) {
      this.toHomeView_();
    } else if (urlHash === '#/posts') {
      this.toListOfBlogPosts_();
    } else if (this.blogPostHashes_[urlHash]) {
      this.toBlogPost_(urlHash.slice('#/posts/'.length));
    } else {
      this.toHomeView_();
    }
  };


  (function() {
    var mainCtrl = new MainController(
        document.getElementById('home'),
        document.getElementById('blog')
    );

    var blogCtrl = new BlogController(
        document.getElementById('blog-post'),
        document.getElementById('blog-post-links'),
        document.getElementById('btn-back-to-post-links')
    );

    var router = new Router(
        mainCtrl,
        blogCtrl,
        document.getElementsByClassName('blog-post-link')
    );

    router.syncShownViewWithUrlHash();
    window.addEventListener('hashchange', router.syncShownViewWithUrlHash.bind(router));
  })();
})();
