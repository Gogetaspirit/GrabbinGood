import React from 'react';
import './user_news_style.css';
class UserNews extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            arrNews: [],
            firstRender: false,
            symbol: ''
        }
    }

    render() {
        if (this.state.firstRender === false) {
            let arrOfStocks = ['msft', 'amzn', 'dis', 'aapl', 'sbux', 'tsla', 'zm', 'fb', 'nke'];
            let randomAsset = arrOfStocks[Math.floor(Math.random() * arrOfStocks.length)];
            let url = `https://cloud.iexapis.com/stable/stock/${randomAsset}/news/last/2?token=pk_7f907de6dd184f68962cd03c99b625ce`;
            fetch(url).then(response => response.json())
                .then(result => this.setState({ arrNews: result, firstRender: true  }))
        }

        return (
            <div className="whole-section-news-two">
                <h2 className="section-name-two">News</h2>
                <ul className="news-elements-two">
                    {this.state.arrNews.map((news, idx) => (
                        <a href={news.url} key={idx} className="news-link-two">
                            <li className='indiv-news-two'>
                                <div className='subsection-news-two'>
                                    <div className="news-source-two">{news.source}</div>
                                    <br />
                                    {news.headline}
                                </div>
                                <img src={news.image} alt="" className='img-news-two' />
                            </li>
                        </a>
                    ))}

                </ul>
            </div>
        )
        
    }
}

export default UserNews