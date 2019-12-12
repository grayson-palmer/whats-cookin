let mainNav = document.querySelector('.main-nav');
let navBar = document.querySelector('.navbar');
let recipeList = document.querySelector('.injected-recipes');
let pantry = document.querySelector('.pantry');
let pantryList = document.querySelector('.injected-pantry');
let favoriteRecipes = document.querySelector('.injected-favorite-recipes');
let allRecipes = [];
let searchedRecipes = [];
let favoriteRecipesAll = [];
let currentRecipesAll = [];
let currentUser;
let allIngredients;
let input = document.querySelector('.search-bar');






window.onload = pageLoadHandler;
// navBarToggle.addEventListener('click', function () {
//   mainNav.classList.toggle('active');
// });
// mainNav.addEventListener('keypress', mainHandler);
mainNav.addEventListener('keyup', mainHandler);
navBar.addEventListener('click', navHandler);

function pageLoadHandler() {
  loadUser();
  allRecipes = instantiateRecipes();
  allIngredients = instantiateIngredients();
  loadRecipes(allRecipes);
}

function mainHandler() {
  searchedRecipes = [];
  clearDom()
  searchRecipes(input.value)
  loadRecipes(searchedRecipes);
}

function navHandler(event) {
  if(event.target.classList.contains('navbar-toggle')) {
     mainNav.classList.toggle('active');
  }
  if(event.target.innerHTML === "Favorites") {
    clearDom();
    loadRecipes(favoriteRecipesAll);
    mainNav.classList.toggle('active');
  }
  if(event.target.innerHTML === "To Cook") {
    clearDom();
    loadRecipes(currentRecipesAll);
    mainNav.classList.toggle('active');
  }
  if(event.target.innerHTML === "Pantry") {
    clearDom();
    loadPantry();
    mainNav.classList.toggle('active');
  }
}

function loadUser() {
  currentUser = new Users(users[0]);
  currentUser.createPantry(users[0].pantry);
}

function loadRecipes(recipeArray) {
  for(let i = 0; i <  recipeArray.length; i++) {
    recipeList.insertAdjacentHTML('beforeend',
    `<div class="recipe-card" data-id="${recipeArray[i].id}">
      <div class="recipe-header">
        <img src="${recipeArray[i].image}" alt="Picture of ${recipeArray[i].name}">
        <h3>${recipeArray[i].name}</h3>
        <div class="button-wrapper">
          <button class="buttons favorite-recipe">&#11089;</button>
          <button class="buttons current-recipe">+</button>
        </div>
      </div>
      <div class="recipe-content hidden">
        <ul class="recipe-ingredients">
          ${recipeIngredients(recipeArray[i].ingredients)}
        </ul>
        <ol class="recipe-directions">
          ${recipeDirections(recipeArray[i].instructions)}
        </ol>
      </div>
    </div>`
    )}
  recipeSelector = recipeList.querySelectorAll('.recipe-card');
  recipeSelector.forEach(recipe => recipe.addEventListener('click', recipeHandler));
};

function instantiateRecipes() {
  let recipes = [];
  for (let i = 0; i < recipeData.length; i++) {
    recipes.push(new Recipes(recipeData[i]))
  }
  return recipes;
};

function recipeIngredients(ingredientList) {
  return ingredientList.map(x => `<li data-id='${x.id}'><i>${x.name}</i>: ${(Math.floor(x.quantity.amount * 100) / 100) + ' ' + x.quantity.unit}</li>`).join('\n');
};

function recipeDirections(directionsList) {
  return directionsList.map(x => `<li>${x.instruction}</li>`).join('\n');
};

function recipeHandler(event) {
  if (event.target.parentNode.classList.contains('recipe-header')) {
    event.target.parentNode.parentNode.classList.toggle('recipe-card-active');
    event.target.parentNode.parentNode.children[1].classList.toggle('hidden');
  }
  if (event.target.classList.contains('favorite-recipe')) {
    let recipeId = event.target.parentNode.parentNode.parentNode.dataset.id;
    if (!currentUser.favoriteRecipes.includes(recipeId)) {
      currentUser.favoriteRecipes.push(currentUser.addFavoriteRecipe(recipeId));
      currentUser.favoriteRecipes = currentUser.favoriteRecipes.filter((el) => {return el != undefined});
    } else {
      currentUser.favoriteRecipes.splice(currentUser.favoriteRecipes.indexOf(recipeId), 1);
    }
    favoriteRecipesAll = [];
    allRecipes.filter(recipe => {
      currentUser.favoriteRecipes.forEach(id => {
        if(parseInt(id) === recipe.id) {
          favoriteRecipesAll.push(recipe);
        }
      })
    })
    event.target.classList.toggle('favorite-recipe-active');
  }
  if (event.target.classList.contains('current-recipe')) {
    let recipeId = event.target.parentNode.parentNode.parentNode.dataset.id
    if (!currentUser.currentRecipes.includes(recipeId)) {
      currentUser.currentRecipes.push(currentUser.addCurrentRecipe(recipeId));
      currentUser.currentRecipes = currentUser.currentRecipes.filter((el) => {return el != undefined});
    } else {
      currentUser.currentRecipes.splice(currentUser.currentRecipes.indexOf(recipeId), 1);
    }
    currentRecipesAll = [];
    allRecipes.filter(recipe => {
      currentUser.currentRecipes.forEach(id => {
        if(parseInt(id) === recipe.id) {
          currentRecipesAll.push(recipe);
        }
      })
    })
    event.target.classList.toggle('current-recipe-active');
  }
};

function searchRecipes(keyword) {
  return allRecipes.filter(recipe => {
    if (recipe.name.toLowerCase().includes(keyword.toLowerCase()) ||
    recipe.tags.includes(keyword.toLowerCase())
  ) {
      searchedRecipes.push(recipe);
    }
  })
};

function clearDom() {
  recipeList.innerHTML = "";
};

function loadPantry() {
  pantry.insertAdjacentHTML('afterbegin',
  `<h2>Hello ${currentUser.name}! Here's what's in your pantry!</h2>`
)
  for(let i = 0; i <  currentUser.pantry.length; i++) {
    pantryList.insertAdjacentHTML('beforeend',
    `<div class="recipe-card"
      <div class="recipe-header">
        ${currentUser.pantry[i].ingredient}: ${currentUser.pantry[i].amount}
      </div>
    </div>`
    )}
}

//Not functioning because dataset has erroneous data
function ingredientName(id) {
  let fullIngredient = allIngredients.find(ingredient => ingredient.id === id);
  return fullIngredient.name;
}

function instantiateIngredients() {
  let ingredients = [];
  for (let i = 0; i < ingredientsData.length; i++) {
    ingredients.push(new Ingredients(ingredientsData[i]))
  }
  console.log(ingredients)
  return ingredients;
};
