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
        const idAnime = data.results[i].mal_id;
        const itemList = `<li id='${idAnime}' class='js-itemList sectionRes__list--item'><img src="${imgAnime}"><p>${titleAnime}</p></li>`;
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

// Leo el localStorage
function getFromLocalStorage(){
  const localStorageData = localStorage.getItem('anime');
  console.log('Get funciona');
  if(localStorageData !== null){
    arrFavs = JSON.parse(localStorageData);
    console.log('No esta vacio, debo pintar');
    renderFavs2(arrFavs);
  }
}
getFromLocalStorage();

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
  // Guardo mis datos en un objeto
  let imgFav = fav.querySelector('img');
  let titleFav = fav.querySelector('p');
  let favObj = {
    name: titleFav.innerHTML,
    img: imgFav.src,
    id: fav.id
  };

  const idItem = favObj.id;
  let addFav = false;

  if(arrFavs.length === 0){
    // Si mi array esta vacio agrego el primer anime
    arrFavs.push(favObj);
  }else{
    // Si mi array no esta vacio lo recorro y hago comprobaciones
    for(let i = 0 ; i < arrFavs.length ; i++){
      if(arrFavs[i].id !== idItem){
        // Si el id del index es diferente al del item = no existe en mi array (quiero agregarlo)
        addFav = true;
      }else{
        // Si el id del index si coincide = ya existe en el array (no quiero volver a agregarlo)
        addFav = false;
        break;
      }
    }
    if(addFav === true){
      // Solo cuando esta variable es true agrego el item a mi array de favoritos
      arrFavs.push(favObj);
    }
  }
  return arrFavs;
}
function renderFavs2(arr){
  listFav.innerHTML = '';
  for(let i = 0 ; i < arr.length ; i++){
    listFav.innerHTML += `<li id='${arr[i].id}' class='js-itemFav sectionFav__list--item'><img src="${arr[i].img}"><p>${arr[i].name}</p><button class='js-deleteBtn sectionFav__list--btn'>Borrar</button></li>`;
  }
  // Añado el listener a los botones de borrar
  const deleteBtn = document.querySelectorAll('.js-deleteBtn');
  for(let i = 0 ; i < deleteBtn.length ; i++){
    deleteBtn[i].addEventListener('click', handlerClickDeleteFav);
  }
}

function setInLocalStorage(arrFavs){
  const stringifyArrFavs = JSON.stringify(arrFavs);
  localStorage.setItem('anime', stringifyArrFavs);
}

function handlerClickFav(event){
  // Añado clase favorit al elemento clicado
  const animeFav = event.currentTarget;
  animeFav.classList.add('favorit');

  // CAMINO 1:
  // Renderizo el elemento clicado en favoritos
  //const favorite = renderFavs(animeFav);
  // Guardo favorito en array
  //saveFavoriteArr(favorite);


  // CAMINO 2:
  // Convierto favorito en objeto y lo guardo en array
  const arrFavorites = saveFavorites(animeFav);
  // Guardo en localStorage
  setInLocalStorage(arrFavorites);

  // Renderizo el elemento clicado en favoritos
  renderFavs2(arrFavorites);

}

function handlerClickDeleteFav(event){
  console.log(event.currentTarget);
}

// Listeners
btnSearch.addEventListener('click', handlerClickSearch);

