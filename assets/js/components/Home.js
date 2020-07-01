import React, { Component } from "react";
import {
  BrowserRouter,
  Route,
  Router,
  Link,
  NavLink,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";

class Home extends Component {
  componentDidMount() {
    this.props.setCurrentRoot(this.props.location.pathname);
  }

  render() {
    return (
      <section className="home">
        <div className="home__text">
          <h1 className="home__name">Cyrill Lehmann</h1>
          <h2 className="home__position">Web Developer</h2>
        </div>
        <Link
          to="/who"
          className="button home__anchorWho"
          onClick={(e) => this.props.gace(e, "who")}
        >
          who
        </Link>
        <a
          target="__blank"
          rel="noopener"
          href="https://cyrill-lehmann.ch/tutorials"
          className="button home__anchorTutorials"
          onClick={(e) => this.props.gace(e, "tutorials")}
        >
          tutorials
        </a>
        <Link
          to="/what"
          className="button home__anchorWhat"
          onClick={(e) => this.props.gace(e, "what")}
        >
          what
        </Link>
      </section>
    );
  }
}

export default withRouter(Home);
