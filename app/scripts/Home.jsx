import React from 'react';
import Slider from './components/Slider.jsx';
import request from 'superagent';
import Autosuggest from 'react-autosuggest';
import tmdbSDK from './sdks/TmdbSDK.js';
import _ from 'underscore';

let Home = React.createClass({

  getInitialState: function() {

    let defaultState = {
      movies: [],
      imdb: [0,10],
      dates: [1900,new Date().getFullYear()],
      page: 1
    };

    let state = window.location.hash.replace('#', '') || null;

    if (state) {
      state = JSON.parse(state);
      for (let key in defaultState) if (state.hasOwnProperty(key)) defaultState[key] = state[key]; // Merge two objects
    }

    return defaultState;
  },

  componentWillMount: function() {
    this.timeoutRefresh = null;
    this.fetchGenres();
  },

  fetchGenres: function() {
    tmdbSDK.fetchGenres().then((genres) => {
      this.setState({genres});
      this.refresh(true); // First refresh
    });
  },

  refresh: function(direct=false) {

    let fetch = () => {
      console.log('refresh --> fetch()');
      this.setState({ movies: [] }); // reset movies state
      tmdbSDK.discover(this.state, (movie) => {
        this.addMovie(movie);
      });
      // this.saveURL();
    }

    if (direct)
      fetch();
    else {
      clearTimeout(this.timeoutRefresh);
      this.timeoutRefresh = setTimeout(fetch, 1000);
    }

  },

  addMovie: function(movie) {
    let movies = this.state.movies;
    movies.push(movie);
    this.setState({
      movies
    });
  },

  getSuggestions: function(input, callback) {
    const suburbs = ['Cheltenham', 'Mill Park', 'Mordialloc', 'Nunawading'];
    const regex = new RegExp(input, 'ig');
    const suggestions = suburbs.filter(suburb => regex.test(suburb));
    callback(null, suggestions);
    // setTimeout(() => callback(null, suggestions), 300); // Emulate API call
  },

  onChangeDate: function(values) {
    this.setState({
      dates: values
    }, () => {
      this.refresh();
    });
  },

  onChangeIMDBranking: function(values) {
    this.setState({
      imdb: values
    }, () => {
      this.refresh();
    });
  },

  saveURL: function(object) {
    // clearTimeout(this.timeoutSaveURL);
    // this.timeoutSaveURL = setTimeout(() => {
      console.log('state saved to url');
      let json = window.location.hash.replace('#','');
      if (json)
        json = JSON.parse(json);
      else json = {};

      let state = this.state;
      let whitelist = [
        'dates', 'imdb'
      ];

      state = _.pick(state, whitelist);

      for (let key in state) {
        json[key] = state[key];
      }
      window.location.hash = JSON.stringify(json);
    // }, 1000);
  },

  render: function() {

    console.log('Home Render');

    let genresOptions = null;
    if (this.state.genres) {
      genresOptions = this.state.genres.map((genre,i) => {
        return <option key={i} >{ genre.name }</option>
      });
    }

    let movies = null;
    if (this.state.movies) {
      movies = this.state.movies.map((movie,i) => {
        // console.log(movie);
        let posterURL = '';
        if ( movie.poster_path ) posterURL = `http://image.tmdb.org/t/p/w500${movie.poster_path}`;
        let stylePoster = {
          backgroundImage: `url('${posterURL}')`
        };
        let year = movie.release_date.substring(0,4);

        let genre = null;
        if (movie.genres) {
          genre = <span><span className="sep">/</span> {movie.genres[0]}</span>;
        }

        let rating = null;
        if (movie.imdbRating) {
          rating = <div className="movie__rank"><span className="movie__rank__imdb">IMDb</span> { movie.imdbRating }<span className="movie__rank__ten">/ 10</span></div>;
        }

        return (
          <a href={ movie.imdbURL } target="_blank" className="movie" key={"movie"+i}>
            { rating }
            <div className="movie__poster" style={stylePoster} ></div>
            <div className="movie__infos">
              <p className="movie__infos__title clamp-css" title={movie.original_title} >{movie.original_title}</p>
              <p className="movie__infos__sub" >{year} {genre}</p>
            </div>
          </a>
        );
      });
    }

    return (
      <div className="app__content">

        <div className="sidebar">

          <h1 className="sidebar__logo">Movies Search</h1>

          <div className="sidebar__filters">

            <h2>Filters</h2>

            <fieldset>
              <input type="text" placeholder="Movie title" className="input" />
            </fieldset>

            <fieldset>
              <Slider
                min={1900}
                max={2015}
                step={1}
                title="Released years"
                defaultValue={this.state.dates}
                onChange={this.onChangeDate}
              />
            </fieldset>

            <fieldset>
              <Slider
                title="IMDB Ranking"
                min={1}
                max={10}
                step={1}
                defaultValue={this.state.imdb}
                onChange={this.onChangeIMDBranking}
              />
            </fieldset>

            <fieldset>
              <select className="input" >
                <option>Genre</option>
                { genresOptions }
              </select>
            </fieldset>

            <fieldset>
              <Autosuggest
                suggestions={this.getSuggestions}
              />
            </fieldset>

            <fieldset>
              <input type="text" placeholder="Director" className="input"/>
            </fieldset>
          </div>

        </div>

        <div className="content">

          <div className="movies">
            { movies }
          </div>

        </div>

      </div>
    );

  }

});

export default Home;
