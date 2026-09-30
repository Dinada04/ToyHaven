/* 1. PRODUCT DATA */
var products = [
  { id: 1, name: "Dragon Knight Figure", category: "Figurines", price: 4500, image: "images/dragon-knight.jpg", description: "A hand-painted dragon knight with a movable sword and shield. Stands 18 cm tall." },
  { id: 2, name: "Space Explorer Figure", category: "Figurines", price: 3800, image: "images/space-explorer.jpg", description: "An astronaut figure with a jetpack and a display stand. A great desk collectible." },
  { id: 3, name: "Anime Hero Collectible", category: "Figurines", price: 6200, image: "images/anime-hero.jpg", description: "A limited edition hero figure with a detailed cape and collector's box." },
  { id: 4, name: "Wooden Building Blocks", category: "Toys", price: 2900, image: "images/building-blocks.jpg", description: "A set of 60 coloured wooden blocks for building towers, bridges and houses." },
  { id: 5, name: "Plush Teddy Bear", category: "Toys", price: 3200, image: "images/teddy-bear.jpg", description: "A super soft teddy bear, 35 cm tall and safe for all ages." },
  { id: 6, name: "Remote Control Robot", category: "Toys", price: 7500, image: "images/robot-toy.jpg", description: "A walking robot with flashing lights and sound. Works with a remote control." },
  { id: 7, name: "Family Chess Set", category: "Board Games", price: 3500, image: "images/chess-set.jpg", description: "A classic chess set with a folding wooden board and weighted pieces." },
  { id: 8, name: "Treasure Island Game", category: "Board Games", price: 4800, image: "images/treasure-island.jpg", description: "Race around the map to find the hidden treasure. For 2 to 5 players." },
  { id: 9, name: "Word Master Game", category: "Board Games", price: 2200, image: "images/word-master.jpg", description: "A fun word-building game for the whole family. Ages 8 and up." },
  { id: 10, name: "Red Sports Car 1:24", category: "Diecast Cars", price: 5400, image: "images/sports-car.jpg", description: "A 1:24 scale diecast sports car with doors that open and rubber tyres." },
  { id: 11, name: "Classic Jeep Diecast", category: "Diecast Cars", price: 4200, image: "images/classic-jeep.jpg", description: "A detailed classic jeep model with a metal body and a spare wheel." },
  { id: 12, name: "Police Car Diecast", category: "Diecast Cars", price: 3600, image: "images/police-car.jpg", description: "A diecast police car with a pull-back motor and a light bar." }
];

// Settings used in the cart and checkout calculations
var SHIPPING_FEE = 400;   // flat shipping fee in LKR
var TAX_RATE = 0.10;      // 10% tax

// Products shown in the "Featured" section on the home page (by id)
var featuredIds = [1, 5, 7, 10];


/*  2. REUSABLE HELPER FUNCTIONS (used on many pages) */

// Get an array from localStorage
function getData(key) {
  var text = localStorage.getItem(key);
  if (text === null) {
    return [];
  }
  return JSON.parse(text);
}

// Save an array into localStorage
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Turn 4500 into "LKR 4,500" Salli Salli
function formatPrice(amount) {
  return "LKR " + amount.toLocaleString("en-US");
}

// Find a product in the products array using its id
function findProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }
  return null;
}

