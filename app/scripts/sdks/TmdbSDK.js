import request from 'superagent';
import _ from 'underscore';

class TmdbSDK {

  constructor () {
    this.genres = {};
  }

  getApiKey() {
    return '?api_key=1dafeeb8a6633e80399bd6c764873dd1'
  }

  fetchGenres (callback) {
    return new Promise((resolve, reject) => {
      let url = 'http://api.themoviedb.org/3/genre/movie/list' + this.getApiKey();
      new request
        .get(url)
        .end((err, res) => {
          let genres = res.body.genres;
          genres.forEach((genre) => { this.genres[genre.id] = genre.name; }); // Create this.genres
          resolve(genres);
        });
    });
  }

  discover (state, callback) {
    console.log('discover');
    // return new Promise((resolve, reject) => {
      let url = 'http://api.themoviedb.org/3/discover/movie' + this.getApiKey();

      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth()+1;
      let yyyy = today.getFullYear();

      let dateLte = state.dates[1] === yyyy ? state.dates[1] + `-${mm}-${dd}` : state.dates[1] + '-12-31';

      let ratingMin = state.imdb[0];
      let ratingMax = state.imdb[1];

      console.log('ratingMin ' + ratingMin);
      console.log('ratingMax ' + ratingMax);

      new request
        .get(url)
        .query({
          // 'vote_average.gte': state.imdb[0],
          // 'vote_average.lte': state.imdb[1],
          'primary_release_date.gte': state.dates[0] + '-01-01',
          'primary_release_date.lte': dateLte,
          'sort_by': 'release_date.desc',
          'page': state.page
          // 'primary_release_date.lte': `${yyyy}-${mm}-${dd}`
        })
        .end((err, res) => {
          let movies = res.body.results;

          movies.forEach((movie,i) => {
            let genres = [];
            movie.genre_ids.forEach((genre_id,i) => {
              genres.push( this.genres[genre_id] );
            });
            movie.genres = genres;
            this.fetchImdbRating(movie).then((rating) => {
              movie.imdbRating = rating;
              // if (rating && ( rating >= ratingMin && rating <= ratingMax ))
                callback(movie);
            });
          });

          // if (state.page < 100) {
          //   state.page++;
          //   this.discover(state, callback);
          // }

          // resolve(movies);
        });
    // });
  }

  fetchImdbRating (movie) {
    // console.log('fetchImdbRating', movie.original_title);
    return new Promise((resolve, reject) => {
    new request
      .get('http://www.omdbapi.com/')
      .query({
        t: movie.original_title
      })
      .end((err, res) => {
        if (res.body.Title !== movie.original_title) return false; // not the good one
        let rating = res.body.imdbRating || null;
        if (rating === 'N/A') rating = null;
        movie.imdbURL = 'http://www.imdb.com/title/' + res.body.imdbID;
        resolve(rating);
      });
    });

  }

}

export default new TmdbSDK();
