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
  const [submitted, setSubmitted] =  useState([...Array(numGuesses).fill(false)]);
  const secretWord = "hello";

  function keyDownHandler(e: globalThis.KeyboardEvent) {
    //Try to submit
    if( (e.key == "Enter") ){
      if (squareNumber < wordLength){
        console.log("NOT ENOUGH LETTERS")
      }
      else{
        let newSubmitted = submitted.slice();
        newSubmitted[rowNumber] = true;
        setSubmitted(newSubmitted);
        setRowNumber(rowNumber => rowNumber + 1)
        setSquareNumber(0)
      }
    }

    //Delete
    else if( (e.key == "Backspace") && (squareNumber > 0)){
      let newValues = values.slice();
      let newRow = values[rowNumber].slice();
      newRow[squareNumber-1] = "";
      newValues[rowNumber] = newRow;
      setValues(newValues);
      setSquareNumber(squareNumber => squareNumber - 1);
      
    }

    //Check for valid letter
    else if( !(/^[a-z]$/i.test(e.key))){
      console.log("Invalid input")
    }

    //Insert
    else if(squareNumber < wordLength){
      let newValues = values.slice();
      let newRow = values[rowNumber].slice();
      newRow[squareNumber] = e.key.toUpperCase();
      newValues[rowNumber] = newRow;
      setValues(newValues);
      setSquareNumber(squareNumber => squareNumber + 1);
    }
  }
  
  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, [squareNumber, rowNumber, values]);

  return (
  <>
    <div className="Game"> 
      { 
        rows.map( (elem) =>
          <Row rowNumber={elem} guessArray={values[elem]} wordLength={wordLength} 
                submitted={submitted[elem]} secretWord={secretWord} key={elem}/>
        )
      }
    </div>
  </>
  
  )
}

export default App
