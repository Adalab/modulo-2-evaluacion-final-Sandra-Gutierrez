'use strict';
console.log('>> Ready :)');

// HTML elements
const inputText = document.querySelector('.js-inputText');
const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const listFav = document.querySelector('.js-listFav');
const listRes = document.querySelector('.js-listRes');

// Functions
function handlerClickSearch(event){
  event.preventDefault();
  console.log('Funciona');
}


// Listeners
btnSearch.addEventListener('click', handlerClickSearch);

