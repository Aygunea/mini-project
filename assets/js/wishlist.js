document.addEventListener("DOMContentLoaded", () => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  function DisplayWishList() {
    let wishlistContainer = document.getElementById("wishlistContainer");
    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = "<p>WishList Empty</p>";
      return;
    }
    wishlistContainer.innerHTML = "";
    wishlist.forEach((product, index) => {
      let WishListItem = document.createElement("div");
      WishListItem.classList.add("wishlist-item");
      WishListItem.dataset.id = `${product.id}`;
      WishListItem.innerHTML = `
      <div class="image" >
      <img src=${product.image} alt="">
 </div>
<div class="content">
     <h3 class="title">${product.title}</h3>
    <strong class="price">$${product.price}</strong>
    <p class="text">${product.info}</p>
    <div class="wishlistBtns">
          <div href="#" class="btn btn-primary remove-wishlist">Remove WishList</div>
          <div href="#" class="btn btn-primary addToCartFromWishList">Add To Cart</div>
    </div>
  </div>
                `;

      wishlistContainer.appendChild(WishListItem);
      WishListItem.querySelector(".remove-wishlist").addEventListener(
        "click",
        () => {
          console.log("click");
          removeFromWishlist(product.id);
          DisplayWishList();
        }
      );
    });
  }
  function removeFromWishlist(productID) {
    wishlist = wishlist.filter((product) => product.id !== productID);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    DisplayWishList();
  }
  DisplayWishList();
});
