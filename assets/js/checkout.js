document.addEventListener("DOMContentLoaded", () => {
  let basket = JSON.parse(localStorage.getItem("basket")) || [];
  function DisplayCheckout() {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    let checkoutItems = document.getElementById("checkout-items");
    if (basket.length === 0) {
      checkoutItems.innerHTML = "<p>Sepet boş</p>";
      return;
    }
    checkoutItems.innerHTML = "";
    basket.forEach((product, index) => {
      let checkoutItem = document.createElement("div");
      checkoutItem.classList = "checkout-item";
      checkoutItem.dataset.id = `${product.id}`;
      checkoutItem.innerHTML = `
                 <div class="checkout-image" >
                   <img src=${product.image} alt="">
                 </div>
                <div class="checkout-card-body">
                <p class="card-title check-col">${product.title}</p>
                <p class="price check-col">${product.price.toFixed(2)}$</p>
                <br/>
                <div class="quantity check-col">
                   <button class="decrease">-</button>
                   <span class="quantityCount">${product.quantity}</span>
                   <button class="increase">+</button>
                </div> 
                <span class="product-total-price check-col">
                 ${(product.quantity * product.price).toFixed(2)} $
                </span>
                </div>
          
                `;

      checkoutItems.appendChild(checkoutItem);
      checkoutItem.querySelector(".increase").addEventListener("click", () => {
        updateProductQuantity(index, 1);
      });
      checkoutItem.querySelector(".decrease").addEventListener("click", () => {
        updateProductQuantity(index, -1);
        basket[index].quantity++;
      });
    });
  }
  function updateProductQuantity(index, change) {
    if (basket[index].quantity + change <= 0) {
      basket.splice(index, 1);
    } else {
      basket[index].quantity += change;
    }

    localStorage.setItem("basket", JSON.stringify(basket));
    calculateTotalPrice();
    DisplayCheckout();
  }
  function calculateTotalPrice() {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    let totalPrice = 0;
    basket.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });
    DisplayCheckout();
    return totalPrice;
  }

  const totalPriceElement = document.getElementById("subtotalprice");
  const totalPriceBtn = document.getElementById("checkout-total-price");

  totalPriceElement.textContent = "Total: $" + calculateTotalPrice().toFixed(2);
  totalPriceBtn.textContent = "Total: $" + calculateTotalPrice().toFixed(2);

  calculateTotalPrice();
  DisplayCheckout();
});
