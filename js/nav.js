function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav content") {
      x.className += " responsive";
    } else {
      x.className = "topnav content";
    }
  }

  // Scroll to top button  
  scrollToTopBtn = document.getElementById("scrollToTopBtn");

  window.onscroll = function () {
    scrollListener();
  };

  function scrollListener() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
  }

  function scrollToTop() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Chrome, Firefox, IE and Opera
  }