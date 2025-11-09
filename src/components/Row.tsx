import Square from "./Square.tsx"
import './Row.css';

export default function Row({rowNumber, guessArray, wordLength}) {
    let squares = [...Array(wordLength).keys()];
    return (
    <>
        <div className="Row">
            {squares.map((elem) =>
                <Square rowNumber={rowNumber} squareNumber={elem} value={guessArray[elem]} key={elem}/>
            )}
        </div>
   
    </>
    )

}