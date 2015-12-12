(function() {

var blog = document.getElementById('blog');
var intro = document.getElementById('intro');
var blogIcon = document.getElementById('wordpress-icon');
var blogIconImage = blogIcon.children[0];

var blogIsShowing = false;

var STATE_ACTIVE = 'active';
var STATE_PRESSED = 'pressed';


var toggleBlog = function(evt) {
  evt.preventDefault();

  if (blogIsShowing) {
    blog.classList.remove(STATE_ACTIVE);
    blogIconImage.classList.remove(STATE_PRESSED);
    intro.classList.add(STATE_ACTIVE);
  } else {
    blog.classList.add(STATE_ACTIVE);
    blogIconImage.classList.add(STATE_PRESSED);
    intro.classList.remove(STATE_ACTIVE);
  }

  blogIsShowing = !blogIsShowing;
};


blogIcon.addEventListener('click', toggleBlog);

})();
