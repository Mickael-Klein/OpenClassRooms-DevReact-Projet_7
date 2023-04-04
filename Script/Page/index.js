// Doms Elements
const recipeSection = document.querySelector("#recipe");
const ingredientContainer = document.querySelector(
  ".advancedSearchByTag--ingredient"
);

const devicesContainer = document.querySelector(
  ".advancedSearchByTag--devices"
);
const ustensilsContainer = document.querySelector(
  ".advancedSearchByTag--ustensils"
);
const ingredientTagContainer = document.querySelector(
  ".ingredientTagContainer"
);
const devicesTagContainer = document.querySelector(".devicesTagContainer");
const ustensilsTagContainer = document.querySelector(".ustensilsTagContainer");

// Tableaux de cache globaux
let recipes;
let displayedRecipes = [];
let cacheIngredients = [];
let cacheDevices = [];
let cacheUstensils = [];
let regroupedCaches = [
  {
    name: "cacheIngredients",
    target: ingredientTagContainer,
    className: "ingredientTagContainer__list",
    array: cacheIngredients,
    type: "ingredient",
  },
  {
    name: "cacheDevices",
    target: devicesTagContainer,
    className: "devicesTagContainer__list",
    array: cacheDevices,
    type: "device",
  },
  {
    name: "cacheUstensils",
    target: ustensilsTagContainer,
    className: "ustentilsTagContainer__list",
    array: cacheUstensils,
    type: "ustensil",
  },
];

function assignValuesToGlobalCacheArrs() {
  // Déclaration fonction pour remplir les tableaux de cache dans displayRecipes()

  let tempArrForIngredients = [];
  let tempArrForDevices = [];
  let tempArrForUstensils = [];

  displayedRecipes.forEach((recipe) => {
    if (recipe.isVisibleBySearch && recipe.isInvisibleByTag.length === 0) {
      // Si recette encore valide pour affichage et tags
      // Ingredients
      recipe.ingredients.forEach((ingredient) => {
        tempArrForIngredients.push(ingredient.ingredient);
      });
      // Devices
      tempArrForDevices.push(recipe.appliance);
      // Ustensils
      recipe.ustensils.forEach((ustensil) => {
        tempArrForUstensils.push(ustensil);
      });
    }
  });
  const setIngredients = new Set(tempArrForIngredients);
  cacheIngredients.splice(0, cacheIngredients.length, ...setIngredients);

  const setDevices = new Set(tempArrForDevices);
  cacheDevices.splice(0, cacheDevices.length, ...setDevices);

  const setUstensils = new Set(tempArrForUstensils);
  cacheUstensils.splice(0, cacheUstensils.length, ...setUstensils);
}

function assignValuesToGlobalCacheArrs() {
  // Déclaration fonction pour remplir les tableaux de cache dans displayRecipes()

  let tempArrForIngredients = [];
  let tempArrForDevices = [];
  let tempArrForUstensils = [];

  displayedRecipes.forEach((recipe) => {
    if (recipe.isVisibleBySearch && recipe.isInvisibleByTag.length === 0) {
      // Si recette encore valide pour affichage et tags
      // Ingredients
      recipe.ingredients.forEach((ingredient) => {
        tempArrForIngredients.push(ingredient.ingredient);
      });
      // Devices
      tempArrForDevices.push(recipe.appliance);
      // Ustensils
      recipe.ustensils.forEach((ustensil) => {
        tempArrForUstensils.push(ustensil);
      });
    }
  });
  const setIngredients = new Set(tempArrForIngredients);
  cacheIngredients.splice(0, cacheIngredients.length, ...setIngredients);

  const setDevices = new Set(tempArrForDevices);
  cacheDevices.splice(0, cacheDevices.length, ...setDevices);

  const setUstensils = new Set(tempArrForUstensils);
  cacheUstensils.splice(0, cacheUstensils.length, ...setUstensils);
}

function fillTagsFields() {
  assignValuesToGlobalCacheArrs(); // Appel fonction pour actualiser les tableaux de cache globaux

  regroupedCaches.forEach((cache) => {
    const { className, array, target, type } = cache;
    const listToFill = document.createElement("ul");
    listToFill.className = className;

    array.forEach((elem, index) => {
      // Normalisation de elem pour display
      elemNormalized = elem.replace(/\s*\([^)]*\)/g, "").trim(); // supprime élément entre parenthèse et espace debut et fin

      const li = document.createElement("li");
      const button = document.createElement("button");
      button.className = "tagContainer__btn";
      button.setAttribute("data-id", `${className}-${index}`);
      button.setAttribute("data-type", `${type}`);
      button.setAttribute("data-name", elem);
      button.textContent = elemNormalized;
      li.className = "centeredText";
      li.appendChild(button);
      listToFill.appendChild(li);
    });

    target.innerHTML = "";
    target.appendChild(listToFill);
  });
}

function displayRecipes() {
  // Display recettes via factory

  displayedRecipes.forEach((recipe) => {
    const recipeCardDom = recipeFactory(recipe).getRecipeCardDom();
    recipeSection.appendChild(recipeCardDom);
  });

  // Style grid marge rows en fonction de marge columns
  const article1 = document.querySelector('[data-id="1"]');
  const article2 = document.querySelector('[data-id="2"]');

  const rect1 = article1.getBoundingClientRect();
  const rect2 = article2.getBoundingClientRect();

  const gap = parseInt(rect2.left - (rect1.left + rect1.width));
  recipeSection.style.rowGap = gap + "px";
}

async function init() {
  // Initialisation de la page avec l'ensemble des données fetch
  const datas = await data;
  ({ recipes } = datas);

  displayedRecipes = recipes.map((recipe) => {
    const modifiedRecipe = {
      id: recipe.id,
      name: tagNormalizer(recipe.name),
      servings: recipe.servings,
      ingredients: recipe.ingredients.map((ingredient) => {
        const modifiedIngredient = {
          ingredient: tagNormalizer(ingredient.ingredient),
        };
        if (ingredient.quantity !== undefined) {
          modifiedIngredient.quantity = ingredient.quantity;
        }
        if (ingredient.unit !== undefined) {
          modifiedIngredient.unit = ingredient.unit;
        }
        return modifiedIngredient;
      }),
      time: recipe.time,
      description: recipe.description,
      appliance: tagNormalizer(recipe.appliance),
      ustensils: recipe.ustensils.map((ustensil) => tagNormalizer(ustensil)),
      isVisibleBySearch: true,
      isInvisibleByTag: [],
    };
    return modifiedRecipe;
  });

  displayRecipes();

  fillTagsFields();

  addEventsListenersOnPage();
}

init();