// Show a small message at the bottom of the screen for 2.5 seconds
function showMessage(text) {
  var toast = document.getElementById("toast");
  if (toast === null) {
    return;
  }
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

// Simple email check: needs one @, something before it, and a dot after it
function isValidEmail(email) {
  var at = email.indexOf("@");
  var dot = email.lastIndexOf(".");
  if (email.indexOf(" ") !== -1) {
    return false;
  }
  if (at < 1 || at !== email.lastIndexOf("@")) {
    return false;
  }
  if (dot < at + 2 || dot === email.length - 1) {
    return false;
  }
  return true;
}

// Put an error message under a form field
function setError(id, message) {
  var element = document.getElementById(id);
  if (element !== null) {
    element.textContent = message;
  }
}


/*  3. CART FUNCTIONS */

// Update the number badge next to "Cart" in the menu
function updateCartCount() {
  var cart = getData("cart");
  var totalItems = 0;
  for (var i = 0; i < cart.length; i++) {
    totalItems = totalItems + cart[i].quantity;
  }
  var badge = document.getElementById("cart-count");
  if (badge !== null) {
    badge.textContent = totalItems;
  }
}

// Add a product to the cart
function addToCart(id) {
  var cart = getData("cart");
  var found = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].quantity = cart[i].quantity + 1;
      found = true;
    }
  }

  if (found === false) {
    cart.push({ id: id, quantity: 1 });
  }

  saveData("cart", cart);
  updateCartCount();
  showMessage(findProduct(id).name + " added to cart");
}

// Change the quantity by +1 or -1
function changeQuantity(id, change) {
  var cart = getData("cart");
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      var newQuantity = cart[i].quantity + change;
      if (newQuantity >= 1) {
        cart[i].quantity = newQuantity;
      }
    }
  }
  saveData("cart", cart);
}

// Remove one product from the cart
function removeFromCart(id) {
  var cart = getData("cart");
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) {
      newCart.push(cart[i]);
    }
  }
  saveData("cart", newCart);
}

// Work out subtotal, shipping, tax and total
function getCartTotals() {
  var cart = getData("cart");
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var product = findProduct(cart[i].id);
    subtotal = subtotal + product.price * cart[i].quantity;
  }

  var shipping = 0;
  if (cart.length > 0) {
    shipping = SHIPPING_FEE;
  }

  var tax = Math.round(subtotal * TAX_RATE);
  var total = subtotal + shipping + tax;

  return { subtotal: subtotal, shipping: shipping, tax: tax, total: total };
}


/*  4. WISHLIST FUNCTIONS */

function isInWishlist(id) {
  var wishlist = getData("wishlist");
  for (var i = 0; i < wishlist.length; i++) {
    if (wishlist[i].id === id) {
      return true;
    }
  }
  return false;
}

// Add to the wishlist if it is not there, remove it if it is
function toggleWishlist(id) {
  var wishlist = getData("wishlist");
  var newList = [];
  var wasThere = false;

  for (var i = 0; i < wishlist.length; i++) {
    if (wishlist[i].id === id) {
      wasThere = true;
    } else {
      newList.push(wishlist[i]);
    }
  }

  if (wasThere === false) {
    newList.push({ id: id });
    showMessage(findProduct(id).name + " added to wishlist");
  } else {
    showMessage(findProduct(id).name + " removed from wishlist");
  }

  saveData("wishlist", newList);
}

/* 5. PRODUCT CARDS (used on the home page and products page) */

// Build the HTML text for one product card
function createProductCard(product, showDetails) {
  var heart = "&#9825;";      // empty heart
  var heartClass = "icon-btn wish-btn";
  var pressed = "false";
  if (isInWishlist(product.id)) {
    heart = "&#9829;";        // filled heart
    heartClass = "icon-btn wish-btn active";
    pressed = "true";
  }

  var detailsButton = "";
  if (showDetails === true) {
    detailsButton = '<button class="link-btn details-btn" data-id="' + product.id + '">View details</button>';
  }

  return `
    <article class="card">
      <img class="product-img" src="${product.image}" alt="${product.name}" width="400" height="300">
      <div class="card-body">
        <p class="category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="price">${formatPrice(product.price)}</p>
        ${detailsButton}
        <div class="card-actions">
          <button class="btn btn-small add-to-cart" data-id="${product.id}">Add to Cart</button>
          <button class="${heartClass}" data-id="${product.id}" aria-pressed="${pressed}" aria-label="Add ${product.name} to wishlist" title="Add to Wishlist">${heart}</button>
        </div>
      </div>
    </article>`;
}

