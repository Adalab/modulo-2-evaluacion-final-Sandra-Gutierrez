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
}

function handlerClickFav(event){
  const animeFav = event.currentTarget;
  // Añado clase favorit al elemento clicado
  animeFav.classList.add('favorit');
  // Renderizo el elemento clicado en favoritos
  renderFavs(animeFav);
}

// Listeners
btnSearch.addEventListener('click', handlerClickSearch);

