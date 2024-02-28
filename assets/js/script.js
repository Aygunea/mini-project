document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("go-to-checkout").addEventListener("click", () => {
      window.location.href = "./checkout.html";
    });
    document.getElementById("whislist").addEventListener("click", () => {
      window.location.href = "./whislist.html";
    });
  
    const deleteAll = document.getElementById("delete-all");
  
    deleteAll.addEventListener("click", () => {
      localStorage.removeItem("basket");
      const cartItems = document.getElementById("cart-items");
      cartItems.innerText = "Empty";
      document.getElementById("total-price").innerText = "";
      updateCartCount();
    });
  
    const addtocartButton = document.querySelectorAll(".add-to-cart");
  
    addtocartButton.forEach((button) => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        const product = {
          id: card.dataset.id,
          image: card.querySelector("img").src,
          title: card.querySelector("h2").innerText,
          price: parseFloat(
            card.querySelector(".price").innerText.replace("$", "")
          ),
          quantity: 1,
        };
        addToCart(product);
        updateCartCount();
        DisplayCart();
      });
    });
  
    function addToCart(addproduct) {
      let cart = JSON.parse(localStorage.getItem("basket")) || [];
      const existingProductIndex = cart.findIndex(
        (product) => product.id === addproduct.id
      );
      if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        cart.push(addproduct);
      }
      localStorage.setItem("basket", JSON.stringify(cart));
      updateCartCount();
    }
  
    function DisplayCart() {
      let cart = JSON.parse(localStorage.getItem("basket")) || [];
      const cartItems = document.getElementById("cart-items");
      cartItems.innerHTML = "";
      cart.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.id = "productElement";
        productElement.innerHTML = `
        <div class="cartProduct" data-id=${product.id}>
          <img class="cartImage" src="${product.image}">
          <div class="card-body">
           <div class="title"> ${product.title} </div>
          <div class="quantity">Count: ${product.quantity}</div> 
          Price: ${product.price.toFixed(2)} $
          <i class="fa-solid fa-trash delete-product" ></i>
          </div>
          </div>`;
        cartItems.appendChild(productElement);
      });
  
      const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
  
      document.getElementById("total-price").textContent = totalPrice.toFixed(2);
  
      const uniqueProductCount = new Set(cart.map((product) => product.id)).size;
      document.getElementById("unique-product-count").textContent =
        uniqueProductCount;
  
      const deleteProduct = document.querySelectorAll(".delete-product");
      deleteProduct.forEach((delPro) => {
        delPro.addEventListener("click", (e) => {
          const card = e.target.closest(".cartProduct");
          console.log(card);
          const productId = card.dataset.id;
          RemoveProduct(productId);
        });
      });
      updateCartCount();
    }
  
    function RemoveProduct(productID) {
      const cart = JSON.parse(localStorage.getItem("basket")) || [];
      const updateCart = cart.filter((item) => item.id !== productID);
  
      localStorage.setItem("basket", JSON.stringify(updateCart));
      updateCartCount();
      DisplayCart();
    }
  
    function updateCartCount() {
      let cart = JSON.parse(localStorage.getItem("basket")) || [];
      const totalCount = cart.reduce(
        (total, item) => (total += item.quantity),
        0
      );
      document.getElementById("cart-count").innerText = totalCount;
    }
    //Whislist
    const addtoWhisListButtons = document.querySelectorAll(".add-to-whislist");
  
    addtoWhisListButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        const product = {
          id: card.dataset.id,
          image: card.querySelector("img").src,
          title: card.querySelector("h2").innerText,
          price: parseFloat(
            card.querySelector(".price").innerText.replace("$", "")
          ),
        };
        addToWhisList(product);
      });
    });
  
    function addToWhisList(addproduct) {
      let whislist = JSON.parse(localStorage.getItem("whislist")) || [];
      const existingProductIndex = whislist.findIndex(
        (product) => product.id === addproduct.id
      );
      if (existingProductIndex === -1) {
        whislist.push(addproduct);
        localStorage.setItem("whislist", JSON.stringify(whislist));
        alert("Ürün dilek listesine eklendi!");
      }
    }
  
    // Dilek Listesini Gösterme İşlevi
    function DisplayWhisList() {
      let whislist = JSON.parse(localStorage.getItem("whislist")) || [];
      const whislistItems = document.getElementById("whislist-items");
      whislistItems.innerHTML = "";
  
      whislist.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.innerHTML = `
        <div class="whislist-product" data-id=${product.id}>
              <img class="whislist-image" src=${product.image} alt="">
              <div class="whislist-card-body">
              <h3>${product.title}</h3>
              <p class="price">Price: ${product.price.toFixed(2)}$</p>
              <div class="buttons">
              <button class="remove-whislist-product">
            Remove Whislist
              </button>
              <button class="add-to-cart-from-whislist">
            Add To Cart
              </button>
              </div>
               </div>
          </div>
        `;
        whislistItems.appendChild(productElement);
  
        productElement
          .querySelector(".add-to-cart-from-whislist")
          .addEventListener("click", () => {
            addToCart(product);
            alert("Ürün sepete eklendi!");
            updateCartCount();
          });
  
        productElement
          .querySelector(".remove-whislist-product")
          .addEventListener("click", () => {
            removeFromWhislist(product.id);
            DisplayWhisList(); // Dilek listesini yeniden oluştur
            updateCartCount();
          });
      });
      updateCartCount();
    }
    function removeFromWhislist(productID) {
      let whislist = JSON.parse(localStorage.getItem("whislist")) || [];
      whislist = whislist.filter((product) => product.id !== productID);
      localStorage.setItem("whislist", JSON.stringify(whislist));
    }
    DisplayWhisList();
    updateCartCount();
    window.onpageshow = function(event) {
      if (event.persisted) {
        updateCartCount();
      }
    };
  
  });
  