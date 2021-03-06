import React from 'react';
import './news_section_style.css'

class NewsSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrNews: [],
            symbol: ''
        }
        this.newsToOneSetence = this.newsToOneSetence.bind(this)
    }

    newsToOneSetence(news) {
        let newsArr = news.summary.split(" ")
        return newsArr.slice(0, 22).join(" ") + "..."
    }

    render() {
        if (this.props.stock.stock_symbol !== this.state.symbol) {
            let stock = this.props.stock.stock_symbol.toLowerCase()
            this.props.retrieveNews(stock)
                 .then(result => {
                     this.setState({ arrNews: result.news, symbol: this.props.stock.stock_symbol})
                })
        }
        //fixed infinite api call
        return (
            <div className = "whole-section-news">
                <h2 className = "section-name">News</h2>
            <ul className = "news-elements">
                {this.state.arrNews.map((news, idx) => (
                    <a href={news.url} key={idx} className="news-link" target="_blank">
                    <li  className = 'indiv-news'>
                        <div className = 'subsection-news'>
                            <div className = "news-source">{news.source}</div>
                        <br/>
                        {news.headline}
                        <br/>
                        <br/>
                        <div className="shortend-news-summ">
                        {this.newsToOneSetence(news)}
                        </div>
                        </div>
                        <img src={news.image} alt="" className ='img-news'/>
                    </li>
                    </a>
                ))}
                
            </ul>
            </div>
        )
    }
}

export default NewsSection;