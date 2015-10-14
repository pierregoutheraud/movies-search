import React from 'react';
import Slider from './components/Slider.jsx';
import request from 'superagent';
import Autosuggest from 'react-autosuggest';

let Home = React.createClass({

  getInitialState: function() {

    let defaultState = {
      imdb: [0,10],
      dates: [1900,2016]
    };

    let state = window.location.hash.replace('#', '') || null;

    if (state) {
      state = JSON.parse(state);
      for (var key in defaultState) if (state.hasOwnProperty(key)) defaultState[key] = state[key]; // Merge two objects
    }

    console.log(defaultState);

    return defaultState;
  },

  componentWillMount: function() {
    this.timeoutSaveURL = null;
  },


  getSuggestions: function(input, callback) {
    const suburbs = ['Cheltenham', 'Mill Park', 'Mordialloc', 'Nunawading'];
    const regex = new RegExp('^' + input, 'i');
    const suggestions = suburbs.filter(suburb => regex.test(suburb));
    callback(null, suggestions);
    // setTimeout(() => callback(null, suggestions), 300); // Emulate API call
  },

  onChangeDate: function(values) {
    // this.setState({
    //   dates: values
    // });
    this.saveURL({dates: values});
  },

  onChangeIMDBranking: function(values) {
    // this.setState({
    //   imdb: values
    // });
    this.saveURL({imdb: values});
  },

  saveURL: function(object) {
    clearTimeout(this.timeoutSaveURL);
    this.timeoutSaveURL = setTimeout(() => {
      console.log('state saved to url');
      let json = window.location.hash.replace('#','');
      if (json)
        json = JSON.parse(json);
      else json = {};
      for (var key in object)
        json[key] = object[key];
      window.location.hash = JSON.stringify(json);
    }, 1000);
  },

  render: function() {

    console.log('Home Render');

    return (
      <div className="app">

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

        <div className="movies">

          <ul></ul>

        </div>

      </div>
    );

  }

});

export default Home;
