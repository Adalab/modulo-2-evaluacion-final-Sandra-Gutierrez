'use strict';
console.log('>> Ready :)');

// HTML ELEMENTS:
const inputText = document.querySelector('.js-inputText');
const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const listFav = document.querySelector('.js-listFav');
const listRes = document.querySelector('.js-listRes');
let anime = '';
let arrFavs = [];
let arrResults;

// FUNCTIONS:
// Leo localStorage y renderizo favs si al cachear encuentro favs
function getFromLocalStorage(){
  const localStorageData = localStorage.getItem('anime');
  if(localStorageData !== null){
    arrFavs = JSON.parse(localStorageData);
    renderFavs(arrFavs);
  }
}
getFromLocalStorage();


function handlerClickReset(event){
  event.preventDefault();
  // Inicializo mi array de favs
  arrFavs = [];
  // Vuelvo a renderizar favoritos
  renderFavs(arrFavs);
  // Actualizo el localStorage
  setInLocalStorage(arrFavs);
}


function handlerClickDeleteFav(event){
  // Consigo el id del item clicado
  const elementDeleteFav = event.currentTarget.parentElement;
  const idDeleteFav = elementDeleteFav.id;
  // Recorro mi array de favs comprobando el id
  for(let i = 0 ; i < arrFavs.length ; i++){
    if(idDeleteFav === arrFavs[i].id){ // Borro el item que tenga ese id de mi array de favs
      arrFavs.splice(i, 1);
      break;
    }
  }
  // Busco en mi array de resultados el elemento con ese id
  for(let i = 0 ; i < arrResults.length ; i++){
    let idFavorite = parseInt(idDeleteFav);
    if(idFavorite === arrResults[i].mal_id){ // Elimino la clase favorit del item en resultados
      console.log(arrResults[i].mal_id);
      console.log(arrResults[i]);
      //arrResults[i].classList.remove('favorit');
      break;
    }
  }
  // Vuelvo a renderizar favoritos
  renderFavs(arrFavs);
  // Actualizo el localStorage
  setInLocalStorage(arrFavs);

}


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

  // Compruebo si mi elemento tiene la clase favorit
  if(fav.classList.contains('favorit')){ // Si la tiene, agrego a mi array de favs
    if(arrFavs.length === 0){ // Si mi array esta vacio agrego el primer item
      arrFavs.push(favObj);
    }else{ // Si mi array NO esta vacio, lo recorro y hago comprobaciones
      for(let i = 0 ; i < arrFavs.length ; i++){
        if(arrFavs[i].id !== idItem){ // Si el id del index es diferente al del item = no existe en mi array (quiero agregarlo)
          addFav = true;
        }else{ // Si el id del index si coincide = ya existe en el array (no quiero volver a agregarlo)
          addFav = false;
          break;
        }
      }
      if(addFav === true){ // Solo cuando es true agrego el item a mi array de favoritos
        arrFavs.push(favObj);
      }
    }
  }else{ // Si no la tiene elimino de mi array de favs
    console.log('No es fav');
    for(let i = 0 ; i < arrFavs.length ; i++){
      if(favObj.id === arrFavs[i].id){ // Borro el item que tenga ese id de mi array de favs
        arrFavs.splice(i, 1);
        break;
      }
      // Vuelvo a renderizar favoritos
      renderFavs(arrFavs);
      // Actualizo el localStorage
      setInLocalStorage(arrFavs);
    }
  }

  return arrFavs;
}

function setInLocalStorage(arrFavs){
  const stringifyArrFavs = JSON.stringify(arrFavs);
  localStorage.setItem('anime', stringifyArrFavs);
}

function renderFavs(arr){
  listFav.innerHTML = '';
  for(let i = 0 ; i < arr.length ; i++){
    listFav.innerHTML += `<li id='${arr[i].id}' class='js-itemFav sectionFav__list--item'><img src="${arr[i].img}"><p>${arr[i].name}</p><i class="fas fa-times-circle js-deleteBtn sectionFav__list--btn"></i></li>`;
  }
  // Añado el listener a los botones de borrar
  const deleteBtn = document.querySelectorAll('.js-deleteBtn');
  for(let i = 0 ; i < deleteBtn.length ; i++){
    deleteBtn[i].addEventListener('click', handlerClickDeleteFav);
  }
}

function handlerClickFav(event){
  // Añado clase favorit al elemento clicado
  const animeFav = event.currentTarget;
  animeFav.classList.toggle('favorit');
  // Convierto favorito en objeto y lo guardo en array
  const arrFavorites = saveFavorites(animeFav);
  // Guardo en localStorage
  setInLocalStorage(arrFavorites);
  // Renderizo el elemento clicado en favoritos
  renderFavs(arrFavorites);
}


function takeField(){
  const nameAnime = inputText.value;
  return nameAnime;
}

function getAnimeResults(){
  listRes.innerHTML = '';
  fetch(`https://api.jikan.moe/v3/search/anime?q=${anime}`)
    .then( (response) => response.json() )
    .then( (data) => {
      arrResults = data.results;
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

// LISTENERS
btnSearch.addEventListener('click', handlerClickSearch);
btnReset.addEventListener('click', handlerClickReset);