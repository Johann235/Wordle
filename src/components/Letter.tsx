import {Guess_Value} from '../pages/App.tsx'
import './Letter.css';

type LetterProps = {
    letter: string,
    guess_value : Guess_Value
}

export default function Letter({letter, guess_value}: LetterProps){
    function renderSwitch(guessStatus: Guess_Value) {
        switch(guessStatus) {
            case Guess_Value.Green:
                return <input style={{animationName:"green_keyboard", animationFillMode: "both"}} type="text" value={letter.toUpperCase()} disabled/>;
            case Guess_Value.Grey:
                return <input style={{animationName:"grey_keyboard", animationFillMode: "both"}} type="text" value={letter.toUpperCase()} disabled/>;
            case Guess_Value.Yellow:
                return <input style={{animationName:"yellow_keyboard", animationFillMode: "both"}} type="text" value={letter.toUpperCase()} disabled/>;
            case Guess_Value.Black:
                console.log('hii')
                return <input className="black" type="text" value={letter.toUpperCase()} disabled/>;
        }
    }

    return(
        <div className="Letter">
            {renderSwitch(guess_value)}
        </div>
    )
}