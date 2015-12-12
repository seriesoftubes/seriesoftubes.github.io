(function(global) {

var blog = document.getElementById('blog');
var intro = document.getElementById('intro');
var blogIcon = document.getElementById('wordpress-icon');
var blogIconImage = blogIcon.children[0];
var blogIsShowing = false;

var toggleBlog = function(evt) {
  evt.preventDefault();

  if (blogIsShowing) {
    blog.classList.remove('active');
    blogIconImage.classList.remove('pressed');
    intro.classList.add('active');
  } else {
    blog.classList.add('active');
    blogIconImage.classList.add('pressed');
    intro.classList.remove('active');
  }

  blogIsShowing = !blogIsShowing;
};

blogIcon.addEventListener('click', toggleBlog);

})(window);
