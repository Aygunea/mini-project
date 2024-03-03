document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("go-to-checkout").addEventListener("click", () => {
    window.location.href = "./checkout.html";
  });

  document.getElementById("wishlistIcon").addEventListener("click", () => {
    window.location.href = "/wishlist.html";
  });

  $(document).ready(function () {
    $(".slicknav-menu").click(function () {
      $(".mobile-menu").slideToggle();
    });
  });

  $(document).ready(function () {
    $("#filterBtn").click(function () {
      $("#filterBox").slideToggle();
    });
  });

  $(document).ready(function () {
    $("#searchBtn").click(function () {
      $(".searchBox").slideToggle();
    });
  });

  window.onscroll = function () {
    stickyHeader();
  };

  var header = document.getElementById("header");
  var sticky = header.offsetTop;

  function stickyHeader() {
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  
  $('.slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    centerMode: true,
    focusOnSelect: true,
    vertical: true // Detay fotoğraflarını dikey olarak görüntülemek için
  });
});
