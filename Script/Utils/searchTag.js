let arrOfIdsAndType = [];
const invisibleByTagClass = "invisibleByTag";

function closeTag(e) {
  const removeStart = performance.now();

  const elem = e.target.closest("div");
  const value = elem.querySelector("span").innerText; // Récupère la valeur du tag

  const filteredByValue = arrOfIdsAndType.find((arr) => arr.name === value); // Récupère l'objet ayant la propriété name concordante
  const indexOfFilteredByValueArr = arrOfIdsAndType.findIndex(
    // Récupère l'index de l'objet dans le tableau
    (arr) => arr.name === value
  );
  const arrOfObjectIds = filteredByValue.ids;

  displayedRecipes.forEach((recipe) => {
    const id = recipe.id;
    if (arrOfObjectIds.includes(id)) {
      // Si recette contenue dans le tableau d'ids de l'objet traité
      const isInvisibleByTagArr = recipe.isInvisibleByTag;
      const indexOfTag = isInvisibleByTagArr.findIndex(
        (elem) => elem === value
      ); // Récupère index du tag et le supprime du tableau isInvisibleByTag de la recette
      isInvisibleByTagArr.splice(indexOfTag, 1);
      if (isInvisibleByTagArr.length === 0) {
        // Si longueur tableau = 0; supprimer la classe invisibleByTag de la recette et rendre visible les tags d'ingrédients qu'elle contient
        const article = document.querySelector(`article[data-id="${id}"]`);
        if (article.classList.contains(invisibleByTagClass)) {
          article.classList.remove(invisibleByTagClass);
        }
        const ingredients = recipe.ingredients.map(
          (ingredient) => ingredient.ingredient
        );
        const devices = recipe.appliance;
        const ustensils = recipe.ustensils;

        const ingredientTagList = document.querySelectorAll(
          ".ingredientTagContainer__list li"
        );
        const deviceTagList = document.querySelectorAll(
          ".devicesTagContainer__list li"
        );
        const ustensilTagList = document.querySelectorAll(
          ".ustensilsTagContainer__list li"
        );

        // Actualisation des tags en rendant leur visibilité s'ils sont cachés
        ingredientTagList.forEach((li) => {
          const button = li.querySelector("button");
          if (ingredients.includes(button.dataset.name)) {
            // Si l'ingrédient est contenu dans la liste des ingrédients de la recette (qui est valide), on supprime la classe invisible
            if (li.classList.contains(invisibleByTagClass)) {
              li.classList.remove(invisibleByTagClass);
            }
          }
        });

        deviceTagList.forEach((li) => {
          const button = li.querySelector("button");
          if (devices.includes(button.dataset.name)) {
            if (li.classList.contains(invisibleByTagClass)) {
              li.classList.remove(invisibleByTagClass);
            }
          }
        });

        ustensilTagList.forEach((li) => {
          const button = li.querySelector("button");
          if (ustensils.includes(button.dataset.name)) {
            if (li.classList.contains(invisibleByTagClass)) {
              li.classList.remove(invisibleByTagClass);
            }
          }
        });
      }
    }
  });

  elem.remove();
  arrOfIdsAndType.splice(indexOfFilteredByValueArr, 1); // Suppression de l'objet du tableau

  const removeEnd = performance.now();
  const removeTime = removeEnd - removeStart;
  console.log(
    `Le temps d'éxecution de ce script a été de ${Math.floor(removeTime)}ms`
  );
}

