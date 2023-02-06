import store from "./store";
import './App.css'
import Button from '@mui/material/Button';
import {TextField} from "@mui/material";
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            out: '0',
            full: '0'
        }
    }

    tapeNumber(value) {
        let currentValue = value;
        let fullValue = this.state.full;
        //try
        if (fullValue === "0") {
            this.setState(
                {
                    out: currentValue,
                    full: currentValue
                }
            )
        } else {

            this.setState(
                {
                    out: this.state.out + currentValue,
                    full: this.state.full + currentValue
                })
        }
    }

    async tapeOperation(value) {
        const ops = ["*", "/", "+", "-"];
        let full = this.state.full;
        let out = this.state.out;
        if (value !== '=' && value !== 'C' && value !== "GET") {

            if (ops.some(v => String(out).charAt(out.length - 1) === v) && ops.some(v => String(out).includes(v))) {
                let repLastOut = String(out).replace(String(out).charAt(out.length - 1), value);
                let repLastFull = String(full).slice(0, -1) + value;
                out = repLastOut;
                full = repLastFull;
            } else if (ops.some(v => String(out).charAt(out.length - 1) !== v) && ops.some(v => String(out).includes(v))) {
                let result = this.calculateOperation(this.state.out);
                full = this.state.full.replace(("\n- - - - - -"), "");
                out = result + value;
                full = full + "=" + result + "\n- - - - - -" + "\n" + result + value;
            } else {
                out = out + value;
                full = full + value;
            }
        } else if (value === 'C') {
            out = '0';
            full = '0';
        } else if (value === '=') {
            try {
                let result = this.calculateOperation(this.state.out);
                full = full.replace(("\n- - - - - -"), "");
                out = result;
                full = full + "=" + result + "\n- - - - - -" + "\n" + result;
            } catch {
            }//output.value="Wrong value"}
        } else if (value === "GET") {
            let replace=full.split("\n").pop();
            full=full.replace(new RegExp(replace+'$'),"");
            console.log("full:"+full);
            full = full.replace(("\n- - - - - -\n"), "\n");
            let response = await fetch("http://localhost:8080/math/examples/count/2");
            if (response.ok) {
                let json = await response.json();
                for (let i = 0; i < json.length; i++) {
                    let counter = json[i];
                 //   console.log(counter);
                    out=counter+"="+this.calculateOperation(counter);
                   full=full+out+"\n";
                 //   console.log(out);
                }
                out=0;
                full=full+"- - - - - -\n";
            }
                else{
                    alert("HTTP-ERROR: "+response.status);
                }
            }
        this.setState({
            out: out,
            full: full
        })
    }

    calculateOperation(value) {
        let values;
        if (value.includes('+')) {
            values = value.split('+');
            return (+values[0] + (+values[1]));
        } else if (value.includes('-')) {
            values = value.split('-');
            return values[0] - values[1];
        } else if (value.includes('*')) {
            values = value.split('*');
            return values[0] * values[1];
        } else if (value.includes('/')) {
            values = value.split('/');
            return values[0] / values[1];
        }
    }

    render() {
        return (
            <div className="container">
                <div className="output">
                    <TextField className="textfield" value={this.state.full} multiline/>
                </div>
                <div className="buttons">
                    {store.buttons.map((item, index) => <Button
                        variant="contained"
                        key={index}
                        onClick={() => {
                            this.tapeNumber(item.val)
                        }}
                    >{item.val}</Button>)}
                    {store.operations.map((item, index) => <Button
                        variant="contained"
                        key={index}
                        onClick={() => {
                            this.tapeOperation(item.val)
                        }}
                    >{item.val}</Button>)}
                </div>
            </div>
        )
    }
}

export default App;
