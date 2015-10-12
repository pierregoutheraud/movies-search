import React from 'react';
import ReactSlider from 'react-slider';

let Home = React.createClass({

  render: function() {

    let rankingsOptions = [];
    for(let i=1;i<10;i++) {
      rankingsOptions.push(
        <option>{i}+</option>
      );
    }

    let fromOptions = [];


    return (
      <div className="app">

        <div className="sidebar">

        <fieldset>
          <input type="text" placeholder="title"/>
        </fieldset>

        <fieldset>
          <select>
            <option>genre</option>
          </select>
        </fieldset>

        <fieldset>
          <ReactSlider
            defaultValue={[0, 100]}
            withBars
            className="horizontal-slider"
          />
        </fieldset>

        <fieldset>
          <input type="text" placeholder="with"/>
        </fieldset>

        <fieldset>
          <select>
            <option>Sort by</option>
          </select>
        </fieldset>

        <fieldset>
          <select>
            <option>From</option>
          </select>
        </fieldset>

        <fieldset>
          <select>
            <option>to</option>
          </select>
        </fieldset>

        </div>

        <div className="movies">

          <ul></ul>

        </div>

      </div>
    );

  }

});

export default Home;
