"use strict";

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';

Array.prototype.getRandomValue = (inputArray) => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

document.addEventListener("DOMContentLoaded", function(){
  ReactDOM.render(<App />, document.getElementById('root'));
});
