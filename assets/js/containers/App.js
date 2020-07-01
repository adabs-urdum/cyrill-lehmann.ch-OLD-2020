import axios from "axios";
import React, { Component, Fragment } from "react";
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
import Head from "../components/Head.js";
import Home from "../components/Home.js";
import Who from "../components/Who.js";
import What from "../components/What.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRoot: "",
      psychoMode: false,
      body: document.getElementById("body"),
      html: document.getElementById("html"),
      isIeEdge: document.documentMode || /Edge\//.test(navigator.userAgent),
      projects: null,
      projectsReady: false,
    };
  }

  componentDidMount() {
    const fetchUrl =
      window.location.hostname == "localhost"
        ? "https://api.adabs.ch.test"
        : "https://api.adabs.ch";

    axios.get(fetchUrl + "/projects/").then((response) => {
      const projectsData = response.data.projects;
      const projects = [];
      projectsData.forEach((project) => {
        projects.push({
          name: project.title,
          tags: project.tags,
          description: project.description,
          link: project.linkout,
          imageSrc: project.image.url,
          imageSrcset: project.image.srcset,
        });
      });

      this.setState({
        projects: projects,
        projectsReady: true,
      });
    });
  }

  setCurrentRoot = (rootName) => {
    rootName = rootName.replace("/", "");
    this.setState(
      {
        currentRoot: rootName,
      },
      () => {
        this.state.body.classList = this.state.currentRoot;
      }
    );
  };

  setPsychoMode = () => {
    this.setState(
      {
        psychoMode: !this.state.psychoMode,
      },
      () => {
        const className = this.state.psychoMode ? "psycho" : "";
        this.state.html.classList = className;
      }
    );
  };

  render() {
    const internetExplorerWarning = (
      <h3 className="internetExplorerWarning">
        why don't you use a good browser. like chrome or something.
      </h3>
    );

    return (
      <Fragment>
        {this.state.isIeEdge ? internetExplorerWarning : null}
        <BrowserRouter>
          <Switch>
            <Route
              path="/who"
              render={() => <Who setCurrentRoot={this.setCurrentRoot} />}
            />
            <Route
              path="/what"
              render={() => (
                <What
                  setCurrentRoot={this.setCurrentRoot}
                  projects={this.state.projects}
                  ready={this.state.projectsReady}
                />
              )}
            />
            <Route
              path="/"
              render={() => <Home setCurrentRoot={this.setCurrentRoot} />}
            />
          </Switch>
        </BrowserRouter>
        <Head
          psychoMode={this.state.psychoMode}
          setPsychoMode={this.setPsychoMode}
        />
      </Fragment>
    );
  }
}

export default App;
