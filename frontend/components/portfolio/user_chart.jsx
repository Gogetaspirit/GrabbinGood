import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
import React from 'react';
import './user_style.css';


class UserChart extends React.Component{ 
    constructor(props) {
        super(props);
        this.state = {
            data2: [],
            difference: '',
            percentChange: '',
            placeholder: ''
        }
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.strokeColor = this.strokeColor.bind(this);
        this.handleMouseOff = this.handleMouseOff.bind(this)
    }


     numberWithCommas(x) {
    let result = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return result;
    }

    strokeColor(){
        if (this.state.lastPrice - this.state.firstPrice >= 0) {
            return '#5EC933'
        }
        else {
            return '#EE4E34'
        }
    }


    handleMouseMove(e) {
        if (e.activePayload) {
            let currentPrice = e.activePayload[0].value
            if (currentPrice === null) {
                return null;
            }
            let difference = currentPrice - this.state.firstPrice
            let percentDecminal = difference / currentPrice
            let percentChange = percentDecminal * 100
            if (percentChange < 0) {
                percentChange = percentChange.toFixed(2) + "%"
            }
            else {
                percentChange = "+" + `${percentChange.toFixed(2)}` + "%"
            }
            if (difference >= 0) {
                difference = "+$" + `${difference.toFixed(2)}`
            }
            else {
                difference = `${difference.toFixed(2)}`
            }

           let result = this.numberWithCommas(currentPrice.toFixed(2))


            this.setState({ val: result, percentChange: percentChange, difference: difference })
        }
    }

    handleMouseOff() {
        let newVal = this.state.lastPrice
        if (this.state.lastPrice === null) {
            let result = this.state.data2.filter((obj) => {
                if (obj.high != null) {
                    return obj
                }
            })
            newVal = result.slice(-1)[0].high.toFixed(2)
        }
        else {
            newVal = this.state.lastPrice.toFixed(2)
        }
        let newLastPrice = newVal;
        let difference = newLastPrice - this.state.firstPrice
        let percentChange = (difference / this.state.firstPrice) * 100
        if (percentChange < 0) {
            percentChange = percentChange.toFixed(2) + "%"
        }
        else {
            percentChange = "+" + `${percentChange.toFixed(2)}` + "%"
        }
        if (difference >= 0) {
            difference = "+$" + `${difference.toFixed(2)}`
        }
        else {
            difference = `${difference.toFixed(2)}`
        }

        let numberComma = this.numberWithCommas(newVal)

        this.setState({
            val: numberComma,
            percentChange: percentChange,
            difference: difference
        })
    }




    componentDidMount(){
        let newAccBal = parseInt(this.props.accountBalance)
        this.props.chartInfo(this.props.ownStocks, newAccBal).then((output) => {
            
            let difference;
            let percentChange;
            let result;
            let finaloutput = output.output
            if (output.output.length < 1) {
                this.setState({
                    data2: finaloutput,
                    lastPrice: null,
                    firstPrice: null,
                    difference: null,
                    percentChange: null,
                    val: null,
                    placeholder: 'placeholder'
                })
            }
            else {
            difference = finaloutput[finaloutput.length - 1].high - finaloutput[0].high;
            percentChange = (difference / finaloutput[0].high) * 100
            if (percentChange < 0) {
                percentChange = percentChange.toFixed(2) + "%"
            }
            else {
                percentChange = "+" + `${percentChange.toFixed(2)}` + "%"
            }
            if (difference >= 0) {
                difference = "+$" + `${difference.toFixed(2)}`
            }
            else {
                difference = `${difference.toFixed(2)}`
            }

            result = this.numberWithCommas(finaloutput[finaloutput.length - 1].high.toFixed(2))

            this.setState({
                data2: finaloutput,
                lastPrice: finaloutput[finaloutput.length -1].high,
                firstPrice: finaloutput[0].high,
                difference: difference,
                percentChange: percentChange,
                val: result,
                placeholder: 'placeholder'
            })
        }
        })
        
    }


    render(){

        function CustomToolTip({ payload, label, active }) {
            if (active) {
                if (label.includes(":") === false) {
                    label = label.split(" ").join(":00 ")
                }
                return (
                    <div>
                        <p>{`${label}`}</p>
                    </div>
                );

            }

            return null;
        }

        if (this.state.placeholder === "") {
            return null;
        }
        else if ( this.state.placeholder === "placeholder" && this.state.data2.length < 1) {
            
            return(
                <div>
                    Buy Stocks in order to show Users data!
                </div>
            )
        }
        else {
        return(
    <div className = "user-portion-chart-two">
        <h1 className="stock-name-for-chart-two">
            ${this.state.val}
        </h1>
        <div className="percent-change-two">{this.state.difference} ({this.state.percentChange}) Today</div>
        <LineChart onMouseMove= {this.handleMouseMove}connectNulls={true} width={740} height={300} data={this.state.data2} 
        dot={false} onMouseLeave={() => this.handleMouseOff()}
        className = "chart-two"
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
            <Line type="monotone" dataKey="high" stroke={this.strokeColor()} dot={false} />
            <XAxis dataKey="label" hide={true}/>
            <YAxis hide={true} domain={['dataMin', 'dataMax']}/>
            <Tooltip 
            wrapperStyle={{ left: -35 }}
            allowEscapeViewBox={{ x: true, y: true }}
            position={{ y: -30 }} cursor={{ stroke: 'grey' }} isAnimationActive={false} 
            content={<CustomToolTip />}
            />
        </LineChart>  
    </div>
        )
        }
    }
}

export default UserChart;