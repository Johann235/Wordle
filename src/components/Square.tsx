import './Square.css';
import {Guess_Value} from '../pages/App.tsx'
type SquareProps = {
    value: string,
    submitted: boolean,
    guessStatus: Guess_Value
}


export default function Square({value, submitted, guessStatus}: SquareProps){
    
    function renderSwitch(guessStatus: Guess_Value) {
        switch(guessStatus) {
            case Guess_Value.Green:
                return <input className="Green" type="text" pattern="[A-Z]*" maxLength={1} value={value} disabled/>;
            case Guess_Value.Grey:
                return <input className="Grey" type="text" pattern="[A-Z]*" maxLength={1} value={value} disabled/>;
            case Guess_Value.Yellow:
                return <input className="Yellow" type="text" pattern="[A-Z]*" maxLength={1} value={value} disabled/>;
        }
    }
    
    return (
    <div className='Square'>
    {
        submitted ? renderSwitch(guessStatus)
                  : (<input type="text" pattern="[A-Z]*" maxLength={1} value={value} disabled/>)
    }
    </div>
    )

}