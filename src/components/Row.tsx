import Square from "./Square.tsx"
import './Row.css';
import { useEffect, useState } from "react";

type RowProps = {
    rowNumber: number,
    guessArray: Array<string>,
    wordLength: number,
    submitted: boolean,
    secretWord: string
}

export enum Guess_Value{
    Green,
    Yellow,
    Grey
}

export default function Row({rowNumber, guessArray, wordLength, submitted, secretWord}: RowProps) {
    let squares = [...Array(wordLength).keys()];
    const [guessStatus, setGeussStatus] = useState([...Array(wordLength).fill(Guess_Value.Grey)])

    useEffect(() => {
        //Count of each letter
        let letters = {}
        for (let i = 0; i < wordLength; i++) {
            if (!(secretWord[i].toUpperCase() in letters)){
                letters[secretWord[i].toUpperCase()] = 1;
            }
            else{
                letters[secretWord[i].toUpperCase()] += 1;
            }
        }

        //First pass for correct guess
        let newGuessState = [...Array(5)];
        for (let i = 0; i < wordLength; i++){
            //Correct letter
            if(guessArray[i] == secretWord[i].toUpperCase()){
                newGuessState[i] = Guess_Value.Green
                letters[guessArray[i]] -= 1
            }
        }

        for (let i = 0; i < wordLength; i++){
            console.log(newGuessState[i], Guess_Value.Green)
            if(newGuessState[i] == Guess_Value.Green){
                console.log(i);
                continue;
            }
            //In the word 
            if ((guessArray[i] in letters ) && (letters[guessArray[i]] > 0)){
                newGuessState[i] = Guess_Value.Yellow
                letters[guessArray[i]] -= 1;
            }

            else{
                newGuessState[i] = Guess_Value.Grey
            }
        }
        setGeussStatus(newGuessState);
    },[submitted])

    return (
    <>
        <div className="Row">
            {squares.map((elem) =>
                <Square rowNumber={rowNumber} squareNumber={elem} 
                value={guessArray[elem]} submitted={submitted} guessStatus={guessStatus[elem]} key={elem}/>
            )}
        </div>
   
    </>
    )

}