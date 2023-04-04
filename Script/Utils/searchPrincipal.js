let searchVisibilityHasBeenModified = false;
let articleOnDisplayNoneCounter = 0; // Si === à displayedRecipesCount, alors rendre le message de recherche non trouvée visible

function searchPrincipal(e) {
  let displayedRecipesCount = displayedRecipes.length;
  const searchStart = performance.now();
  const value = e.target.value.trim();
  const currentLength = value.length;

  let numberOfRecipesOnDisplayNone = 0; // Si === displayedRecipe.length alors display message dans le dom de recherche échouée

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

    for (let i = 0; i < displayedRecipes.length; i++) {
      // Filtre Recettes et gère la visibilité recettes & tags dans le dom via classe "invisibleBysearch"
      const recipe = displayedRecipes[i];
      const id = recipe.id;
      const name = recipe.name;
      const description = recipe.description;
      let ingredients = [];
      for (let j = 0; j < recipe.ingredients.length; j++) {
        ingredients.push(recipe.ingredients[j].ingredient);
      }

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

      for (let j = 0; j < ingredients.length; j++) {
        const ingredient = ingredients[j];
        if (Regex.test(ingredient)) {
          isValidRecipe = true;
          break;
        }
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
    }

    if (searchVisibilityHasBeenModified) {
      // Les modifications de tags ne se font que si des modifications de visibilité ont lieu
      // Arrays contenant les refs complètes
      let regroupedCacheIngredients;
      for (let i = 0; i < regroupedCaches.length; i++) {
        if (regroupedCaches[i].type === "ingredient") {
          regroupedCacheIngredients = regroupedCaches[i];
        }
      }

      let regroupedCacheDevices;
      for (let i = 0; i < regroupedCaches.length; i++) {
        if (regroupedCaches[i].type === "device") {
          regroupedCacheDevices = regroupedCaches[i];
        }
      }

      let regroupedCacheUstensils;
      for (let i = 0; i < regroupedCaches.length; i++) {
        if (regroupedCaches[i].type === "ustensil") {
          regroupedCacheUstensils = regroupedCaches[i];
        }
      }

      tempArrForIngredients = tempArrForIngredients.flat();
      tempArrForDevices = tempArrForDevices.flat();
      tempArrForUstensils = tempArrForUstensils.flat();

      let tempSetForIngredients = [];
      for (let i = 0; i < tempArrForIngredients.length; i++) {
        if (!tempSetForIngredients.includes(tempArrForIngredients[i])) {
          tempSetForIngredients.push(tempArrForIngredients[i]);
        }
      }

      let tempSetForDevices = [];
      for (let i = 0; i < tempArrForDevices.length; i++) {
        if (!tempSetForDevices.includes(tempArrForDevices[i])) {
          tempSetForDevices.push(tempArrForDevices[i]);
        }
      }

      let tempSetForUstensils = [];
      for (let i = 0; i < tempArrForUstensils.length; i++) {
        if (!tempSetForUstensils.includes(tempArrForUstensils[i])) {
          tempSetForUstensils.push(tempArrForUstensils[i]);
        }
      }

      const arrOfInvisibleIngredients = [];
      for (let i = 0; i < regroupedCacheIngredients.array.length; i++) {
        if (
          !tempSetForIngredients.includes(regroupedCacheIngredients.array[i])
        ) {
          arrOfInvisibleIngredients.push(regroupedCacheIngredients.array[i]);
        }
      }

      const arrOfInvisibleDevices = [];
      for (let i = 0; i < regroupedCacheDevices.array.length; i++) {
        if (!tempSetForDevices.includes(regroupedCacheDevices.array[i])) {
          arrOfInvisibleDevices.push(regroupedCacheDevices.array[i]);
        }
      }

      const arrOfInvisibleUstensils = [];
      for (let i = 0; i < regroupedCacheUstensils.array.length; i++) {
        if (!tempSetForUstensils.includes(regroupedCacheUstensils.array[i])) {
          arrOfInvisibleUstensils.push(regroupedCacheUstensils.array[i]);
        }
      }

      // Attribution des 3 listes de tags dans le DOM à des constantes
      const ingredientsTagsList =
        regroupedCacheIngredients.target.querySelectorAll("ul li");
      const devicesTagsList =
        regroupedCacheDevices.target.querySelectorAll("ul li");
      const ustensilsTagsList =
        regroupedCacheUstensils.target.querySelectorAll("ul li");

      // Attribution class invisibleBySearch à l'ensemble des tags contenus dans les arrOfInvisible... en ciblant les li ayant le data-name correspondant

      function handleTagVisibility(tagList, arrOfInvisible) {
        for (let i = 0; i < tagList.length; i++) {
          const li = tagList[i];
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
        }
      }

      handleTagVisibility(ingredientsTagsList, arrOfInvisibleIngredients);
      handleTagVisibility(devicesTagsList, arrOfInvisibleDevices);
      handleTagVisibility(ustensilsTagsList, arrOfInvisibleUstensils);
    }
  }

  function resetIsVisibleBySearchProperties() {
    // Reset les status dans les objets recette si des modifications de status on eu lieu depuis initialisation ou reset
    if (searchVisibilityHasBeenModified) {
      for (let i = 0; i < displayedRecipes.length; i++) {
        const recipe = displayedRecipes[i];
        if (!recipe.isVisibleBySearch) {
          recipe.isVisibleBySearch = true;
        }
      }

      const invisibeBySearchElemNodeList = document.querySelectorAll(
        `.${invisibleBySearchClass}`
      );

      for (let i = 0; i < invisibeBySearchElemNodeList.length; i++) {
        const elem = invisibeBySearchElemNodeList[i];
        elem.classList.remove(invisibleBySearchClass);
      }

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
