const searchForm = document.querySelector("#searchForm");
const searchText = document.querySelector("#searchText");

//Start search movie on users input
searchForm.addEventListener('submit', inputForm);

function inputForm(e) {

  e.preventDefault();

  let searchTextValue = searchText.value;

  // Store search input value in Session Storage
  sessionStorage.setItem('movieName', searchTextValue);

  if (searchText.value === '') {
    alert('Search input is empty');
  }

  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.omdbapi.com/?s=' + searchText.value + '&apikey=3d7b82e0&', true);
  xhr.onload = function () {

    if (this.status == 200) {

      let movies = JSON.parse(this.response);
      let movie = movies.Search;
      let moviesLength = movies.Search.length;

      var output = '';
      for (let i = 0; i < moviesLength; i++) {

        if (movie[i].Poster == "N/A") {
          movie[i].Title = '';
          movie[i].Year = '';

        } else if (movie[i].Type != 'movie') {
          movie[i].Title = '';
          movie[i].Year = '';
        } else {
          /*   console.log(movie[i].Title + ' ' + movie[i].Year + ' ' + movie[i].Poster); */
          output += `
          <div class="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div class="card">
                  <img src="${movie[i].Poster}" class="card-img-top">
                  <div class="card-body d-flex flex-column justify-content-between">
                      <h5 class="card-title">${movie[i].Title}</h5>
                      <a onclick="movieSelected('${ movie[i].imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
                  </div>
              </div>
          </div> 
      `;
        }

      }

      document.getElementById('movies').innerHTML = output;

    }
  }
  xhr.send();

}

//  Function for auto search when user visit index.html 
//  from movie.html via Back to movie search button
//  function auto inserts priveous search from session 
//  storage and auto submits form  
function getUrlValue(movieName) {

  let url = new URL(window.location.href);
  let searchParams = new URLSearchParams(url.search);
  let searchParamsValue = searchParams.get('movieName');
  searchText.value = searchParamsValue;

  if (searchParamsValue != '') {
    /* ------------------- */
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://www.omdbapi.com/?s=' + searchText.value + '&apikey=3d7b82e0&', true);
    xhr.onload = function () {

      if (this.status == 200) {

        let movies = JSON.parse(this.response);
        let movie = movies.Search;
        let moviesLength = movies.Search.length;

        var output = '';
        for (let i = 0; i < moviesLength; i++) {

          if (movie[i].Poster == "N/A") {
            movie[i].Title = '';
            movie[i].Year = '';

          } else if (movie[i].Type != 'movie') {
            movie[i].Title = '';
            movie[i].Year = '';
          } else {
            /*  console.log(movie[i].Title + ' ' + movie[i].Year + ' ' + movie[i].Poster); */
            output += `
          <div class="col-lg-4 col-md-6 col-sm-12 mb-3">
              <div class="card">
                  <img src="${movie[i].Poster}" class="card-img-top">
                  <div class="card-body d-flex flex-column justify-content-between">
                      <h5 class="card-title">${movie[i].Title}</h5>
                      <a onclick="movieSelected('${ movie[i].imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
                  </div>
              </div>
          </div> 
      `;
          }

        }
        document.getElementById('movies').innerHTML = output;

      }
    }
    xhr.send();

    /* ------------------- */
  } else {
    alert("Input field is empty");
  }

}

getUrlValue();

//Function for Movie details button in index.html
function movieSelected(id) {
  //save Movie Id in session storage
  sessionStorage.setItem('movieID', id);
  window.location = 'movie.html';
  return false;
}

//Back in index.html with priveous input search to start aut search again
function backToMovieList(movieName) {

  window.location.href = 'index.html?movieName=' + movieName;

}
// Function for display individual movie info -> Movie Details button on index.html page
function getMovie() {
  //Get Movie ID from Session Storage
  let movieID = sessionStorage.getItem('movieID');
  //Get Movie Search input from Session Storage for button
  let movieName = sessionStorage.getItem('movieName');

  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://www.omdbapi.com/?i=' + movieID + '&apikey=3d7b82e0&', true);
  xhr.onload = function () {

    if (this.status == 200) {

      let movie = JSON.parse(this.response);
      let movieLength = movie.Ratings.length
      let output = '';

      console.log(movie);
      output += `
         <div class="row">
           <div class="col-md-4">
               <img src="${movie.Poster}" class="thumbnail">
           </div>
           <div class="col-md-8">
                <h2 class="mt-2">${movie.Title}</h2>
                <p class> ${movie.Genre} | ${movie.Released} | ${movie.Runtime}</p>
                <p class="">IMDB Rating: ${movie.imdbRating}</p>
                <p class="">Director: ${movie.Director}</p>
                <p class="">Actors: ${movie.Actors}</p>
                <p class="">Awards: ${movie.Awards}</p>
               <div class="card border-warning mr-4 mb-3">
                   <div class="card-body">
                       <h3>Plot</h3>
                       ${movie.Plot}
                       <hr>
                       <a href="http://imdb.com/title/${movie.imdbID}" 
                           target="_blank" class="btn btn-outline-primary">View IMDB</a>
                       <input onclick="backToMovieList('${movieName}')" class="btn btn-outline-info" value="Back To Movie Search">
                       <a href="index.html" class="btn btn-outline-danger">Start New Movie Search</a>
                    </div>
               </div>
           </div>
       </div>
       `,

        document.getElementById('movie').innerHTML = output;
    }
  }
  xhr.send();

}

