async function fetchData() {
  try {
    const response = await fetch("../Data/recipes.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    const main = document.querySelector("main");
    main.innerHTML = `<div class="err"><h2>Nous avons rencontré une erreur, veuillez revenir plus tard !</h2></div>`;
  }
}

const data = fetchData();
