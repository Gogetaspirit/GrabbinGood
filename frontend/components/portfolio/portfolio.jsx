import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './portfolio_style.css'
import UserChart from './user_chart'
import SearchBarContainer from './search/search_bar_container';
import AccountDropDown from './dropdownacc/account_drop_down';
import UserNews from './news/user_news';
import WatchlistContainer from '../watchlist/watchlist'

class Portfolio extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        inputVal: "",
        watchlist: [],
        accountBalance: "",
        placeholder: ""
    } 
    }

    componentDidMount() {
        this.props.fetchWatchlists(this.props.user).then(watchlists => {
            
            this.props.fetchUserAccBal(this.props.user).then(user => {
                
                this.setState({
                    watchlist: Object.values(watchlists.watchlists),
                    accountBalance: user.info.account_balance,
                    placeholder: "placeholder"
                })
            })
            
        })
    }
     

    render() {
        if (this.state.placeholder === ''){
        return null;
        }
        else {
            let userAccBal = parseFloat(this.state.accountBalance).toFixed(2)
        return(
            <div className = "portfolio">
                <div className = "nav-bar">
                <div className= "left-nav">
                <Link to={'/'}>
                <img src="/images/logo.jpeg" alt="" className="logo-image"></img>
                </Link>
                <SearchBarContainer/>
                </div>
                <AccountDropDown logout={this.props.logout} accountBalance={this.state.accountBalance} username={this.props.username}/>
                </div>
                <div className="page-content-two">
                <br/>
                <div className="userchart-two-whole">
                <UserChart ownStocks={this.state.watchlist} chartInfo={this.props.updateUserChart} accountBalance={this.state.accountBalance}/>
                <div className="buyingpower-portfolio">
                <div>Buying Power</div> <div>${userAccBal}</div>
                </div>
                <UserNews retrieveNews={this.props.updateCurrentCompanyNews}/>
                </div>
                <div className= 'watchlist-whole'>
                <WatchlistContainer watchlist={this.state.watchlist} />
                </div>
                </div>
                <br/>
            </div>
        )
        }
    }

}



export default Portfolio;