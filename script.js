(function() {
  var SHOWING = 'showing';
  var POSTS_HASH = '#/posts';
  var HOME_VIEW_HASHES = {'#': 1, '/': 1, '': 1, '#/': 1};


  var MainController = function(homeView, blogView) {
    this.home_ = homeView;
    this.blog_ = blogView;
  };

  MainController.prototype.showBlog = function() {
    this.blog_.classList.add(SHOWING);
    this.home_.classList.remove(SHOWING);
  };

  MainController.prototype.hideBlog = function() {
    this.blog_.classList.remove(SHOWING);
    this.home_.classList.add(SHOWING);
  };


  var BlogController = function(postContainer, listOfPosts, backToPostsButton, spinner) {
    this.postContainer_ = postContainer;
    this.listOfPosts_ = listOfPosts;
    this.btnBackToPosts_ = backToPostsButton;
    this.spinner_ = spinner;

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

  BlogController.prototype.showListOfPosts_ = function() {
    this.listOfPosts_.classList.add(SHOWING);
  };

  BlogController.prototype.hideListOfPosts_ = function() {
    this.listOfPosts_.classList.remove(SHOWING);
  };

  BlogController.prototype.emptyOutPostContainer = function() {
    this.postContainer_.innerHTML = '';
  };

  BlogController.prototype.refillPostContainer_ = function(postDomNode) {
    this.emptyOutPostContainer();
    this.postContainer_.appendChild(postDomNode);
  };

  BlogController.prototype.loadBlogPostAsync_ = function(postId) {
    this.spinner_.style.display = 'block';
    var startedAt = +(new Date());
    var minLoadingMilliseconds = 500;  // Allows animation frames to run.

    var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    request.responseType = 'document';
    request.overrideMimeType('text/html; charset=utf-8');
    request.open('GET', '/posts/' + postId + '.html', true);
    // Ensures that pages are not cached in Google Chrome and Firefox.
    request.setRequestHeader('cache-control', 'no-cache');
    request.setRequestHeader('pragma', 'no-cache');
    request.setRequestHeader('expires', '0');

    var self = this;
    var loadThePost = function() {
      self.spinner_.style.display = 'none';
      // Assumes that your post has 1 div that contains the whole post.
      self.cachedPosts_[postId] = request.response.body.childNodes[0];
      self.refillPostContainer_(self.cachedPosts_[postId]);
    };
    request.onreadystatechange = function() {
      if (request.readyState != XMLHttpRequest.DONE) {
        return;
      }

      if (request.status != 200) {
        self.spinner_.style.display = 'none';
        alert("Sorry, that post couldn't be loaded.");
        window.location.hash = POSTS_HASH;
        return;
      }

      var spentMilliseconds = +(new Date()) - startedAt;
      var remainingMilliseconds = minLoadingMilliseconds - spentMilliseconds;
      if (remainingMilliseconds > 0) {
        setTimeout(loadThePost, remainingMilliseconds);
      } else {
        loadThePost();
      }
    };

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
    this.emptyOutPostContainer();
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
    this.blogCtrl_.emptyOutPostContainer();
    this.mainCtrl_.showBlog();
    this.blogCtrl_.showBlogPost(postId);
  };

  Router.prototype.syncShownViewWithUrlHash = function() {
    var urlHash = (window.location.hash || '').trim();

    if (urlHash in HOME_VIEW_HASHES) {
      this.toHomeView_();
    } else if (urlHash === POSTS_HASH) {
      this.toListOfBlogPosts_();
    } else if (this.blogPostHashes_[urlHash]) {
      this.toBlogPost_(urlHash.slice(POSTS_HASH.length + 1));
    } else {
      // redirect to home view if route unknown.
      window.location.hash = '#';
    }
  };


  var mainCtrl = new MainController(
      document.getElementById('home'),
      document.getElementById('blog')
  );

  var blogCtrl = new BlogController(
      document.getElementById('blog-post'),
      document.getElementById('blog-post-links'),
      document.getElementById('btn-back-to-post-links'),
      document.getElementById('the-loading-spinner')
  );

  var router = new Router(
      mainCtrl,
      blogCtrl,
      document.getElementsByClassName('blog-post-link')
  );

  router.syncShownViewWithUrlHash();
  window.addEventListener('hashchange', router.syncShownViewWithUrlHash.bind(router));
})();
