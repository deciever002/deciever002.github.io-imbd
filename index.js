//Grabbing necessary elements
let input = document.getElementById("searchInput");
let searchListMovies = document.getElementById("search-movies-list");
let searchButton = document.getElementById("search");
let homeContent = document.getElementById("home-content");
let movieListContainer = document.getElementById("movies-list-container");
let favoriteSection = document.getElementById("favorites");
let movieDescription = document.getElementById("movie-description");
let searchResultsMovies = document.getElementById("search-results-movies");
let goToFavoriteMovieBtn = document.querySelectorAll("#go-to-favorites");


//Once user clicks on Remove from favorite in favorite page remove it from html
function removeCard(movieId){
    //Get all the movie cards under favorite section
    let movieCards = document.querySelectorAll(".card");
    for(let card of movieCards){
        if(card.dataset.id == movieId){
            //Destroy this element or remove it from dom
            card.remove();
            return;
        }
    }
}

//When the user clicks on Remove from favorite in favorite page remove it from local storage and html as well
function setupRemoveFromFavoritePage(){
    let removeFavBtn = document.querySelectorAll('#remove-favorite');
    console.log(removeFavBtn);
    for(let btn of removeFavBtn){
        btn.addEventListener('click',(e) => {
            //If the local storage is empty then display there is no favorite movies
            let movies = JSON.parse(localStorage.getItem("moviesList"));
            let movieId = e.target.dataset.id;
            if(movies.length == 0){
                document.getElementById("favorite-movies").innerHTML = '<h1 class="display-3 text-center text-warning m-5" >There are no movies in favorite... Search Above and add a movie</h1>';
                return;
            }
            movies = movies.filter(id => id!=movieId);
            localStorage.setItem("moviesList",JSON.stringify(movies));
            //removes the movie card of the movie removed
            removeCard(movieId);
            //Display the message "There are no movies" after removing the card if the list is empty
            if(movies.length == 0){
                document.getElementById("favorite-movies").innerHTML = '<h1 class="display-3 text-center text-warning m-5" >There are no movies in favorite... Search Above and add a movie</h1>';
                return;
            }
        })
    }
}

// //Setup event listener for Go to favorites movie button
for(let favBtn of goToFavoriteMovieBtn){
    favBtn.addEventListener('click',async(e)=>{
        //Hiding the sections which are not required
        homeContent.classList.contains("visually-hidden") ? null : homeContent.classList.add("visually-hidden");
        movieListContainer.classList.contains("visually-hidden") ? null : movieListContainer.classList.add("visually-hidden");
        movieDescription.classList.contains("visually-hidden") ? null : movieDescription.classList.add("visually-hidden");
        //showing the necessary section
        favoriteSection.classList.remove("visually-hidden");
        let favoriteMovies = document.getElementById("favorite-movies");
        //Get Movie Ids from the local storage
        let movies = JSON.parse(localStorage.getItem("moviesList"));
        let favoriteMoviesCards = '';
        //If movie ids list is empty display there are no favorite movie
        if(movies == null || movies.length == 0 ){
            favoriteMovies.innerHTML = '<h1 class="display-3 text-center text-warning m-5" >There are no movies in favorite... Search Above and add a movie</h1>';
            return;
        }
        //fetch content and add a card pertaining to that movie
        for(let movieId of movies){
            favoriteMovies.innerHTML = '<h1 class="display-3 text-center text-warning m-5" >Loading...</h1>';
            let movieData = await fetchMovie(movieId);
            favoriteMovies.innerHTML = '';
            console.log(movieData);
            favoriteMoviesCards += `
            <div class="card" data-id=${movieData.imdbID} style="width: 18rem;margin: 5px;">
                <img src=${movieData.Poster} class="card-img-top" alt="${movieData.Title}" height="70%">
                <div class="card-body">
                    <h5 class="card-title">${movieData.Title}</h5>
                    <button id="remove-favorite" data-id = ${movieData.imdbID} href="#" class="btn btn-danger" >Remove From Favorite</button>
                </div>
            </div>`;
        }
        favoriteMovies.innerHTML = favoriteMoviesCards;
        //Function to add event listener to remove button
        setupRemoveFromFavoritePage();
        setupEventListenerForCardClick();
    });
}


