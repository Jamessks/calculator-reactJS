import React from 'react';
import './App.css';

const centerdiv = {
    position:"absolute",
display:"block",
    left:"40%",
top:"20%"
};
const isOperator = /[-+x/]/;
const isNegative=/-/;
const isDecimal = /\./;
class App extends React.Component{
  render(){
    return <div style={centerdiv}>
        <table className="tg">
            <CalcScreenInput/>
        </table>
    </div>
  }
}

class CalcScreenInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            answer:'',
            prevVal:'',
            currentVal: '',
            currentIsNegative: false,
            currentIsDecimal: false,
            evaluatedNum: false,
            input: 0,
            output: 0
        };
        this.handleNumbers = this.handleNumbers.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleOperators = this.handleOperators.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handleEquals = this.handleEquals.bind(this);
    }
    handleNumbers(e){

        if(this.state.input == "0") {
            if (e.target.value != 0) {
                this.setState({
                    input: e.target.value,
                    output: e.target.value
                });
            }
        }else{
            if(this.state.evaluatedNum){
                this.setState({
                    evaluatedNum: false,
                    input: e.target.value,
                    output: e.target.value
                })
            }
            //replace consecutive 0's with operator
            else if(!e.target.value == 0 && !this.state.currentIsDecimal && this.state.input.charAt(this.state.input.length - 2).match(isOperator) && this.state.input.charAt(this.state.input.length - 1).match(/0/)){
                let mytemp = this.state.input.split("");
                mytemp.pop();
                mytemp.push(e.target.value);
                let newtemp = mytemp.join("");
                this.setState({
                    input: newtemp,
                    output: e.target.value
                });
            }else{ //concatenate current value with new pressed values
            this.setState({input: this.state.input + e.target.value});

                    if (this.state.output.match(isOperator)) {
                        this.setState({ output: e.target.value });
                    } else {
                        this.setState({output: this.state.output + e.target.value});
                    }

           }
        }
    }
    handleOperators(e) {
        if (this.state.currentIsDecimal) { //if there has been a decimal, then reset
            this.setState({
                currentIsDecimal: false
            });
        }
        if (e.target.value.match(isNegative)) {

            this.setState({
                currentIsNegative: true
            })
        } else {

            this.setState({
                currentIsNegative: false
            });
        }
        if(this.state.evaluatedNum){ //concatenate if output is after evaluation
            this.setState({
                input: this.state.answer+e.target.value,
                output: e.target.value,
                evaluatedNum : false
            })
        }
        else if(this.state.input.length >= 1 && !this.state.evaluatedNum) {
            if (e.target.value !== this.state.input.charAt(this.state.input.length - 1)) {
                 if (this.state.input.charAt(this.state.input.length - 1).match(/[+x/]/) && e.target.value.match(isNegative) && !this.state.currentIsNegative) {
                    this.setState({
                        input: this.state.input + e.target.value,
                        output: e.target.value
                    });
                } else if (this.state.input.charAt(this.state.input.length - 1).match(isOperator)) {
                    let mytemp = this.state.input.split("");
                    if(this.state.input.charAt(this.state.input.length - 2).match(isOperator) && this.state.input.charAt(this.state.input.length - 1).match(isNegative)) {
                        //if we have a case of "+-" or "*-" and we press an operator, replace those 2 operators with the new operator, given that the second operator is a "-".
                        mytemp.pop();
                        mytemp.pop();

                    }else{//In any other case, replace the last pressed operator, excluding negative operator, with the new operator
                        mytemp.pop();
                    }
                    mytemp.push(e.target.value);
                    let newtemp = mytemp.join("");
                    this.setState({
                        input: newtemp,
                        output: e.target.value
                    });
                } else {
                    this.setState({
                        input: this.state.input + e.target.value,
                        output: e.target.value
                    });
                }
            }
        } else {
            this.setState({
                input: this.state.input + e.target.value,
                output: e.target.value
            });
        }
    }
    handleDecimal(e){ //Logic: if decimal has been placed, then decimal cannot be placed again, unless an operator precedes that decimal
        if(!this.state.evaluatedNum) {
            if (e.target.value === "." && !this.state.currentIsDecimal) {
                this.setState({
                    currentIsDecimal: true,
                    input: this.state.input + e.target.value,
                    output: this.state.output + e.target.value
                });
            }
            if (this.state.input.length >= 1 && this.state.input.charAt(this.state.input.length - 1).match(isOperator) && !this.state.currentIsDecimal) {
                this.setState({
                    currentIsDecimal: true,
                    input: this.state.input + "0" + e.target.value,
                    output: "0" + e.target.value
                });
            }
        }else{
            this.setState({
                currentIsDecimal: true,
                input: "0" + e.target.value,
                output: "0" + e.target.value,
                evaluatedNum: false
            });
        }
    }
    handleClear(){
        this.setState({
            evaluatedNum : false,
            answer : 0,
            currentIsDecimal : false,
            output: 0,
            input : 0,
            currentIsNegative : false
        });
    }
    handleEquals(){
        if(this.state.input.length >= 1 && !this.state.evaluatedNum) {
            if (this.state.input.match(isOperator) && !this.state.input.charAt(this.state.input.length - 1).match(isOperator)) {
                let tempAnswer = this.state.input.replace(/x/g, "*");
                let theanswer = eval(tempAnswer.toString());
                this.setState(state => ({

                    answer: theanswer,
                    input: state.input + "=" + theanswer,
                    output: theanswer,
                    evaluatedNum: true,
                    currentIsDecimal : false
                }));

            }
        }
    }
    render(){
        return(
            <tbody>
            <tr>
                <th className="tg-0pky" colSpan="4">{this.state.output}</th>
            </tr>
            <tr>
                <th className="tg-0pky" colSpan="4">{this.state.input}</th>
            </tr>
            <CalcButtons   numbers={this.handleNumbers}
                             clear={this.handleClear}
                         operators={this.handleOperators}
                            equals={this.handleEquals}
                           decimal={this.handleDecimal}/>
            </tbody>
        )
    }
}

