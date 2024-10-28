let mealDisplayArea = document.getElementById("mealDisplayArea");
let searchSection = document.getElementById("searchSection");
let submitButton;

$(document).ready(() => {
  fetchMealsByName("").then(() => {
    $(".page-loader").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});

// toggle navigation menu
function toggleNavMenu(show) {
  let navWidth = $(".side-navigation .nav-item").outerWidth();

  if (show) {
    $(".side-navigation").animate(
      {
        left: 0,
      },
      500
    );
    $(".menu-toggle-icon").removeClass("fa-align-justify").addClass("fa-x");
    $(".menu-links li").each((index, element) => {
      $(element).animate(
        {
          top: 0,
        },
        (index + 5) * 100
      );
    });
  } else {
    $(".side-navigation").animate(
      {
        left: -navWidth,
      },
      500
    );
    $(".menu-toggle-icon").addClass("fa-align-justify").removeClass("fa-x");
    $(".menu-links li").animate(
      {
        top: 300,
      },
      500
    );
  }
}
//!hide the navigation menu
toggleNavMenu(false);

$(".side-navigation i.menu-toggle-icon").click(() => {
  const isVisible = $(".side-navigation").css("left") === "0px";
  toggleNavMenu(!isVisible);
});

function renderMeals(meals) {
  let mealMarkup = "";

  meals.forEach((meal) => {
    mealMarkup += `
            <div class="col-md-3">
                <div onclick="fetchMealDetails('${meal.idMeal}')" class="meal-card position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="">
                    <div class="meal-overlay position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `;
  });

  mealDisplayArea.innerHTML = mealMarkup;
}

async function fetchCategories() {
  mealDisplayArea.innerHTML = "";
  $(".content-loader").fadeIn(300);
  searchSection.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();

  renderCategories(response.categories);
  $(".content-loader").fadeOut(300);
}

function renderCategories(categories) {
  let categoryMarkup = "";

  categories.forEach((category) => {
    categoryMarkup += `
            <div class="col-md-3">
                <div onclick="fetchMealsByCategory('${
                  category.strCategory
                }')" class="meal-card position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${
                      category.strCategoryThumb
                    }" alt="">
                    <div class="meal-overlay position-absolute text-center text-black p-2">
                        <h3>${category.strCategory}</h3>
                        <p>${category.strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                </div>
            </div>
        `;
  });

  mealDisplayArea.innerHTML = categoryMarkup;
}

async function fetchAreas() {
  mealDisplayArea.innerHTML = "";
  $(".content-loader").fadeIn(300);
  searchSection.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();

  renderAreas(response.meals);
  $(".content-loader").fadeOut(300);
}

function renderAreas(areas) {
  let areaMarkup = "";

  areas.forEach((area) => {
    areaMarkup += `
            <div class="col-md-3">
                <div onclick="fetchMealsByArea('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${area.strArea}</h3>
                </div>
            </div>
        `;
  });

  mealDisplayArea.innerHTML = areaMarkup;
}

async function fetchIngredients() {
  mealDisplayArea.innerHTML = "";
  $(".content-loader").fadeIn(300);
  searchSection.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();

  renderIngredients(response.meals.slice(0, 20));
  $(".content-loader").fadeOut(300);
}

function renderIngredients(ingredients) {
  let ingredientMarkup = "";

  ingredients.forEach((ingredient) => {
    ingredientMarkup += `
            <div class="col-md-3">
                <div onclick="fetchMealsByIngredient('${
                  ingredient.strIngredient
                }')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${ingredient.strIngredient}</h3>
                    <p>${ingredient.strDescription
                      .split(" ")
                      .slice(0, 20)
                      .join(" ")}</p>
                </div>
            </div>
        `;
  });

  mealDisplayArea.innerHTML = ingredientMarkup;
}

async function fetchMealsByCategory(category) {
  mealDisplayArea.innerHTML = "";
  $(".content-loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();

  renderMeals(response.meals.slice(0, 20));
  $(".content-loader").fadeOut(300);
}

async function fetchMealsByArea(area) {
  mealDisplayArea.innerHTML = "";
  $(".content-loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();

  renderMeals(response.meals.slice(0, 20));
  $(".content-loader").fadeOut(300);
}

async function fetchMealsByIngredient(ingredient) {
  mealDisplayArea.innerHTML = "";
  $(".content-loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  response = await response.json();

  renderMeals(response.meals.slice(0, 20));
  $(".content-loader").fadeOut(300);
}

async function fetchMealDetails(mealID) {
  toggleNavMenu(false); //! Hide menu when fetching meal details
  mealDisplayArea.innerHTML = "";
  $(".content-loader").fadeIn(300);
  searchSection.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  response = await response.json();

  displayMealDetails(response.meals[0]);
  $(".content-loader").fadeOut(300);
}

function displayMealDetails(meal) {
  searchSection.innerHTML = "";

  let ingredientsMarkup = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredientsMarkup += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",") || [];
  let tagsMarkup = tags
    .map((tag) => `<li class="alert alert-danger m-2 p-1">${tag}</li>`)
    .join("");

  let detailsMarkup = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area: </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category: </span>${meal.strCategory}</h3>
            <h3>Recipes:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredientsMarkup}
            </ul>
            <h3>Tags:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tagsMarkup}
            </ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">YouTube</a>
        </div>`;

  mealDisplayArea.innerHTML = detailsMarkup;
}

function displaySearchInputs() {
  searchSection.innerHTML = `
        <div class="row py-4">
            <div class="col-md-6">
                <input onkeyup="fetchMealsByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="fetchMealsByLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>`;
  mealDisplayArea.innerHTML = "";
}

async function fetchMealsByName(term) {
  toggleNavMenu(false); //! Hide menu when searching
  mealDisplayArea.innerHTML = "";
  $(".content-loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();

  response.meals ? renderMeals(response.meals) : renderMeals([]);
  $(".content-loader").fadeOut(300);
}

async function fetchMealsByLetter(letter) {
  toggleNavMenu(false);
  mealDisplayArea.innerHTML = "";
  $(".content-loader").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  response = await response.json();

  response.meals ? renderMeals(response.meals) : renderMeals([]);
  $(".content-loader").fadeOut(300);
}
//! contact section
function displayContacts() {
  mealDisplayArea.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="usernameInput" onkeyup="validateInputs()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="usernameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="userEmailInput" onkeyup="validateInputs()" type="email" class="form-control" placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *example@domain.com*
                </div>
            </div>
            <div class="col-md-6">
                <input id="userPhoneInput" onkeyup="validateInputs()" type="text" class="form-control" placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter a valid phone number
                </div>
            </div>
            <div class="col-md-6">
                <input id="userAgeInput" onkeyup="validateInputs()" type="number" class="form-control" placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter a valid age
                </div>
            </div>
            <div class="col-md-6">
                <input id="userPasswordInput" onkeyup="validateInputs()" type="password" class="form-control" placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Password must be at least 8 characters, with one letter and one number
                </div>
            </div>
            <div class="col-md-6">
                <input id="confirmPasswordInput" onkeyup="validateInputs()" type="password" class="form-control" placeholder="Confirm Password">
                <div id="confirmPasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Passwords do not match
                </div>
            </div>
        </div>
        <button id="submitFormBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;

  submitFormBtn = document.getElementById("submitFormBtn");

  const inputs = [
    "usernameInput",
    "userEmailInput",
    "userPhoneInput",
    "userAgeInput",
    "userPasswordInput",
    "confirmPasswordInput",
  ];

  inputs.forEach((inputId) => {
    document.getElementById(inputId).addEventListener("focus", () => {
      inputStatus[inputId] = true;
    });
  });
}

let inputStatus = {
  usernameInput: false,
  userEmailInput: false,
  userPhoneInput: false,
  userAgeInput: false,
  userPasswordInput: false,
  confirmPasswordInput: false,
};

function validateInputs() {
  const validations = {
    usernameInput: isValidName,
    userEmailInput: isValidEmail,
    userPhoneInput: isValidPhone,
    userAgeInput: isValidAge,
    userPasswordInput: isValidPassword,
    confirmPasswordInput: isValidConfirmPassword,
  };

  let formValid = true;

  for (const inputId in inputStatus) {
    const alertElementId = inputId.replace("Input", "Alert");
    const alertElement = document.getElementById(alertElementId);
    if (inputStatus[inputId]) {
      if (validations[inputId]()) {
        alertElement.classList.replace("d-block", "d-none");
      } else {
        alertElement.classList.replace("d-none", "d-block");
        formValid = false;
      }
    } else {
      formValid = false;
    }
  }

  if (formValid) {
    submitFormBtn.removeAttribute("disabled");
  } else {
    submitFormBtn.setAttribute("disabled", true);
  }
}

function isValidName() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("usernameInput").value);
}

function isValidEmail() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("userEmailInput").value
  );
}

function isValidPhone() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("userPhoneInput").value
  );
}

function isValidAge() {
  const ageValue = document.getElementById("userAgeInput").value;
  return /^\d+$/.test(ageValue) && ageValue >= 1 && ageValue <= 200;
}

function isValidPassword() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(
    document.getElementById("userPasswordInput").value
  );
}

function isValidConfirmPassword() {
  return (
    document.getElementById("confirmPasswordInput").value ===
    document.getElementById("userPasswordInput").value
  );
}
