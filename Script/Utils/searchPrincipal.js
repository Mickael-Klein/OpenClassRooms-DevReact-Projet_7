let searchVisibilityHasBeenModified = false;
let articleOnDisplayNoneCounter = 0; // Si === à displayedRecipesCount, alors rendre le message de recherche non trouvée visible

function searchPrincipal(e) {
  let displayedRecipesCount = displayedRecipes.length;
  const searchStart = performance.now();
  const value = e.target.value.trim();
  const currentLength = value.length;

  const Regex = new RegExp(value, "i"); // Regex de comparaison qui ignore la casse (pas besoin de normaliser input ou éléments contenus dans tableau)

  const invisibleBySearchClass = "invisibleBySearch";

  const noRecipeMsg = document.querySelector("#noRecipeToDisplayMsg");
  if (!noRecipeMsg.classList.contains("invisible")) {
    noRecipeMsg.classList.add("invisible");
  }

  function handleRecipesIfUserInputAndCurrentLengthGreaterThanTwo() {
    let tempArrForIngredients = [];
    let tempArrForDevices = [];
    let tempArrForUstensils = [];

    displayedRecipes.filter((recipe) => {
      // Filtre Recettes et gère la visibilité recettes & tags dans le dom via classe "invisibleBysearch"
      const id = recipe.id;
      const name = recipe.name;
      const description = recipe.description;
      const ingredients = recipe.ingredients.map(
        (ingredient) => ingredient.ingredient
      );

      let isValidRecipe = false;
      let matchFound = false;

      if (Regex.test(name)) {
        isValidRecipe = true;
        matchFound = true;
      }

      if (!matchFound && Regex.test(description)) {
        isValidRecipe = true;
        matchFound = true;
      }

      if (
        !matchFound &&
        ingredients.some((i) => {
          if (Regex.test(i)) {
            matchFound = true;
            return true;
          }
          return false;
        })
      ) {
        isValidRecipe = true;
      }

      const article = document.querySelector(`[data-id="${id}"]`);
      const articleIsInvisibleBySearch = article.classList.contains(
        invisibleBySearchClass
      );

      if (isValidRecipe) {
        // Remplissage des tableaux de cache pour comparaison futur
        tempArrForIngredients.push(ingredients);
        tempArrForDevices.push(recipe.appliance);
        tempArrForUstensils.push(recipe.ustensils);

        // Gestion de la visibilité de l'article de la recette
        if (articleIsInvisibleBySearch) {
          article.classList.remove(invisibleBySearchClass);
          recipe.isVisibleBySearch = true;
          searchVisibilityHasBeenModified = true;
        }
      } else if (!isValidRecipe) {
        if (!articleIsInvisibleBySearch) {
          article.classList.add(invisibleBySearchClass);
          recipe.isVisibleBySearch = false;
          searchVisibilityHasBeenModified = true;
        }
      }

      if (!recipe.isVisibleBySearch || recipe.isInvisibleByTag.length > 0) {
        // Si recette invisible par search ou par tag, incrémenter le compteur
        articleOnDisplayNoneCounter++;
      }
    });

    if (searchVisibilityHasBeenModified) {
      // Les modifications de tags ne se font que si des modifications de visibilité ont lieu
      // Arrays contenant les refs complètes
      const regroupedCacheIngredients = regroupedCaches.find(
        (obj) => obj.type === "ingredient"
      );
      const regroupedCacheDevices = regroupedCaches.find(
        (obj) => obj.type === "device"
      );
      const regroupedCacheUstensils = regroupedCaches.find(
        (obj) => obj.type === "ustensil"
      );

      let tempSetForIngredients = new Set(tempArrForIngredients.flat());
      let tempSetForDevices = new Set(tempArrForDevices.flat());
      let tempSetForUstensils = new Set(tempArrForUstensils.flat());

      // Arrays contenant les reférences qui doivent être passées à invisibleBySearch
      const arrOfInvisibleIngredients = regroupedCacheIngredients.array.filter(
        (elem) => !tempSetForIngredients.has(elem)
      );
      const arrOfInvisibleDevices = regroupedCacheDevices.array.filter(
        (elem) => !tempSetForDevices.has(elem)
      );
      const arrOfInvisibleUstensils = regroupedCacheUstensils.array.filter(
        (elem) => !tempSetForUstensils.has(elem)
      );

      // Attribution des 3 listes de tags dans le DOM à des constantes
      const ingredientsTagsList =
        regroupedCacheIngredients.target.querySelectorAll("ul li");
      const devicesTagsList =
        regroupedCacheDevices.target.querySelectorAll("ul li");
      const ustensilsTagsList =
        regroupedCacheUstensils.target.querySelectorAll("ul li");

      // Attribution class invisibleBySearch à l'ensemble des tags contenus dans les arrOfInvisible... en ciblant les li ayant le data-name correspondant

      function handleTagVisibility(tagList, arrOfInvisible) {
        tagList.forEach((li) => {
          const button = li.querySelector("button");
          const dataName = button.dataset.name;
          if (arrOfInvisible.includes(dataName)) {
            if (!li.classList.contains(invisibleBySearchClass)) {
              li.classList.add(invisibleBySearchClass);
            }
          } else if (
            li.classList.contains(invisibleBySearchClass) &&
            !arrOfInvisible.includes(dataName)
          ) {
            li.classList.remove(invisibleBySearchClass);
          }
        });
      }

      handleTagVisibility(ingredientsTagsList, arrOfInvisibleIngredients);
      handleTagVisibility(devicesTagsList, arrOfInvisibleDevices);
      handleTagVisibility(ustensilsTagsList, arrOfInvisibleUstensils);
    }
  }

  function resetIsVisibleBySearchProperties() {
    // Reset les status dans les objets recette si des modifications de status on eu lieu depuis initialisation ou reset
    if (searchVisibilityHasBeenModified) {
      displayedRecipes.forEach((recipe) => {
        if (!recipe.isVisibleBySearch) {
          recipe.isVisibleBySearch = true;
        }
      });
      const invisibeBySearchElemNodeList = document.querySelectorAll(
        `.` + invisibleBySearchClass
      );
      invisibeBySearchElemNodeList.forEach((elem) =>
        elem.classList.remove(invisibleBySearchClass)
      );
      searchVisibilityHasBeenModified = false;
    }
  }

  if (currentLength >= 3) {
    // Si longueur saisie > 3, appel fonction et défini searchVisisbilityHasBeenModified à true
    handleRecipesIfUserInputAndCurrentLengthGreaterThanTwo();
  } else if (currentLength < 3) {
    // Si longueur < 3, appel fonction qui vérifie si searchVisisbilityHasBeenModified est true avant de faire un reset ou non
    resetIsVisibleBySearchProperties();
  }

  const searchEnd = performance.now();
  const scriptTime = searchEnd - searchStart;

  if (articleOnDisplayNoneCounter === displayedRecipesCount) {
    noRecipeMsg.classList.remove("invisible");
  }

  articleOnDisplayNoneCounter = 0; // Reset du compteur

  console.log(`Cette recherche a été exécutée en ${Math.floor(scriptTime)}ms`); // Indique durée d'éxécution du script pour mesure performance
}
