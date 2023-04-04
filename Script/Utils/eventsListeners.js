// Tags Buttons

function addEventsListenersOnTagsButtons() {
  const tagsContainersNodeList = document.querySelectorAll(
    ".inputContainer__tagContainer"
  );
  tagsContainersNodeList.forEach((container) => {
    const buttonsNodeList = container.querySelectorAll("button");
    buttonsNodeList.forEach((button) => {
      button.addEventListener("click", (e) => {
        searchTag(e);
      });
    });
  });
}

function addEventsListenersOnPage() {
  // Tags visibility

  function handleTagInputChange(f) {
    const inputValue = stringNormalizer(f.target.value);
    console.log(inputValue);
    const container = f.target.closest(".advancedSearchByTag");
    const tagContainer = container.querySelector(
      ".inputContainer__tagContainer"
    );
    const tagList = tagContainer.querySelectorAll("li");
    tagList.forEach((tag) => {
      const buttonInnerText = stringNormalizer(
        tag.querySelector("button").innerText
      );
      if (!buttonInnerText.includes(inputValue)) {
        if (!tag.classList.contains("invisibleByInputSearchInTag")) {
          tag.classList.add("invisibleByInputSearchInTag");
        }
      } else {
        if (tag.classList.contains("invisibleByInputSearchInTag")) {
          tag.classList.remove("invisibleByInputSearchInTag");
        }
      }
    });
  }

  function toogleTagInputContainerVisibility(e) {
    const container = e.target.closest(".advancedSearchByTag");
    const tagContainer = container.querySelector(
      ".inputContainer__tagContainer"
    );
    const input = container.querySelector("button input");
    const inputPlaceholderCurrentValue = input.placeholder.toLowerCase();

    if (Array.from(tagContainer.classList).includes("invisible")) {
      tagContainer.classList.remove("invisible");
      container.classList.add("advancedSearchByTag--visible");
      input.placeholder = `Rechercher un ${inputPlaceholderCurrentValue}`;
      input.addEventListener("input", (f) => handleTagInputChange(f));
    } else {
      container.classList.remove("advancedSearchByTag--visible");
      tagContainer.classList.add("invisible");
      let lastWordOfPlaceholder = inputPlaceholderCurrentValue
        .split(" ")
        .at(-1);
      let placeholderNewValue =
        lastWordOfPlaceholder.charAt(0).toUpperCase() +
        lastWordOfPlaceholder.slice(1);
      input.placeholder = placeholderNewValue;
      input.removeEventListener("input", handleTagInputChange);
    }
  }

  function addEventListenersForTagsVisibility() {
    // Event listener pour la visibilité des tags de recherche avancée
    const tagInputContainerNodeList =
      document.querySelectorAll(".inputContainer");
    tagInputContainerNodeList.forEach((container) => {
      container.addEventListener("click", (e) =>
        toogleTagInputContainerVisibility(e)
      );
    });
  }

  // Search Bar

  function addEventListenerOnPrincipalSearchbarChanges() {
    const inputSearchbar = document.querySelector("#search__input");
    inputSearchbar.addEventListener("input", (e) => searchPrincipal(e));
  }

  addEventListenersForTagsVisibility();
  addEventListenerOnPrincipalSearchbarChanges();
  addEventsListenersOnTagsButtons();
}
