import axios from "axios";
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

class What extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    this.props.setCurrentRoot(this.props.location.pathname);

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
        ready: true,
      });
    });
  }

  render() {
    const projectsJsx = this.state.projects
      ? this.state.projects.map((project) => {
          const tagsJsx = project.tags.map((tag) => {
            return (
              <li className="what__tagListEntry" key={tag.replace(" ", "")}>
                {tag}
              </li>
            );
          });

          return (
            <li className="what__listEntry" key={project.name.replace(" ", "")}>
              <canvas className="what__canvas" width="16" height="9"></canvas>
              <a
                className="what__project"
                target="__blank"
                rel="noopener"
                href={project.link}
              >
                <img
                  className="what__projectImage"
                  src={project.imageSrc}
                  srcSet={project.imageSrcset}
                  sizes="(max-width: 500px) 80vw, 70vw"
                />
                <div className="what__projectContent">
                  <h2 className="what__projectName">{project.name}</h2>
                  <p className="what__projectDescription">
                    {project.description}
                  </p>
                  <ul className="what__tagList">{tagsJsx}</ul>
                </div>
              </a>
            </li>
          );
        })
      : null;

    return (
      <section className="what">
        <Link to="/" className="button what__anchorBack">
          back
        </Link>
        <ul className={this.state.ready ? "what__list ready" : "what__list"}>
          {projectsJsx}
        </ul>
      </section>
    );
  }
}

export default withRouter(What);
