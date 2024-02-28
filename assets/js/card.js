const url = "http://localhost:3000/products";
const cardContainer = document.getElementById("card-container");
const loadMoreBtn = document.getElementById("load-more-btn");

let startIndex = 0;
const itemsPerPage = 4;

loadMoreBtn.addEventListener("click", loadMore);

function loadMore() {
  startIndex += itemsPerPage;
  fetchProducts();
}

function fetchProducts() {
  fetch(`${url}?_start=${startIndex}&_limit=${itemsPerPage}`)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        const card = createCard(item);
        cardContainer.appendChild(card);
      });

      // Veri sayısının itemsPerPage'ten az olması durumunda Load More butonunu gizle
      if (data.length < itemsPerPage) {
        loadMoreBtn.style.display = "none";
      } 
    });
}

function createCard(item) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <div class="card-image" style="background-image:url('${item.image}')">
      <button class="card-modal-btn" id="card-modal" data-id="${item.id}">Quick View</button>
    </div>
    <div class="card-body">
      <div class="card-title">${item.title}</div>
      <i class="fa-regular fa-heart"></i>
    </div>
    <div class="card-price">$${item.price}</div>`;
  return card;
}

fetchProducts();
