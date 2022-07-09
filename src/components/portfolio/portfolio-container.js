import React, { Component } from "react";
import axios from 'axios';

import PortfolioItem from "./portfolio-item";

export default class PortfolioContainer extends Component {
    constructor() {
        super();

        this.state = {
            pageTitle: "Welcome to my portfolio",
            isLoading: true,
            data: []
        };

        this.handlePageTitleUpdate = this.handlePageTitleUpdate.bind(this);

        this.handleFilter = this.handleFilter.bind(this);

    }

    portfolioItems() {
        return this.state.data.map(item => {
            console.log("portfolio item", item);
            return <PortfolioItem key={item.id} item={item} />;
        })
    }

    handlePageTitleUpdate() {
        this.setState({
            pageTitle: "This is not Nerea anymore"
        });
    }

    handleFilter(filter) {
        if (filter === "CLEAR_FILTERS") {
            this.getPortfolioItems();
        } else { 
            this.getPortfolioItems(filter);
        }
    }

        
  getPortfolioItems(filter = null) {
    axios
      .get('https://nereacorrales.devcamp.space/portfolio/portfolio_items')
      .then(response => {
        if (filter) {
            this.setState({
                data: response.data.portfolio_items.filter(item => {
                    return item.category === filter;
                })
            });
        } else {
            this.setState({
                data: response.data.portfolio_items
            });
        }
        }).catch(error => {
            console.log("no data", error);
        });
    }

  componentDidMount() {
      this.getPortfolioItems();
  }

    render() {
        /*if (this.state.isLoading) {
            return <div>Loading...</div>;
        }*/ //Necesario añadirlo cuando tenemos un API que va a tardar en renderizar, por lo que ponemos esto para que ponga algo más (Cargando...) hasta que API traiga los datos y isLoading deje de ser true y entonces ya puede pasar a la segunda parte de render() y mostrar los datos. Es para que el usuario no se quede mirando a la nada hasta que los datos carguen.
        return (
            <div className="homepage-wrapper">
                <div className="filter-links">
                    
                    <button className="btn" onClick={() => this.handleFilter('Technology')}>Technology</button>
                    <button className="btn" onClick={() => this.handleFilter('Social Media')}>Social Media</button>
                    <button className="btn" onClick={() => this.handleFilter('Business')}>Business</button>
                    <button className="btn" onClick={() => this.handleFilter('CLEAR_FILTERS')}>All</button>

                </div>
                
                <div className="portfolio-items-wrapper">
                    {this.portfolioItems()}      
                </div>
            </div>
        );
    }
}