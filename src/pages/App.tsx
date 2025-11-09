import { useState } from 'react';
import { useEffect } from 'react';
import Row from '../components/Row.tsx';

import './App.css';

function App() {

  const numGuesses = 5;
  const wordLength = 5;
  const [rowNumber, setRowNumber] = useState(0);
  const [squareNumber, setSquareNumber] = useState(0);
  const [values, setValues] = useState([...Array(numGuesses)].map(e => Array(wordLength).fill('')));
  let rows = [...Array(numGuesses).keys()];

  function keyDownHandler(e: globalThis.KeyboardEvent) {
      if(squareNumber < wordLength){
        let newValues = values.slice();
        let newRow = values[squareNumber].slice();
        newRow[squareNumber] = e.key.toUpperCase();
        newValues[rowNumber] = newRow;
        console.log(e.key)
        console.log(newValues)
        console.log(rowNumber,squareNumber)
        setValues(newValues);
        setSquareNumber(squareNumber + 1)//squareNumber => squareNumber + 1);
    }
  }
  
  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, []);

  return (
  <>
    <div className="Game"> 
      { 
        rows.map( (elem) =>
          <Row rowNumber={elem} guessArray={values[elem]} wordLength={wordLength} key={elem}/>
        )
      }
    </div>
  </>
  
  )
}

export default App
