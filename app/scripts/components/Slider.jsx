import React from 'react'
import ReactSlider from 'react-slider';

let Slider = React.createClass({

  getInitialState: function () {
    return { value: this.props.defaultValue }
  },

  onChange: function(value) {
    this.setState({ value: value });
    this.props.onChange(value);
  },

  render: function() {

    let handlers = null,
        values = null;

    if (this.state.value) {

      handlers = this.state.value.map(function (value, i) {
        return (
          <span key={i} className="slider__handle__value">
            { value }
          </span>
        );
      });

      values = `${this.state.value[0]}`;
      if (this.state.value[0] !== this.state.value[1]) {
        values += ` - ${this.state.value[1]}`;
      }

    }

    return (
      <div
        className={"slider slider--horizontal " + this.props.className}
      >
        <div className="slider__infos">
          <h3>{ this.props.title }</h3>
          <p>{ values }</p>
        </div>
        <ReactSlider
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          withBars
          defaultValue={this.props.defaultValue}
          snapDragDisabled
          pearling={true}
          orientation="horizontal"
          className="slider__range"
          barClassName={"slider__bar"}
          handleClassName={"slider__handle"}
          onChange={this.onChange}
          >
            { handlers }
        </ReactSlider>
      </div>
    );

  }

});

export default Slider;
