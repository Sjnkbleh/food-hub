import axiosClient from '../axiosClient';

export function searchMeals({ commit }, keyword) {
  axiosClient.get(`search.php?s=${keyword}`)
    .then(({ data }) => {
      commit('setSearchedMeals', data.meals)
    })
}

export function searchMealsByLetter({ commit }, letter) {
  axiosClient.get(`search.php?f=${letter}`)
    .then(({ data }) => {
      commit('setMealsByLetter', data.meals)
    })
}

export function searchMealsByIngredient({ commit }, ing) {
  axiosClient.get(`filter.php?i=${ing}`)
    .then(({ data }) => {
      commit('setMealsByIngredients', data.meals)
    })
}

export function loadFavoriteMeals({ commit }) {
  const favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];
  commit('setFavoriteMeals', favoriteMeals);
}

export function addFavoriteMeal({ commit, state }, meal) {
  const updatedFavorites = [...state.favoriteMeals, meal];
  commit('setFavoriteMeals', updatedFavorites);
  localStorage.setItem('favoriteMeals', JSON.stringify(updatedFavorites));
}

export function removeFavoriteMeal({ commit, state }, mealId) {
  const updatedFavorites = state.favoriteMeals.filter(meal => meal.idMeal !== mealId);
  commit('setFavoriteMeals', updatedFavorites);
  localStorage.setItem('favoriteMeals', JSON.stringify(updatedFavorites));
}