class CalcButtons extends React.Component {
    render() {
        return (
            <tbody>
            <tr>
                <td className="tg-c3ow">
                    <button id="seven" className="button" value="7" onClick={this.props.numbers}>7</button>
                </td>
                <td className="tg-c3ow">
                    <button id="eight" className="button" value="8" onClick={this.props.numbers}>8</button>
                </td>
                <td className="tg-c3ow">
                    <button id="nine" className="button" value="9" onClick={this.props.numbers}>9</button>
                </td>
                <td className="tg-7btt">
                    <button id="plus" className="button" value="+" onClick={this.props.operators}>+</button>
                </td>
            </tr>
            <tr>
                <td className="tg-c3ow">
                    <button id="four" className="button" value="4" onClick={this.props.numbers}>4</button>
                </td>
                <td className="tg-c3ow">
                    <button id="five" className="button" value="5" onClick={this.props.numbers}>5</button>
                </td>
                <td className="tg-c3ow">
                    <button id="six" className="button" value="6" onClick={this.props.numbers}>6</button>
                </td>
                <td className="tg-7btt">
                    <button id="minus" className="button" value="-" onClick={this.props.operators}>-</button>
                </td>
            </tr>
            <tr>
                <td className="tg-c3ow">
                    <button id="one" className="button" value="1" onClick={this.props.numbers}>1</button>
                </td>
                <td className="tg-c3ow">
                    <button id="two" className="button" value="2" onClick={this.props.numbers}>2</button>
                </td>
                <td className="tg-c3ow">
                    <button id="three" className="button" value="3" onClick={this.props.numbers}>3</button>
                </td>
                <td className="tg-7btt">
                    <button id="divide" className="button" value="/" onClick={this.props.operators}>/</button>
                </td>
            </tr>
            <tr>
                <td className="tg-c3ow">
                    <button id="clear" className="button" value="C" onClick={this.props.clear}>C</button>
                </td>
                <td className="tg-c3ow">
                    <button id="zero" className="button" value="0" onClick={this.props.numbers}>0</button>
                </td>
                <td className="tg-7btt">
                    <button id="equals" className="button" value="=" onClick={this.props.equals}>=</button>
                </td>
                <td className="tg-7btt">
                    <button id="multiply" className="button" value="x" onClick={this.props.operators}>x</button>
                </td>
            </tr>
            <tr>
                <td className="tg-c3ow">
                    <button  className="button" value="." onClick={this.props.decimal}>.</button>
                </td>
                <td className="tg-c3ow">
                    <button  className="button" value="0" >N</button>
                </td>
                <td className="tg-7btt">
                    <button  className="button" value="=" >N</button>
                </td>
                <td className="tg-7btt">
                    <button  className="button" value="x" >N</button>
                </td>
            </tr>
            </tbody>
        )
    }
}

export default App;
