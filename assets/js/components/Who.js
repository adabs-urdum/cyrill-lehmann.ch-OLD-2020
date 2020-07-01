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

class Who extends Component {
  componentDidMount() {
    this.props.setCurrentRoot(this.props.location.pathname);
  }

  render() {
    return (
      <section className="who">
        <Link
          to="/"
          className="button who__anchorBack"
          onClick={(e) => this.props.gace(e, "home")}
        >
          back
        </Link>
        <ul className="who__list">
          <li className="who__listEntry">based in chur, switzerland</li>
          <li className="who__listEntry">
            spending most of my days at{" "}
            <a
              href="https://clus.ch"
              rel="noopener"
              target="__blank"
              onClick={(e) => this.props.gace(e, "clus.ch")}
            >
              clus.ch
            </a>
          </li>
          <li className="who__listEntry">
            doing my own thing under Lehmann Webentwicklung
          </li>
          <li className="who__listEntry">
            been having fun with django, laravel, css, react, babylon,
            raspberrypi,
            <br />
            wordpress, processwire, codeigniter, three and other stuff
          </li>
          <li className="who__listEntry">
            interested in skis, salad, cheese, detective conan and even more
          </li>
          <li className="who__listEntry">
            fluent in german, english and mandarin
          </li>
          {/* <li className="who__listEntry">
            no religion, racism, fascism or any ignorance which leads to one of
            those
          </li> */}
          <li className="who__listEntry">feel free to reach out</li>
        </ul>
        <ul className="home__contactList">
          <li className="home__contactEntry">
            <a
              href="https://github.com/adabs-urdum"
              target="__blank"
              rel="noopener"
              className="home__contactAnchor"
              onClick={(e) => this.props.gace(e, "github")}
            >
              github
            </a>
          </li>
          <li className="home__contactEntry">
            <a
              href="https://codepen.io/adabs-urdum"
              target="__blank"
              rel="noopener"
              className="home__contactAnchor"
              onClick={(e) => this.props.gace(e, "codepen")}
            >
              codepen
            </a>
          </li>
          <li className="home__contactEntry">
            <a
              href="mailto:cyrill@adabs.ch"
              className="home__contactAnchor"
              onClick={(e) => this.props.gace(e, "mail")}
            >
              email
            </a>
          </li>
          <li className="home__contactEntry">
            <a
              href="https://www.instagram.com/adabs_urdum/"
              target="__blank"
              rel="noopener"
              className="home__contactAnchor"
              onClick={(e) => this.props.gace(e, "instagram")}
            >
              instagram
            </a>
          </li>
          <li className="home__contactEntry">
            <a
              href="https://www.linkedin.com/in/adabs-urdum"
              target="__blank"
              rel="noopener"
              className="home__contactAnchor"
              onClick={(e) => this.props.gace(e, "linkedin")}
            >
              linkedin
            </a>
          </li>
          <li className="home__contactEntry">
            <a
              href="https://www.patreon.com/user/creators?u=5977648"
              target="__blank"
              rel="noopener"
              className="home__contactAnchor"
              onClick={(e) => this.props.gace(e, "patreon")}
            >
              patreon
            </a>
          </li>
          <li className="home__contactEntry">
            <a
              href="https://www.udemy.com/user/cyrill-lehmann/"
              target="__blank"
              rel="noopener"
              className="home__contactAnchor"
              onClick={(e) => this.props.gace(e, "udemy")}
            >
              udemy
            </a>
          </li>
          <li className="home__contactEntry">
            <a
              href="https://cssbattle.dev/player/adabs"
              target="__blank"
              rel="noopener"
              className="home__contactAnchor"
              onClick={(e) => this.props.gace(e, "cssbattle")}
            >
              cssbattle
            </a>
          </li>
        </ul>
      </section>
    );
  }
}

export default withRouter(Who);