//Setup event listeners for all the add/remove favorite button present in search results
function setupEventListenerForAddRemoveFavorite(){
    let addToFavoriteBtn = document.querySelectorAll('#add-remove-favorite');
    let movies = JSON.parse(localStorage.getItem("moviesList"));
    for(let btn of addToFavoriteBtn){
        if(movies!=null){
            //If movies are present in local storage then display remove from favorites only for movies that are there in local storage.
            let movieId = btn.dataset.id;
            if(movies.includes(movieId)){
                btn.innerText = "Remove from Favorites";
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-danger");
            }
        }
        btn.addEventListener('click',addRemoveMovieFromFavorite)
    }
    console.log(addToFavoriteBtn);
}

//Adds or Remove movie to favorite page
let addRemoveMovieFromFavorite = (event) => {
    let addRemoveFavBtn = event.target;
    let movieId = addRemoveFavBtn.dataset.id;
    let movies = JSON.parse(localStorage.getItem("moviesList"));
    console.log(movies);
    if(addRemoveFavBtn.innerText == "Add To Favorites"){
        //store this movie in local storage and display remove from favorites
        if(movies){
            //if movies list is found then update the list by adding this movie
            movies.push(movieId);
            localStorage.setItem("moviesList",JSON.stringify(movies));
        }else{
            //set a localstorage with key as movieList and add the id of this movie
            localStorage.setItem("moviesList",JSON.stringify([movieId]));
        }
        addRemoveFavBtn.innerText = "Remove from Favorites";
        addRemoveFavBtn.classList.replace("btn-primary","btn-danger");
        addRemoveFavBtn.classList.add("btn-danger");
    }else{
        //Remove this movie from local storage and display add to favorites
        //movies = movies
        movies = movies.filter(id => id!= movieId);
        localStorage.setItem("moviesList",JSON.stringify(movies));
        addRemoveFavBtn.innerText = "Add To Favorites";
        addRemoveFavBtn.classList.remove("btn-danger");
        addRemoveFavBtn.classList.add("btn-primary")
    }
    console.log("from add movie to favorite",event.target.dataset.id);
}

//Adding event listener on search button to show list of movies in a seprate page
searchButton.addEventListener('click',async(e) => {
    console.log(input.value);
    if(input.value && input.value.length > 2){
        //Hiding the sections which are not required
        homeContent.classList.contains("visually-hidden") ? null : homeContent.classList.add("visually-hidden");
        favoriteSection.classList.contains("visually-hidden") ? null : favoriteSection.classList.add("visually-hidden");
        movieDescription.classList.contains("visually-hidden") ? null : movieDescription.classList.add("visually-hidden");
        //showing the section required
        movieListContainer.classList.remove("visually-hidden");
        //Add the searched text in span (You have searched for span#id)
        let searchedText = document.getElementById("search-result-text");
        searchedText.innerHTML = input.value;
        searchResultsMovies.innerHTML = '<h1 class="display-3 text-center text-warning m-5" >Loading.....</h1>';
        //Fetch the search results and display them via cards
        let data = await fetchSearchResults(input.value);
        searchListMovies.innerHTML = '';
        let movieResults = '';
        if(data.Response.toLowerCase() == 'true'){
            for(let movie of data.Search){
                console.log(movie);
                movieResults += `
                    <div data-id=${movie.imdbID} class="card" style="width: 18rem;margin: 10px;">
                        <img src=${movie.Poster} class="card-img-top" alt="${movie.Title}" height="70%">
                        <div class="card-body">
                            <h5 class="card-title">${movie.Title}</h5>
                            <button id="add-remove-favorite" data-id = ${movie.imdbID} href="#" class="btn btn-primary" >Add To Favorites</button>
                        </div>
                    </div>`;
            }
            searchResultsMovies.innerHTML = movieResults;
            //Call to setup event listeners for buttons
            setupEventListenerForAddRemoveFavorite();
            setupEventListenerForCardClick();
            return;
        }else{
            alert("No movies found... try searching for another movie");
            return;
        }

    }
    else if(input.value && input.value.length <= 2){
        alert("Try searching movie with more than 2 characters");
        return;
    }
    else{
        alert("This field cannot be empty");
        return;
    }

})

//If the user clicks on movie card they should be redirected to movies page
function setupEventListenerForCardClick(){
    let movieCards = document.querySelectorAll('.card');
    console.log(movieCards);
    for(let movieCard of movieCards){
        movieCard.addEventListener('click',showMovieDescription);
    }
}

