import React, { Component } from 'react';
import { BrowserRouter, Route, Router, Link, NavLink, Switch, Redirect, withRouter } from 'react-router-dom';

class Home extends Component{

    componentDidMount(){
        this.props.setCurrentRoot(this.props.location.pathname);
    }

    render(){
        return(
            <section className="home">
                <div className="home__text">
                    <h1 className="home__name">Cyrill Lehmann</h1>
                    <h2 className="home__position">Web Developer</h2>
                </div>
                <Link to="/who" className="button home__anchorWho">who</Link>
                <Link to="/what" className="button home__anchorWhat">what</Link>
            </section>
        )
    }

}

export default withRouter(Home);