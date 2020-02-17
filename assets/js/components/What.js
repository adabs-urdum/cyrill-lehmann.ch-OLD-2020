import React, { Component } from "react";
import {
  BrowserRouter,
  Route,
  Router,
  Link,
  NavLink,
  Switch,
  Redirect,
  withRouter
} from "react-router-dom";

class What extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [
        {
          name: "memory",
          description:
            "built a minimalistic memory game without using any crucial dependencies",
          tags: ["css", "javascript", "html"],
          link: "https://memory.adabs.ch/",
          imageSrc: "../dist/img/screens/memory.jpg"
        },
        {
          name: "robojelly",
          description:
            "a cute robotic jellyfish created purely with css. using javascript for eye movement",
          tags: ["css", "cssArt", "javascript", "html"],
          link: "https://observer.cyrill-lehmann.ch/",
          imageSrc: "../dist/img/screens/robojelly.jpg"
        },
        {
          name: "wobble head",
          description:
            "scanned my head using an iphone, then added head turning either using mouse position, gyroscope or face tracking through a camera",
          tags: ["babylon", "javascript", "webgl"],
          link: "https://cyrill.adabs.ch",
          imageSrc: "../dist/img/screens/head.jpg"
        },
        {
          name: "rogue cards",
          description:
            "started a rogue like card deckbuilder using react and babylon. inspired by slay the spire. abandoned for now.",
          tags: ["react", "babylon", "game"],
          link: "https://cards.adabs.ch",
          imageSrc: "../dist/img/screens/cards.jpg"
        },
        {
          name: "rubiks clus",
          description:
            "my first experiment using three.js and our clus team photos",
          tags: ["three", "javascript"],
          link: "https://rubiksclus.cyrill-lehmann.ch",
          imageSrc: "../dist/img/screens/rubiks.jpg"
        }
      ]
    };
  }

  componentDidMount() {
    this.props.setCurrentRoot(this.props.location.pathname);
  }

  render() {
    const projectsJsx = this.state.projects.map(project => {
      const tagsJsx = project.tags.map(tag => {
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
            target="_blank"
            href={project.link}
            style={{
              backgroundImage: "url(" + project.imageSrc + ")"
            }}
          >
            <div className="what__projectContent">
              <h2 className="what__projectName">{project.name}</h2>
              <p className="what__projectDescription">{project.description}</p>
              <ul className="what__tagList">{tagsJsx}</ul>
            </div>
          </a>
        </li>
      );
    });

    return (
      <section className="what">
        <Link to="/" className="button what__anchorBack">
          back
        </Link>
        <ul className="what__list">{projectsJsx}</ul>
      </section>
    );
  }
}

export default withRouter(What);