//Show the movie description when clicked on movie card
async function showMovieDescription(e){
    //Hide All the sections and show Movie Section 
    console.log("Movie Description Clicked");
    if(e.target.localName == "button"){
        return;
    } 
    //Hide the sections which are not required
    homeContent.classList.contains("visually-hidden") ? null : homeContent.classList.add("visually-hidden");
    favoriteSection.classList.contains("visually-hidden") ? null : favoriteSection.classList.add("visually-hidden");
    movieListContainer.classList.contains("visually-hidden") ? null : movieListContainer.classList.add("visually-hidden");
    //show only the movie description section 
    movieDescription.classList.remove("visually-hidden");
    let movieDetailsContainer = document.getElementById("movie-details");

    //If movie id in data attribute for current element is not found then check for its parent element
    let movieId = e.target.dataset.id;
    if(movieId == null){
        let element = e.target;
        while(element.dataset.id == null){
            element = element.parentElement;
        }
        movieId = element.dataset.id;
    }
    console.log("Movie Id",movieId);
    //Show loader added new loader
    movieDetailsContainer.innerHTML = '<div class="spinner-grow text-info" role="status"><span class="visually-hidden">Loading...</span></div>';
    let movie = await fetchMovie(movieId);
    console.log(movie);
    //Add the description of movie
    movieDetailsContainer.innerHTML = `
        <div style="width:40%">
            <img src=${movie.Poster} alt="${movie.Title}" height="70%">
        </div>
        <div style="width: 60%;">
            <h1 class="display-4">${movie.Title}</h1>
            <p class="lead">${movie.Plot}</p>
            <hr class="my-4">
            <p>Director: <b><i>${movie.Director}</i></b></p>
            <p>Released: <b><i>${movie.Released}</i></b></p>
            <p>Language: <b><i>${movie.Language}</i></b></p>
            <p>Box Office: <b><i>${movie.BoxOffice}</i></b></p>
            <p>Year: <b><i>${movie.Year}</i></b></p>
            <p class="lead">
                <a id="add-remove-favorite" data-id = ${movie.imdbID} class="btn btn-primary btn-lg" href="#" role="button">Add To Favorites</a>
            </p>
        </div>
    `;
    searchListMovies.classList.add("visually-hidden");
    input.classList.remove("search-results");
    setupEventListenerForAddRemoveFavorite();
}

//If the user clicks on a particular movie then it should be redirected to that movie
function setupEventListenerOnSearchList(){
    let searchListItems = document.querySelectorAll('#search-list-item');
    console.log(searchListItems);
    for(let searchListItem of searchListItems){
        searchListItem.addEventListener('click',showMovieDescription);
    }
}

//Adding event listener on input to show the movie results 
//Once the user types in the search text OMDB API is called to fetch the data based on the search input
input.addEventListener('keyup',async(e) => {
    input.classList.add('search-results');
    searchListMovies.classList.remove("visually-hidden");
    console.log(searchListMovies);
    let searchText = e.target.value;
    let data = null;
    let movieResults = '';
    //If there is nothing in input hide the search result list
    if(searchText.length == 0){
        searchListMovies.classList.add("visually-hidden");
        input.classList.remove("search-results");
    }
    //User should type atleast more than 2 characters to view the result
    if(searchText.length > 2){
        searchListMovies.innerHTML = "<li>Loading....</li>"
        data = await fetchSearchResults(searchText);
        searchListMovies.innerHTML = ""
    }else{
        searchListMovies.innerHTML = "<li>Type more than 2 characters to fetch movie....</li>";
        return;
    }
    //If data is found then add the list to the search result list
    if(data.Response.toLowerCase() == 'true'){
        for(let movie of data.Search){
            movieResults += `<li id="search-list-item" data-id=${movie.imdbID}> ${movie.Title} </li>`;
        }
        searchListMovies.innerHTML = movieResults;
        setupEventListenerOnSearchList();
    }
    //In case there are no results found
    else if(searchText.length > 2 && data.Response.toLowerCase() == 'false'){
        searchListMovies.innerHTML = "<li>No Results found...</li>"
    }
});

//Hide the searchbox if the user doesn't want to search for movie
window.addEventListener('click',(e) => {
    if(!searchListMovies.contains(e.target)){
        searchListMovies.classList.add("visually-hidden");
        input.classList.remove("search-results");
    }
})

//API Related Stuff(Secret and URL)
const API_SECRET = 'afcc3f6b';
const API_URL = `https://www.omdbapi.com/?apikey=${API_SECRET}`;


//Function to fetch the movies based on the search text given
async function fetchSearchResults(searchText){
    let response = await fetch(API_URL + "&s=" + searchText);
    var data = await response.json();
    return data;
}

//Function to fetch the movies based on the imdb title
async function fetchMovie(id){
    let response = await fetch(API_URL + "&i=" + id);
    var data = await response.json();
    return data;
}
