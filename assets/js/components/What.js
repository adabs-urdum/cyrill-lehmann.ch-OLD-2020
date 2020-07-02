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
      projects: props.projects,
      tags: props.tags,
      currentFilter: "all",
    };
  }

  componentDidMount() {
    this.props.setCurrentRoot(this.props.location.pathname);
  }

  componentDidUpdate() {
    if (this.props.projects && !this.state.ready) {
      window.setTimeout(() => {
        this.setState({
          ready: true,
        });
      }, 200);
    }
  }

  onFilterChange = (e) => {
    this.setState({
      currentFilter: e.currentTarget.value,
    });
  };

  render() {
    const tagsJSX = this.props.tags
      ? this.props.tags.map((tag) => {
          return (
            <label className="what__tagListLabel" key={tag}>
              <input
                className="what__tagListInput"
                type="radio"
                name="tagListFilter"
                value={tag}
                onChange={this.onFilterChange}
              />
              <span className="button what__tagListFilter">{tag}</span>
            </label>
          );
        })
      : null;

    if (tagsJSX) {
      tagsJSX.unshift(
        <label className="what__tagListLabel" key="all">
          <input
            className="what__tagListInput"
            type="radio"
            name="tagListFilter"
            value="all"
            onChange={this.onFilterChange}
            defaultChecked
          />
          <span className="button what__tagListFilter">All</span>
        </label>
      );
    }

    const projectsJsx = this.props.projects
      ? this.props.projects.map((project) => {
          const tagsJsx = project.tags.map((tag) => {
            return (
              <li className="what__tagListEntry" key={tag.replace(" ", "")}>
                {tag}
              </li>
            );
          });

          if (
            this.state.currentFilter == "all" ||
            project.tags.includes(this.state.currentFilter)
          ) {
            return (
              <li
                className="what__listEntry"
                key={project.name.replace(" ", "")}
              >
                <canvas className="what__canvas" width="16" height="9"></canvas>
                <a
                  className="what__project"
                  target="__blank"
                  rel="noopener"
                  href={project.link}
                  onClick={(e) => this.props.gace(e, project.name)}
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
          }
        })
      : null;

    return (
      <section className="what">
        <Link
          to="/"
          className="button what__anchorBack"
          onClick={(e) => this.props.gace(e, "home")}
        >
          back
        </Link>
        <ul className={this.state.ready ? "what__list ready" : "what__list"}>
          <li className="what__listEntry what__listEntry--filter">{tagsJSX}</li>
          {projectsJsx}
        </ul>
      </section>
    );
  }
}

export default withRouter(What);
