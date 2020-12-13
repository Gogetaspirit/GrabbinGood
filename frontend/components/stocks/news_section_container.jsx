import React from 'react';
import './news_section_style.css'

class NewsSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrNews: [],
            symbol: ''
        }
    }

    render() {
        if (this.props.stock.stock_symbol !== this.state.symbol) {
            let stock = this.props.stock.stock_symbol.toLowerCase()
            let url = `https://cloud.iexapis.com/stable/stock/${stock}/news/last/2?token=pk_0df25c5085a9428590bbb49600f9487c`;
             fetch(url).then(response => response.json())
                 .then(result => this.setState({ arrNews: result, symbol: this.props.stock.stock_symbol}))
        }
        //fixed infinite api call
        return (
            <div className = "whole-section-news">
                <h2 className = "section-name">News</h2>
            <ul className = "news-elements">
                {this.state.arrNews.map((news, idx) => (
                    <a href={news.url} key={idx} className="news-link">
                    <li  className = 'indiv-news'>
                        <div className = 'subsection-news'>
                            <div className = "news-source">{news.source}</div>
                        <br/>
                        {news.headline}
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