import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PortfolioContainer from './portfolio/portfolio-container';
import NavigationContainer from './navigation/navigation-container.js';
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Blog from "./pages/blog";
import BlogDetail from './pages/blog-detail';
import PortfolioManager from './pages/portfolio-manager';
import PortfolioDetail from './portfolio/portfolio-detail';
import Auth from './pages/auth';
import NoMatch from './pages/no-match';
import Icons from "../helpers/icons";

export default class App extends Component {
  constructor(props) {
    super(props);

    Icons();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN"
    }

    this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
    this.handleUnsuccessfulLogin = this.handleUnsuccessfulLogin.bind(this);
    this.handleSucessfulLogout = this.handleSucessfulLogout.bind(this);
  }


  handleSuccessfulLogin() {
    this.setState({
      loggedInStatus: "LOGGED_IN"
    })
  }

  handleUnsuccessfulLogin() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    })
  }

  handleSucessfulLogout() {
    this.setState({
      loggedInStatus: "NOT_LOGGED_IN"
    })
  }

  checkLoginStatus() {
    return axios.get("https://api.devcamp.space/logged_in", {
      withCredentials: true
    }).then(response => {
      const loggedIn = response.data.logged_in;
      const loggedInStatus = this.state.loggedInStatus;

      // If loggedIn and status LOGGED_IN => return data (no necesitamos hacer nada)
      // If loggedIn and status NOT_LOGGED_IN => update state (Decir que queremos cambiar a LOGGED_IN)
      // If not loggedIn and status is LOGGED_IN => update state (asegurarse de salir con log out
      
      if (loggedIn && loggedInStatus === "LOGGED_IN") {
        return loggedIn;
      } else if (loggedIn && loggedInStatus === "NOT_LOGGED_IN") {
        this.setState({
          loggedInStatus: "LOGGED_IN"
        });
      } else if (!loggedIn && loggedInStatus === "LOGGED_IN") {
        this.setState({
          loggedInStatus: "NOT_LOGGED_IN"
        });
      }
    })
    .catch(error => {
      console.log("Error", error)
    })
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  authorizedPages() {
    return [
      <Route key="portfolio-manager" path="/portfolio-manager" component={PortfolioManager} />
    ]
  } // para proteger los links y que no se pueda acceder

  render() {
    return (
      <div className='container'>
        <Router>
          <div>
            <NavigationContainer
              loggedInStatus={this.state.loggedInStatus}
              handleSucessfulLogout={this.handleSucessfulLogout}
            />

            <Switch>
             <Route exact path="/" component={Home} />

             <Route
                path="/auth"
                render={props => (
                  <Auth
                    {...props}
                    handleSuccessfulLogin={this.handleSuccessfulLogin}
                    handleUnsuccessfulLogin={this.handleUnsuccessfulLogin}
                  />
                )
                }
              />

             <Route path="/about-me" component={About} />
             <Route path="/contact" component={Contact} />
             <Route path="/blog"
             render={props => (
               <Blog {...props} loggedInStatus={this.state.loggedInStatus} />
             )}
             />

             <Route
                path="/b/:slug"
                render={props => (
                  <BlogDetail {...props} loggedInStatus={this.state.loggedInStatus} />
                )}
             />
              {this.state.loggedInStatus === "LOGGED_IN" ? this.authorizedPages() : null}
             <Route exact path="/portfolio/:slug" component={PortfolioDetail} />
             <Route component={NoMatch} />
            </Switch>
          </div> 
        </Router> 

      </div>
    );
  }
}