// Make the buttons inside a container work
function attachProductButtons(container) {
  // "Add to Cart" buttons
  var cartButtons = container.querySelectorAll(".add-to-cart");
  for (var i = 0; i < cartButtons.length; i++) {
    cartButtons[i].addEventListener("click", function () {
      var id = Number(this.getAttribute("data-id"));
      addToCart(id);
    });
  }

  // Heart buttons
  var heartButtons = container.querySelectorAll(".wish-btn");
  for (var j = 0; j < heartButtons.length; j++) {
    heartButtons[j].addEventListener("click", function () {
      var id = Number(this.getAttribute("data-id"));
      toggleWishlist(id);

      if (isInWishlist(id)) {
        this.innerHTML = "&#9829;";
        this.classList.add("active");
        this.setAttribute("aria-pressed", "true");
      } else {
        this.innerHTML = "&#9825;";
        this.classList.remove("active");
        this.setAttribute("aria-pressed", "false");
      }
    });
  }

  // "View details" buttons
  var detailButtons = container.querySelectorAll(".details-btn");
  for (var k = 0; k < detailButtons.length; k++) {
    detailButtons[k].addEventListener("click", function () {
      openModal(Number(this.getAttribute("data-id")));
    });
  }
}


/* 6. NAVIGATION BURGER MENU - all pages */
function setupMenu() {
  var menuButton = document.getElementById("menu-button");
  var navMenu = document.getElementById("nav-menu");
  if (menuButton === null || navMenu === null) {
    return;
  }

  menuButton.addEventListener("click", function () {
    navMenu.classList.toggle("open");
    menuButton.classList.toggle("open"); 

    if (navMenu.classList.contains("open")) {
      menuButton.setAttribute("aria-expanded", "true");
    } else {
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}


/* 7. HOME PAGE */

// Hero slider: shows one banner at a time and rotates automatically
var currentSlide = 0;
var slideTimer;

function showSlide(number) {
  var slides = document.querySelectorAll(".slide");
  if (number >= slides.length) {
    number = 0;
  }
  if (number < 0) {
    number = slides.length - 1;
  }
  for (var i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  slides[number].classList.add("active");
  currentSlide = number;
}

function setupHeroSlider() {
  var prevButton = document.getElementById("prev-slide");
  var nextButton = document.getElementById("next-slide");
  if (prevButton === null || nextButton === null) {
    return;
  }

  prevButton.addEventListener("click", function () {
    showSlide(currentSlide - 1);
    restartTimer();
  });

  nextButton.addEventListener("click", function () {
    showSlide(currentSlide + 1);
    restartTimer();
  });

  // Change the banner automatically every 4 seconds
  slideTimer = setInterval(function () {
    showSlide(currentSlide + 1);
  }, 4000);
}

// After the user clicks an arrow, start the 4 second timer again
function restartTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(function () {
    showSlide(currentSlide + 1);
  }, 4000);
}

// Product of the Day: the product changes every day of the month
function setupProductOfTheDay() {
  var box = document.getElementById("product-of-day");
  if (box === null) {
    return;
  }

  var today = new Date();
  var dayNumber = today.getDate();                 // 1 to 31
  var index = dayNumber % products.length;         // remainder gives a number from 0 to 11
  var product = products[index];

  box.innerHTML = `
    <article class="card potd-card">
      <img class="product-img" src="${product.image}" alt="${product.name}" width="400" height="300">
      <div class="card-body">
        <p class="category">${product.category}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${formatPrice(product.price)}</p>
        <div class="card-actions">
          <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
          <button class="icon-btn wish-btn" data-id="${product.id}" aria-pressed="false" aria-label="Add ${product.name} to wishlist" title="Add to Wishlist">&#9825;</button>
        </div>
      </div>
    </article>`;

  // Show the right heart if it is already in the wishlist
  if (isInWishlist(product.id)) {
    var heart = box.querySelector(".wish-btn");
    heart.innerHTML = "&#9829;";
    heart.classList.add("active");
    heart.setAttribute("aria-pressed", "true");
  }

  attachProductButtons(box);
}

// Featured products (4 cards)
function setupFeaturedProducts() {
  var grid = document.getElementById("featured-grid");
  if (grid === null) {
    return;
  }

  var html = "";
  for (var i = 0; i < featuredIds.length; i++) {
    html = html + createProductCard(findProduct(featuredIds[i]), false);
  }
  grid.innerHTML = html;
  attachProductButtons(grid);
}

// Newsletter form (email is saved in localStorage)
function setupNewsletter() {
  var form = document.getElementById("newsletter-form");
  if (form === null) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();   // stops the page from reloading

    var emailInput = document.getElementById("newsletter-email");
    var message = document.getElementById("newsletter-message");
    var email = emailInput.value.trim();

    if (isValidEmail(email) === false) {
      message.textContent = "Please enter a valid email address, like name@example.com.";
      return;
    }

    // Only save the email if it is not saved already
    var emails = getData("newsletter");
    var alreadySaved = false;
    for (var i = 0; i < emails.length; i++) {
      if (emails[i] === email) {
        alreadySaved = true;
      }
    }
    if (alreadySaved === false) {
      emails.push(email);
      saveData("newsletter", emails);
    }

    message.textContent = "Thank you for subscribing!";
    form.reset();
  });
}


/* 8. PRODUCTS PAGE (search, filter, sort, popup) */

// Show the products that match the search box, category and sort choice
function showProducts() {
  var grid = document.getElementById("product-grid");
  var searchText = document.getElementById("search-input").value.toLowerCase().trim();
  var category = document.getElementById("category-select").value;
  var sortChoice = document.getElementById("sort-select").value;

  // Step 1: filter (keep only products that match)
  var results = [];
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    var categoryMatches = (category === "All" || product.category === category);
    var searchMatches = (product.name.toLowerCase().indexOf(searchText) !== -1);

    if (categoryMatches && searchMatches) {
      results.push(product);
    }
  }

  // Step 2: sort
  if (sortChoice === "price-low") {
    results.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sortChoice === "price-high") {
    results.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (sortChoice === "name") {
    results.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  // Step 3: show the cards
  var html = "";
  for (var j = 0; j < results.length; j++) {
    html = html + createProductCard(results[j], true);
  }
  if (results.length === 0) {
    html = '<p class="empty-message">No products found. Try a different search or category.</p>';
  }
  grid.innerHTML = html;
  attachProductButtons(grid);

  document.getElementById("result-count").textContent = "Showing " + results.length + " product(s)";
}

function setupProductsPage() {
  var grid = document.getElementById("product-grid");
  if (grid === null) {
    return;
  }

  showProducts();

  // Run showProducts again every time the user types or changes a choice
  document.getElementById("search-input").addEventListener("input", showProducts);
  document.getElementById("category-select").addEventListener("change", showProducts);
  document.getElementById("sort-select").addEventListener("change", showProducts);

  // Close the popup with the X button, by clicking outside the box, or with Escape
  var modal = document.getElementById("modal");
  document.getElementById("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

// Open the product details popup
function openModal(id) {
  var product = findProduct(id);
  var content = document.getElementById("modal-content");

  var heart = "&#9825;";
  var heartClass = "icon-btn wish-btn";
  var pressed = "false";
  if (isInWishlist(id)) {
    heart = "&#9829;";
    heartClass = "icon-btn wish-btn active";
    pressed = "true";
  }

  content.innerHTML = `
    <img class="product-img" src="${product.image}" alt="${product.name}" width="400" height="300">
    <div class="modal-text">
      <p class="category">${product.category}</p>
      <h2 id="modal-title">${product.name}</h2>
      <p>${product.description}</p>
      <p class="price">${formatPrice(product.price)}</p>
      <div class="card-actions">
        <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        <button class="${heartClass}" data-id="${product.id}" aria-pressed="${pressed}" aria-label="Add ${product.name} to wishlist" title="Add to Wishlist">${heart}</button>
      </div>
    </div>`;

  attachProductButtons(content);
  document.getElementById("modal").classList.add("open");
  document.getElementById("modal-close").focus();
}

function closeModal() {
  var modal = document.getElementById("modal");
  if (modal.classList.contains("open") === false) {
    return;   // popup is already closed
  }
  modal.classList.remove("open");
  // Refresh the cards so the hearts match any changes made inside the popup
  showProducts();
}


/* 9. WISHLIST PAGE */
function showWishlist() {
  var grid = document.getElementById("wishlist-grid");
  var wishlist = getData("wishlist");

  if (wishlist.length === 0) {
    grid.innerHTML = '<p class="empty-message">Your wishlist is empty. <a href="products.html">Browse products</a> and tap the heart to save them here.</p>';
    return;
  }

  var html = "";

  for (var i = 0; i < wishlist.length; i++) {
    var item = wishlist[i];
    var product = findProduct(item.id);

    html = html + `
      <article class="card wishlist-card">
        <img class="product-img" src="${product.image}" alt="${product.name}" width="400" height="300">
        <div class="card-body">
          <p class="category">${product.category}</p>
          <h3>${product.name}</h3>
          <p class="price">${formatPrice(product.price)}</p>
          <div class="wishlist-actions">
            <button class="btn btn-small wish-add" data-id="${product.id}">Add Item</button>
            <button class="btn btn-small btn-white wish-remove" data-id="${product.id}">Remove</button>
          </div>
        </div>
      </article>`;
  }

  grid.innerHTML = html;

  // "Add Item" buttons (add to cart)
  var addButtons = grid.querySelectorAll(".wish-add");
  for (var b = 0; b < addButtons.length; b++) {
    addButtons[b].addEventListener("click", function () {
      addToCart(Number(this.getAttribute("data-id")));
    });
  }

  // "Remove" buttons
  var removeButtons = grid.querySelectorAll(".wish-remove");
  for (var c = 0; c < removeButtons.length; c++) {
    removeButtons[c].addEventListener("click", function () {
      toggleWishlist(Number(this.getAttribute("data-id")));   // it is in the list, so this removes it
      showWishlist();
    });
  }
}

function setupWishlistPage() {
  if (document.getElementById("wishlist-grid") === null) {
    return;
  }
  showWishlist();
}


/* 10. CART PAGE */
function showCart() {
  var body = document.getElementById("cart-body");
  var cart = getData("cart");
  var html = "";

  if (cart.length === 0) {
    html = '<tr><td colspan="5" class="empty-message">Your cart is empty. <a href="products.html">Continue shopping</a></td></tr>';
  }

  for (var i = 0; i < cart.length; i++) {
    var product = findProduct(cart[i].id);
    var itemSubtotal = product.price * cart[i].quantity;

    html = html + `
      <tr>
        <td>
          <div class="cart-product">
            <img src="${product.image}" alt="${product.name}" width="72" height="56">
            <span>${product.name}</span>
          </div>
        </td>
        <td>${formatPrice(product.price)}</td>
        <td>
          <div class="qty-box">
            <button class="qty-minus" data-id="${product.id}" aria-label="Decrease quantity of ${product.name}">-</button>
            <span class="qty-number">${cart[i].quantity}</span>
            <button class="qty-plus" data-id="${product.id}" aria-label="Increase quantity of ${product.name}">+</button>
          </div>
        </td>
        <td>${formatPrice(itemSubtotal)}</td>
        <td><button class="icon-btn remove-item" data-id="${product.id}" aria-label="Remove ${product.name} from cart" title="Remove">&#128465;</button></td>
      </tr>`;
  }

  body.innerHTML = html;

  // Show the totals in the Cart Summary box
  var totals = getCartTotals();
  document.getElementById("summary-subtotal").textContent = formatPrice(totals.subtotal);
  document.getElementById("summary-shipping").textContent = formatPrice(totals.shipping);
  document.getElementById("summary-tax").textContent = formatPrice(totals.tax);
  document.getElementById("summary-total").textContent = formatPrice(totals.total);

  // "-" buttons
  var minusButtons = body.querySelectorAll(".qty-minus");
  for (var a = 0; a < minusButtons.length; a++) {
    minusButtons[a].addEventListener("click", function () {
      changeQuantity(Number(this.getAttribute("data-id")), -1);
      showCart();
      updateCartCount();
    });
  }

  // "+" buttons
  var plusButtons = body.querySelectorAll(".qty-plus");
  for (var b = 0; b < plusButtons.length; b++) {
    plusButtons[b].addEventListener("click", function () {
      changeQuantity(Number(this.getAttribute("data-id")), 1);
      showCart();
      updateCartCount();
    });
  }

  // Trash (remove) buttons
  var removeButtons = body.querySelectorAll(".remove-item");
  for (var c = 0; c < removeButtons.length; c++) {
    removeButtons[c].addEventListener("click", function () {
      removeFromCart(Number(this.getAttribute("data-id")));
      showCart();
      updateCartCount();
      showMessage("Item removed from cart");
    });
  }
}

function setupCartPage() {
  if (document.getElementById("cart-body") === null) {
    return;
  }

  showCart();

  // Clear Cart button
  document.getElementById("clear-cart").addEventListener("click", function () {
    if (getData("cart").length === 0) {
      showMessage("Your cart is already empty");
      return;
    }
    if (confirm("Remove all items from your cart?")) {
      saveData("cart", []);
      showCart();
      updateCartCount();
    }
  });

  // Proceed to Checkout button
  document.getElementById("checkout-button").addEventListener("click", function () {
    if (getData("cart").length === 0) {
      showMessage("Add something to your cart first");
    } else {
      window.location.href = "checkout.html";
    }
  });
}


/* 11. CHECKOUT PAGE */

// Show the items and totals in the Order Summary box
function showOrderSummary() {
  var list = document.getElementById("order-items");
  var cart = getData("cart");
  var html = "";

  if (cart.length === 0) {
    html = '<li class="empty-message">Your cart is empty.</li>';
  }

  for (var i = 0; i < cart.length; i++) {
    var product = findProduct(cart[i].id);
    html = html + `
      <li class="summary-item">
        <img src="${product.image}" alt="" width="52" height="40">
        <span class="summary-item-name">${product.name} x ${cart[i].quantity}</span>
        <span>${formatPrice(product.price * cart[i].quantity)}</span>
      </li>`;
  }
  list.innerHTML = html;

  var totals = getCartTotals();
  document.getElementById("order-subtotal").textContent = formatPrice(totals.subtotal);
  document.getElementById("order-shipping").textContent = formatPrice(totals.shipping);
  document.getElementById("order-tax").textContent = formatPrice(totals.tax);
  document.getElementById("order-total").textContent = formatPrice(totals.total);
}

// Check every field. Returns true only if all fields are OK.
function validateCheckoutForm() {
  var valid = true;

  var name = document.getElementById("full-name").value.trim();
  var email = document.getElementById("email").value.trim();
  var address = document.getElementById("address").value.trim();
  var payment = document.getElementById("payment").value;

  if (name.length < 3) {
    setError("name-error", "Please enter your full name (at least 3 letters).");
    valid = false;
  } else {
    setError("name-error", "");
  }

  if (isValidEmail(email) === false) {
    setError("email-error", "Please enter a valid email, like name@example.com.");
    valid = false;
  } else {
    setError("email-error", "");
  }

  if (address.length < 10) {
    setError("address-error", "Please enter your full delivery address (at least 10 characters).");
    valid = false;
  } else {
    setError("address-error", "");
  }

  if (payment === "") {
    setError("payment-error", "Please select a payment method.");
    valid = false;
  } else {
    setError("payment-error", "");
  }

  return valid;
}

function setupCheckoutPage() {
  var form = document.getElementById("checkout-form");
  if (form === null) {
    return;
  }

  showOrderSummary();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var cart = getData("cart");
    if (cart.length === 0) {
      showMessage("Your cart is empty. Add items before checking out.");
      return;
    }

    if (validateCheckoutForm() === false) {
      return;   // stop here, the error messages are already showing
    }

    // Save the order in the order history
    var totals = getCartTotals();
    var orderItems = [];
    for (var i = 0; i < cart.length; i++) {
      var product = findProduct(cart[i].id);
      orderItems.push({ name: product.name, quantity: cart[i].quantity, price: product.price });
    }

    var order = {
      orderNumber: "TH" + Date.now(),
      date: new Date().toLocaleString(),
      name: document.getElementById("full-name").value.trim(),
      email: document.getElementById("email").value.trim(),
      address: document.getElementById("address").value.trim(),
      payment: document.getElementById("payment").value,
      items: orderItems,
      total: totals.total
    };

    var orders = getData("orders");
    orders.push(order);
    saveData("orders", orders);

    // Clear the cart
    saveData("cart", []);
    updateCartCount();
    showOrderSummary();

    // Show the animated success message
    document.getElementById("success-text").textContent =
      "Order confirmed! Thank you, " + order.name + ". Your order number is " + order.orderNumber +
      " and the total is " + formatPrice(order.total) + ".";
    document.getElementById("success-popup").classList.add("show");
    document.getElementById("confirm-button").disabled = true;
    form.reset();
    window.scrollTo(0, 0);
  });
}


/* 12. FEEDBACK PAGE */
function setupFeedbackPage() {
  var form = document.getElementById("feedback-form");
  if (form === null) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("fb-name").value.trim();
    var email = document.getElementById("fb-email").value.trim();
    var message = document.getElementById("fb-message").value.trim();
    var valid = true;

    if (name.length < 2) {
      setError("fb-name-error", "Please enter your name.");
      valid = false;
    } else {
      setError("fb-name-error", "");
    }

    if (isValidEmail(email) === false) {
      setError("fb-email-error", "Please enter a valid email, like name@example.com.");
      valid = false;
    } else {
      setError("fb-email-error", "");
    }

    if (message.length < 10) {
      setError("fb-message-error", "Your message must be at least 10 characters.");
      valid = false;
    } else {
      setError("fb-message-error", "");
    }

    if (valid === false) {
      document.getElementById("feedback-success").classList.remove("show");
      return;
    }

    // Save the feedback in localStorage
    var feedbackList = getData("feedback");
    feedbackList.push({ name: name, email: email, message: message, date: new Date().toLocaleString() });
    saveData("feedback", feedbackList);

    document.getElementById("feedback-success").classList.add("show");
    form.reset();
  });
}

