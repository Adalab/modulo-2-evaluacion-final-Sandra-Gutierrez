'use strict';
console.log('>> Ready :)');

// HTML elements
const inputText = document.querySelector('.js-inputText');
const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const listFav = document.querySelector('.js-listFav');
const listRes = document.querySelector('.js-listRes');
let anime = '';
let arrFavs = [];

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
      // Renderizo en HTML la portada y el titulo
      for(let i = 0; i < arrResults.length ; i++){
        const imgAnime = data.results[i].image_url;
        const titleAnime = data.results[i].title;
        const itemList = `<li class='js-itemList sectionRes__list--item'><img src="${imgAnime}"><p>${titleAnime}</p></li>`;
        listRes.innerHTML += itemList;
      }
      // Añado evento click a los elementos de mi lista
      const itemLi = document.querySelectorAll('.js-itemList');
      for(let i = 0 ; i < itemLi.length ; i++){
        itemLi[i].addEventListener('click', handlerClickFav);
      }
    });
}

function handlerClickSearch(event){
  event.preventDefault();
  // Recojo el nombre de la serie
  anime = takeField();
  // Petición fetch a la API + Renderizar resultados
  getAnimeResults();
}

// CAMINO 1:
function renderFavs(fav){
  // Clono el nodo fav
  const itemFav = fav.cloneNode(true);
  // Crear boton borrar
  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('class', 'js-deleteBtn');
  const contentBtn = document.createTextNode('Borrar');
  deleteBtn.appendChild(contentBtn);
  // Añadir boton borrar al item
  itemFav.appendChild(deleteBtn);
  // Añado el item clonado a mi lista de favoritos
  listFav.appendChild(itemFav);
  // Retorno el item
  return itemFav;
}
function saveFavoriteArr(animeFav){
  console.log(animeFav);
  arrFavs.push(animeFav);
  console.log(arrFavs);
}

// CAMINO 2:
function saveFavorites(fav){
  arrFavs.push(fav);
  return arrFavs;
}
function renderFavs2(arr){
  listFav.innerHTML = '';
  for(let i = 0 ; i < arr.length ; i++){
    listFav.innerHTML += arr[i].innerHTML;
  }
}

function handlerClickFav(event){
  // Añado clase favorit al elemento clicado
  const animeFav = event.currentTarget;
  animeFav.classList.add('favorit');

  //CAMINO 1:
  // Renderizo el elemento clicado en favoritos
  //const favorite = renderFavs(animeFav);
  // Guardo favorito en array
  //saveFavoriteArr(favorite);
  // Guardo array en localStorage

  // CAMINO 2:
  // Guardo favorito en array
  const arrFavorites = saveFavorites(animeFav);
  // Renderizo el elemento clicado en favoritos
  renderFavs2(arrFavorites);
}

// Listeners
btnSearch.addEventListener('click', handlerClickSearch);

