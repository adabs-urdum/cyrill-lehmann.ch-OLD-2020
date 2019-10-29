import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Router, Link, NavLink, Switch, Redirect, withRouter } from 'react-router-dom';
import Head from '../components/head.js';
import Home from '../components/Home.js';
import Who from '../components/Who.js';
import What from '../components/What.js';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentRoot: '/',
      body: document.getElementById('body'),
    };
  }

  setCurrentRoot = (rootName) => {
    rootName = rootName.replace('/', '');
    this.setState({
      currentRoot: rootName
    }, () => {
      this.state.body.classList = this.state.currentRoot
    });
  }

  render(){

    return (
      <Fragment>
        <BrowserRouter>
          <Switch>
            <Route path="/who" render={() => (
              <Who
                setCurrentRoot = { this.setCurrentRoot }
              />
            )} />
            <Route path="/what" render={() => (
              <What
                setCurrentRoot = { this.setCurrentRoot }
              />
            )} />
            <Route path="/" render={() => (
              <Home
                setCurrentRoot = { this.setCurrentRoot }
              />
            )} />
          </Switch>
        </BrowserRouter>
        <Head />
      </Fragment>
    );

  }
}

export default App;