// FAQ accordion: click a question to show or hide its answer
function setupFaq() {
  var questions = document.querySelectorAll(".faq-question");
  for (var i = 0; i < questions.length; i++) {
    questions[i].addEventListener("click", function () {
      var answer = document.getElementById(this.getAttribute("aria-controls"));
      if (answer.hidden) {
        answer.hidden = false;
        this.setAttribute("aria-expanded", "true");
      } else {
        answer.hidden = true;
        this.setAttribute("aria-expanded", "false");
      }
    });
  }
}


/* 13. EXTRA COOL COOL EFFECTS: reveal on scroll, loader, PWA */

// Elements with class "reveal" fade in when they scroll into view
function revealOnScroll() {
  var items = document.querySelectorAll(".reveal");
  for (var i = 0; i < items.length; i++) {
    var top = items[i].getBoundingClientRect().top;
    if (top < window.innerHeight - 60) {
      items[i].classList.add("visible");
    }
  }
}

// Hide the spinner once the page has finished loading
function setupLoader() {
  var loader = document.getElementById("loader");
  if (loader === null) {
    return;
  }
  window.addEventListener("load", function () {
    loader.classList.add("hide");
  });
}

// Register the service worker.
function registerServiceWorker() {
  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js");
  }
}


/* 14. START EVERYTHING when the page loads */
updateCartCount();
setupLoader();
setupMenu();
setupHeroSlider();
setupProductOfTheDay();
setupFeaturedProducts();
setupNewsletter();
setupProductsPage();
setupWishlistPage();
setupCartPage();
setupCheckoutPage();
setupFeedbackPage();
setupFaq();
registerServiceWorker();

revealOnScroll();
window.addEventListener("scroll", revealOnScroll);