function searchTag(e) {
  const searchStart = performance.now();
  const target = e.target;
  const value = target.innerText;
  const valueDataName = target.dataset.name;
  const type = target.getAttribute("data-type");

  let tempArrForIngredients = [];
  let tempArrForDevices = [];
  let tempArrForUstensils = [];

  const checkArrayToKnowIfTagAlreadyChecked = arrOfIdsAndType.filter(
    (obj) => obj.name === value
  );

  if (checkArrayToKnowIfTagAlreadyChecked.length > 0) {
    // Si le tag existe déjà dans le tableau des tags séléctionnés
    return;
  } else {
    // SI le tag n'existe pas encore, on créer l'objet à push, on filtre et update displayedRecipes ainsi que l'affichage dans le dom
    let arrayOfIds = [];

    let objectToPush = {
      name: value,
      valueDataName: valueDataName,
      type: type,
      ids: arrayOfIds,
    };

    let tagSelectedSection;

    switch (type) {
      case "ingredient":
        tagSelectedSection = document.querySelector(
          ".tagsSelected--ingredients"
        );

        displayedRecipes.filter((recipe) => {
          let recipeContainsValue = false;
          recipe.ingredients.forEach((ingredient) => {
            if (ingredient.ingredient === valueDataName) {
              recipeContainsValue = true;
            }
          });
          if (!recipeContainsValue) {
            recipe.isInvisibleByTag.push(value);
            arrayOfIds.push(recipe.id);
          } else {
            // Si la recette contient le tag
            tempArrForIngredients.push(
              recipe.ingredients.map((ingredient) => ingredient.ingredient)
            );
            tempArrForDevices.push(recipe.appliance);
            tempArrForUstensils.push(recipe.ustensils);
          }
        });
        break;

      case "device":
        tagSelectedSection = document.querySelector(".tagsSelected--devices");
        displayedRecipes.filter((recipe) => {
          let recipeContainsValue = false;
          if (recipe.appliance === valueDataName) {
            recipeContainsValue = true;
          }
          if (!recipeContainsValue) {
            recipe.isInvisibleByTag.push(value);
            arrayOfIds.push(recipe.id);
          } else {
            // Si la recette contient le tag
            tempArrForIngredients.push(
              recipe.ingredients.map((ingredient) => ingredient.ingredient)
            );
            tempArrForDevices.push(recipe.appliance);
            tempArrForUstensils.push(recipe.ustensils);
          }
        });
        break;

      case "ustensil":
        tagSelectedSection = document.querySelector(".tagsSelected--ustensils");
        displayedRecipes.filter((recipe) => {
          let recipeContainsValue = false;
          recipe.ustensils.forEach((ustensil) => {
            if (ustensil === valueDataName) {
              recipeContainsValue = true;
            }
          });
          if (!recipeContainsValue) {
            recipe.isInvisibleByTag.push(value);
            arrayOfIds.push(recipe.id);
          } else {
            // Si la recette contient le tag
            tempArrForIngredients.push(
              recipe.ingredients.map((ingredient) => ingredient.ingredient)
            );
            tempArrForDevices.push(recipe.appliance);
            tempArrForUstensils.push(recipe.ustensils);
          }
        });
        break;

      default:
        console.log("error in type attribution");
        break;
    }

    // Gestion visiblité article by Tag

    arrayOfIds.forEach((id) => {
      const article = document.querySelector(`article[data-id="${id}"]`);
      if (!article.classList.contains(invisibleByTagClass)) {
        article.classList.add(invisibleByTagClass);
      }
    });

    // Gestion visibilité des tags

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

    // Création des sets à valeurs uniques
    let tempSetForIngredients = new Set(tempArrForIngredients.flat());
    let tempSetForDevices = new Set(tempArrForDevices.flat());
    let tempSetForUstensils = new Set(tempArrForUstensils.flat());

    // Arrays contenant les reférences qui doivent être passées à invisibleByTag
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

    function handleTagVisibility(tagList, arrOfInvisible) {
      tagList.forEach((li) => {
        const button = li.querySelector("button");
        const dataName = button.dataset.name;
        if (arrOfInvisible.includes(dataName)) {
          if (!button.classList.contains(invisibleByTagClass)) {
            li.classList.add(invisibleByTagClass);
          }
        } else if (
          button.classList.contains(invisibleByTagClass) &&
          !arrOfInvisible.includes(dataName)
        ) {
          li.classList.remove(invisibleByTagClass);
        }
      });
    }

    handleTagVisibility(ingredientsTagsList, arrOfInvisibleIngredients);
    handleTagVisibility(devicesTagsList, arrOfInvisibleDevices);
    handleTagVisibility(ustensilsTagsList, arrOfInvisibleUstensils);

    //ne pouvoir afficher chaque tag qu'une seule fois et le mettre en display none dans la liste de tag

    const tagDisplay = document.createElement("div");
    tagDisplay.setAttribute("data-name", value);
    tagDisplay.setAttribute("data-type", type);
    tagDisplay.classList.add("tagSelectedContainer");
    const span = document.createElement("span");
    span.textContent = value;
    tagDisplay.appendChild(span);
    const button = document.createElement("button");
    button.classList.add("deleteTagBtn");
    button.dataset.id = `deleteTagBtn-${value}`;
    const img = document.createElement("img");
    img.src = "/Assets/Image/CrossInCircle.svg";
    img.alt = "Cross in circle";
    button.appendChild(img);
    tagDisplay.appendChild(button);
    tagSelectedSection.appendChild(tagDisplay);
    const deleteTagBtn = tagSelectedSection.querySelector(
      `[data-id="deleteTagBtn-${value}"]`
    );

    deleteTagBtn.addEventListener("click", (e) => {
      closeTag(e);
    });

    arrOfIdsAndType.push(objectToPush);

    // checkIfTagsShouldBeDisplayAfterTagUpdate();
  }
  const searchEnd = performance.now();
  const timeSearch = searchEnd - searchStart;
  console.log(
    "Le temps d'éxécution de ce script a été de ",
    Math.floor(timeSearch),
    "ms"
  );
}
