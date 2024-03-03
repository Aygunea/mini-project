document.addEventListener("DOMContentLoaded", function () {
  const url = "http://localhost:3000/products";
  let startIndex = 0;
  const itemsPerPage = 6;
  let cardContainer = document.getElementById("card-container");
  const loadMoreBtn = document.getElementById("loadMore");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let basket = JSON.parse(localStorage.getItem("basket")) || [];
  let wishlistContainer = document.querySelector(".wishlistContainer");
  loadMoreBtn.addEventListener("click", () => {
    startIndex += itemsPerPage;
    fetchProducts();
    console.log("load");
  });

  //Filter Price Low to Hight
  document.getElementById("lowToHight").addEventListener("click", () => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => a.price - b.price);
        cardContainer.innerHTML = ``;
        data.forEach((item) => {
          const card = createCard(item);
          cardContainer.appendChild(card);
        });
        loadMoreBtn.style.display = "none";
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  });

  //Filter Price Hight to Low
  document.getElementById("hightToLow").addEventListener("click", () => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => b.price - a.price);
        cardContainer.innerHTML = ``;
        data.forEach((item) => {
          const card = createCard(item);
          cardContainer.appendChild(card);
        });
        loadMoreBtn.style.display = "none";
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  });

  //Filter Default Product
  document.getElementById("defaultOrder").addEventListener("click", () => {
    startIndex = 0;
    cardContainer.innerHTML = ``;
    fetchProducts();
    loadMoreBtn.style.display = "block";
  });
  // Filter Products for Category
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const category = button.dataset.category;
      filterProducts(category);
    });
  });

  function filterProducts(category) {
    const allCards = document.querySelectorAll(".card");
    if (category === "all") {
      allCards.forEach((card) => {
        card.style.display = "block";
      });
    } else {
      allCards.forEach((card) => {
        if (card.dataset.category === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    }
  }

  // Seacrh Product Filter
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    filterBySearchTerm(searchTerm);
  });

  function filterBySearchTerm(searchTerm) {
    const allCards = document.querySelectorAll(".card");
    allCards.forEach((card) => {
      const productName = card
        .querySelector(".card-title")
        .innerText.toLowerCase();
      if (productName.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }
  function fetchProducts() {
    fetch(`${url}?_start=${startIndex}&_limit=${itemsPerPage}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          const card = createCard(item);
          cardContainer.appendChild(card);
        });

        if (data.length < itemsPerPage) {
          loadMoreBtn.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
    displayUpdatedCart();
  }

  function createModal(item, modalId) {
    const customModal = document.createElement("div");
    customModal.id = modalId;
    customModal.classList.add("modal");
    customModal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="modal-left">
          <div class="modal-slider-container">
            <div class="modal-slides">
              <div class="modal-slide" style="background-image:url('${item.image}')">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-right">
          <div class="modal-title">${item.title}</div>
          <div class="modal-price">$${item.price}</div>
          <div class="modal-info">Nulla eget sem vitae eros pharetra viverra. Nam vitae luctus ligula. Mauris consequat ornare feugiat.</div>
          <div class="add-btn">
            <div class="quantityBtns">
              <button id="decreaseBtn">-</button>
              <div class="modal-total-count">1</div>
              <button id="increaseBtn">+</button>
            </div>
            <button class="addToCart btn-blue">Add To Cart</button>
          </div>
          <div class="modal-social-icons">
            <i class="fa-solid fa-heart"></i>
            <i class="fa-brands fa-facebook-f"></i>
            <i class="fa-brands fa-twitter"></i>
            <i class="fa-brands fa-google-plus-g"></i>
          </div>
        </div>
      </div>
    `;

    const countElement = customModal.querySelector(".modal-total-count");
    let count = parseInt(countElement.textContent);

    const increaseBtn = customModal.querySelector("#increaseBtn");
    increaseBtn.addEventListener("click", () => {
      count++;
      countElement.textContent = count;
      localStorage.setItem(`${item.id}_count`, count);
    });

    const decreaseBtn = customModal.querySelector("#decreaseBtn");
    decreaseBtn.addEventListener("click", () => {
      if (count > 0) {
        count--;
        countElement.textContent = count;
        localStorage.setItem(`${item.id}_count`, count);
      }
    });

    const addToCartBtn = customModal.querySelector(".addToCart");
    addToCartBtn.addEventListener("click", () => {
      addToCart(item, count); //modaldan elave etdikde say da verilir
      displayUpdatedCart();
    });

    const closeBtn = customModal.querySelector(".close");
    closeBtn.addEventListener("click", () => {
      customModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target == customModal) {
        customModal.style.display = "none";
      }
    });

    return customModal;
  }

  function createCard(item) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.category = item.category;
    card.dataset.id = item.id;
    card.innerHTML = `
        <div class="card-inner">
          <div class="image-box">
            <div class="card-image" style="background-image:url('${item.image}')">
                <button class="card-modal-btn" data-id="${item.id}">Quick View</button>
            </div>
           </div>
            <div class="card-body">
                <div class="card-title">${item.title}</div>
                <i class="fa-regular fa-heart add-to-wishlist" data-id="${item.id}"></i>
            </div>
            <div class="card-price">$${item.price}</div>
        </div>
    `;

    const addtoWishListButtons = document.querySelectorAll(".add-to-wishlist");

    addtoWishListButtons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        const backgroundStyle =
          card.querySelector(".card-image").style.backgroundImage;
        const imageUrl = backgroundStyle.replace('url("', "").replace('")', "");

        const product = {
          id: card.dataset.id,
          image: imageUrl,
          title: card.querySelector(".card-title").innerText,
          price: parseFloat(
            card.querySelector(".card-price").innerText.replace("$", "")
          ),
        };
        addToWishlist(product);
      });
    });

    const modalBtn = card.querySelector(".card-modal-btn");
    modalBtn.addEventListener("click", (button, existingItemIndex) => {
      const modalId = `modal-${item.id}`;
      const modal = createModal(item, modalId);
      document.body.appendChild(modal);
      document.getElementById(modalId).style.display = "block";
    });

    addToHeaderCart(item);
    return card;
  }

  let selectedProduct = null;

  function addToCart(item, count) {
    const existingItemIndex = basket.findIndex(
      (basketItem) => basketItem.id === item.id
    );
    if (existingItemIndex !== -1) {
      basket[existingItemIndex].quantity += count;
    } else {
      item.quantity = count;
      basket.push(item);
    }
    localStorage.setItem("basket", JSON.stringify(basket));
    updateCartCount();
    productAddToCarttAlert(item);
    addToHeaderCart(item);
  }

  //Basketdeki product sayini guncelle
  function updateCartCount() {
    const totalCount = basket.reduce(
      (total, item) => (total += item.quantity),
      0
    );
    document.getElementById("cart-count").innerText = totalCount;
  }

  function displayUpdatedCart() {
    const totalPriceElement = document.getElementById("total-price");

    let totalPrice = 0;
    basket.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });

    totalPriceElement.textContent = "Total: $" + totalPrice.toFixed(2);
    basket = JSON.parse(localStorage.getItem("basket")) || [];
    updateCartCount();
  }

  function removeFromHeaderCart(itemId) {
    const headerCartItems = document.getElementById("header-cart-items");
    const itemToRemove = headerCartItems.querySelector(`[data-id="${itemId}"]`);
    if (itemToRemove) {
      headerCartItems.removeChild(itemToRemove);
      basket = basket.filter((item) => item.id !== itemId);
      localStorage.setItem("basket", JSON.stringify(basket));
    }
    displayUpdatedCart();
    showCart();
  }

  function addToHeaderCart(item) {
    if (selectedProduct) {
      const existingCartItem = document.querySelector(
        `.header-cart-item[data-id="${item.id}"]`
      );
      if (existingCartItem) {
        // Baskette  varsa miqdarını güncelle
        const quantityElement = existingCartItem.querySelector(".card-price");
        const quantity = parseInt(quantityElement.textContent.split(" x ")[0]);
        quantityElement.textContent = `${quantity + 1} x $${item.price}`;
      } else {
        // Baskette yoxsa yeni ürün olarak ekle
        const headerCartItems = document.getElementById("header-cart-items");
        const headerCartItem = document.createElement("div");
        headerCartItem.classList = "header-cart-item";
        headerCartItem.dataset.id = item.id;
        headerCartItem.innerHTML = `
        <div class="card-image">
          <img src="${item.image}"/>
          <div class="img-overlay">X</div>
        </div>
        <div class="card-body">
          <div class="card-title">${item.title}</div>
          <div class="card-price">1 x $${item.price}</div>
        </div>
        `;
        headerCartItems.appendChild(headerCartItem);
      }
    }
    displayUpdatedCart();
    showCart();

    $(document).ready(function () {
      $("#slideButton").click(function () {
        $(".slideMenu").stop().animate(
          {
            right: "0",
          },
          100
        );
      });
    });

    $(document).ready(function () {
      $(".header-close-btn").click(function () {
        $(".slideMenu").stop().animate(
          {
            right: "-500",
          },
          50
        );
      });
    });
  }
  function showCart() {
    const cartItems = JSON.parse(localStorage.getItem("basket")) || [];
    const headerCartItems = document.getElementById("header-cart-items");

    headerCartItems.innerHTML = "";

    cartItems.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("header-cart-item");
      cartItem.dataset.id = item.id;
      cartItem.innerHTML = `
        <div class="card-image">
          <img src="${item.image}" />
          <div class="img-overlay">X</div>
        </div>
        <div class="card-body">
          <div class="card-title">${item.title}</div>
          <div class="card-price">${item.quantity} x $${item.price}</div>
        </div>
      `;
      headerCartItems.appendChild(cartItem);

      // Sepetten ürünü kaldır
      const imgOverlay = cartItem.querySelector(".img-overlay");
      imgOverlay.addEventListener("click", () => {
        removeFromHeaderCart(item.id);
        showCart();
      });
    });

    displayUpdatedCart();
  }
  // WishList Functions

  function addToWishlist(addproduct, e) {
    if (!addproduct) {
      return;
    }
    const existingProductIndex = wishlist.findIndex(
      (product) => product.id === addproduct.id
    );

    if (existingProductIndex !== -1) {
      productAlreadyHasAlert(addproduct);
        } else {
      wishlist.push(addproduct);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      productAddWishlistAlert(addproduct);
    }

    DisplayWishList();
  }

  function DisplayWishList() {
    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = "<p>WishList Empty</p>";
      return;
    }
    wishlistContainer.innerHTML = ``;
    wishlist.forEach((product) => {
      console.log(product);
      const wishListItem = document.createElement("div");
      wishListItem.classList.add("wishlist-item");
      wishListItem.dataset.id = product.id;
      wishListItem.innerHTML = `
        <div class="image">
          <img src="${product.image}" alt="">
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
      wishlistContainer.appendChild(wishListItem);
      wishListItem
        .querySelector(".remove-wishlist")
        .addEventListener("click", () => {
          console.log("click");
          removeFromWishlist(product.id);
          DisplayWishList();
          updateCartCount();
        });
    });
  }
  function productAddToCarttAlert(item) {
    Swal.fire({
      title: `${item.title}`,
      text: "is added to Cart !",
      icon: "success",
    });
  }
  function productAddWishlistAlert(item) {
    Swal.fire({
      title: `${item.title}`,
      text: "is added to wishlist !",
      icon: "success",
    });
  }
  function productAlreadyHasAlert(item) {
    Swal.fire({
      title: `${item.title}`,
      text: "is already in the wishlist !",
    });
  }

  fetchProducts();
  displayUpdatedCart();
  showCart();
  DisplayWishList();
});
