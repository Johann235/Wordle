import './Square.css';
import {Guess_Value} from './Row.tsx'
import { useEffect } from 'react';
type SquareProps = {
    rowNumber: number,
    squareNumber: number,
    value: string,
    submitted: boolean,
    guessStatus: Guess_Value
}


export default function Square({rowNumber, squareNumber, value, submitted, guessStatus}: SquareProps){
    
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
    <>
    {
        submitted ? renderSwitch(guessStatus)
                  : (<input type="text" pattern="[A-Z]*" maxLength={1} value={value} disabled/>)
    }
    </>
    )

}