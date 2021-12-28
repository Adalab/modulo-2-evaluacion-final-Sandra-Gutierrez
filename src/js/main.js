'use strict';
console.log('>> Ready :)');

// HTML elements
const inputText = document.querySelector('.js-inputText');
const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const listFav = document.querySelector('.js-listFav');
const listRes = document.querySelector('.js-listRes');
let anime = '';

// Functions
function takeField(){
  const nameAnime = inputText.value;
  return nameAnime;
}

function getAnimeResults(){
  listRes.innerHTML = '';
  fetch(`https://api.jikan.moe/v3/search/anime?q=${anime}`)
    .then( (response) => response.json() )
    .then( (data) => {
      let arrResults = data.results;
      console.log(arrResults);
      // Renderizo en HTM la portada y el titulo
      for(let i = 0; i < arrResults.length ; i++){
        const imgAnime = data.results[i].image_url;
        const titleAnime = data.results[i].title;
        const itemList = `<li><img src="${imgAnime}"><p>${titleAnime}</p></li>`;
        listRes.innerHTML += itemList;
      }
    });
}

function handlerClickSearch(event){
  event.preventDefault();
  // Recojo el nombre de la serie
  anime = takeField();
  console.log(anime);

  // Petición fetch a la API
  getAnimeResults();
}


// Listeners
btnSearch.addEventListener('click', handlerClickSearch);

