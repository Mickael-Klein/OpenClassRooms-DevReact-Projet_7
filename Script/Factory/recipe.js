function recipeFactory(data) {
  const {
    id,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
  } = data;

  function getRecipeCardDom() {
    const article = document.createElement("article");
    article.setAttribute("data-id", id);

    const divImageContainer = document.createElement("div");
    divImageContainer.classList.add("imageContainer");
    article.appendChild(divImageContainer);

    const divContentContainer = document.createElement("div");
    divContentContainer.classList.add("contentContainer");

    const divContentHead = document.createElement("div");
    divContentHead.classList.add("contentContainer__head");

    const h3 = document.createElement("h3");
    h3.textContent = name;
    divContentHead.appendChild(h3);

    const timeContainer = document.createElement("div");
    timeContainer.classList.add("timeContainer");
    timeContainer.innerHTML = `<i class="fa-regular fa-clock"></i> <p>${time} min</p>`;
    divContentHead.appendChild(timeContainer);

    divContentContainer.appendChild(divContentHead);

    const divContentMain = document.createElement("main");
    divContentHead.classList.add("contentContainer__main");

    const ingredientsList = document.createElement("ul");
    ingredients.forEach((ingredient) => {
      const li = document.createElement("li");

      if (ingredient.quantity) {
        li.innerHTML = `<span class="ingredientName">${ingredient.ingredient}: </span>${ingredient.quantity}`;
      } else {
        li.innerHTML = `<span class="ingredientName">${ingredient.ingredient}</span>`;
      }

      if (ingredient.unit && ingredient.unit.length > 2) {
        if (ingredient.unit == "grammes") {
          li.innerHTML += `g`;
        } else {
          li.innerHTML += ` ${ingredient.unit}`;
        }
      } else if (ingredient.unit && ingredient.unit.length <= 2) {
        li.innerHTML += `${ingredient.unit}`;
      }

      ingredientsList.appendChild(li);
    });

    divContentMain.appendChild(ingredientsList);

    const descriptionContainer = document.createElement("div");
    descriptionContainer.classList.add("descriptionContainer");

    const process = document.createElement("p");
    process.innerText = description;
    descriptionContainer.appendChild(process);

    divContentMain.appendChild(descriptionContainer);

    divContentContainer.appendChild(divContentMain);

    article.appendChild(divContentContainer);

    return article;
  }

  return { getRecipeCardDom };
}
