import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';


const NavigationContainer = (props) => {
        const dynamicLink = (route, linkText) => {
            return (
                <div className="nav-link-wrapper">
                    <NavLink to={route} activeClassName='nav-link-active'>{linkText}</NavLink>
                </div>
            );
        };

        const handleSignOut = () => {
            axios.delete("https://api.devcamp.space/logout", {withCredentials: true}).then(response => {
                if (response.status === 200) {
                    props.history.push("/");
                    props.handleSucessfulLogout()
                }
                return response.data;
            }).catch(error => {
                console.log("Error signing out", error);
            });
        };

        return (
           <div className="nav-wrapper">
                <div className="left-side">

                    <div className="nav-link-wrapper">
                        <NavLink exact to="/" activeClassName='nav-link-active'>Home</NavLink>
                    </div>

                    <div className="nav-link-wrapper">
                        <NavLink exact to="/about-me" activeClassName='nav-link-active'>About</NavLink>
                    </div>
                    
                    <div className="nav-link-wrapper">
                        <NavLink exact to="/contact" activeClassName='nav-link-active'>Contact</NavLink>
                    </div>

                    <div className="nav-link-wrapper">
                        <NavLink exact to="/blog" activeClassName='nav-link-active'>Blog</NavLink>
                    </div>

                    {props.loggedInStatus === "LOGGED_IN" ? (dynamicLink("/portfolio-manager", "Portfolio Manager")) : null}

                </div>

                <div className="right-side">
                    NEREA CORRALES
                    {props.loggedInStatus === 'LOGGED_IN' ? <a onClick={handleSignOut}>
                        <FontAwesomeIcon icon="sign-out-alt" />
                    </a> : null }
                </div> 
           </div> // hemos a??adido un ternary operator para que el bot??n se muestre solo si quien inicia sesi??n es admin. Esto lo hemos hecho hard-coded, pero cuando haya un bloque de Autorizaci??n, esto se her?? de forma din??mica
        )
    }

export default withRouter(NavigationContainer); //withRouter es el HOC