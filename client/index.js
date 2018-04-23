import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
require('dotenv').config();
import Routes from './routes';

ReactDOM.render(
  <HashRouter>
    <Routes />
  </HashRouter>, document.getElementById('root')
);
