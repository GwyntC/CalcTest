import {useContext} from "react";
import {CalcContext} from "../context/CalcContext";

const Screen=()=>{
    const {calc} = useContext(CalcContext);
    return (
       <textarea className="screen" maxLength={70}>{calc.num ? calc.num : calc.res}</textarea>
    )
}

export default  Screen