const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const mealsContainer = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const errorContainer = document.getElementById('error-container');
const mealDetails = document.getElementById('meal-details');
const mealDetailsContent = document.querySelector('#meal-details-content');
const backBtn = document.getElementById('back-btn');

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
const SEARCH_URL = `${BASE_URL}/search.php?s=`;
const LOOKUP_URL = `${BASE_URL}/lookup.php?i=`;

searchBtn.addEventListener('click', searchMeals);
mealsContainer.addEventListener('click', handleMealClick);
backBtn.addEventListener('click', () => mealDetails.classList.add('hidden'));

searchInput.addEventListener('keypress', (e) => {
    if(e.key === "Enter") searchMeals();
});

async function searchMeals() {
    const searchTerm = searchInput.value.trim();

    if(!searchTerm){
        errorContainer.textContent = "Please enter a seach term";
        errorContainer.classList.remove('hidden');
        return;
    }

    try{
        resultHeading.textContent = `searching for "${searchTerm}"...`;
        mealsContainer.innerHTML = "";
        errorContainer.classList.add('hidden');

        const response = await fetch(`${SEARCH_URL}${searchTerm}`);
        const data = await response.json();

        if(data.meals === null){
            resultHeading.textContent = ``;
            mealsContainer.innerHTML = "";
            errorContainer.textContent = `No recipes found for "${searchTerm}". try another search term.`;
            errorContainer.classList.remove('hidden');
        }else{
            resultHeading.textContent = `Results for "${searchTerm}"`;
            displayMeals(data.meals);
            searchInput.value = "";
        }
    }catch(error){
        console.log(error);
        errorContainer.textContent = "An error occurred while searching for recipes.";
        errorContainer.classList.remove('hidden');
    }
}

function displayMeals(meals){
    mealsContainer.innerHTML = "";

    meals.forEach((meal) => {
        mealsContainer.innerHTML += `
            <div class="meal" data-meal-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class="meal-info">
                    <h3 class="meal-title">${meal.strMeal}</h3>
                    ${meal.strCategory ? `<span class="meal-category">${meal.strCategory}</span>` : ""}
                </div>
            </div>
        `
    })
}

async function handleMealClick(e){
    const mealEl = e.target.closest('.meal');

    if(!mealEl) return;

    const mealId = mealEl.getAttribute("data-meal-id");

    try{
        const response = await fetch(`${LOOKUP_URL}${mealId}`);
        const data = await response.json();

        console.log("data", data);

        if(data.meals && data.meals[0]){
            const meal = data.meals[0];

            const ingredients = [];

            for(let i = 1; i <= 20; i++){
                if(meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== ""){
                    ingredients.push({
                        ingredient: meal[`strIngredient${i}`],
                        measure: meal[`strMeasure${i}`]
                    })
                }
            }

            mealDetailsContent.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
                <h2 class="meal-details-title">${meal.strMeal}</h2>
                <div class="meal-details-category">
                    <span>${meal.strCategory || "Uncategorized"}</span>
                </div>

                <div class="meal-details-instructions>
                    <h3>Instructions</h3>
                    <p>${meal.strInstructions}</p>
                </div>

                <div class="meal-details-ingredients">
                    <h3>Ingredients : </h3>

                    <ul class="ingredient-list">
                        ${ingredients.map(
                            (ingredient) => `<li><i class="fas fa-check-circle"></i>${ingredient.measure} ${ingredient.ingredient}</li>`
                        ).join('')}
                    </ul>
                </div>

                ${meal.strYoutube ? `
                    <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
                    <i class="fab fa-youtube"></i> Watch Recipe
                    </a>` : ""
                }
            `;

            mealDetails.classList.remove('hidden');
            mealDetails.scrollIntoView({ behavior: "smooth" });
        }
    }catch(error){
        console.log(error);
        errorContainer.textContent = "An error occurred while searching for recipes.";
        errorContainer.classList.remove('hidden');
    }
}