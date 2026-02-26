import { useState } from 'react';
import { useEffect } from 'react';
import Row from '../components/Row.tsx';
import Keyboard from '../components/Keyboard.tsx'
import './App.css';

export enum Guess_Value{
    Green,
    Yellow,
    Grey,
    Black
}

function App() {
  const numGuesses = 6;
  const wordLength = 5;

  const [rowNumber, setRowNumber] = useState(0);
  const [squareNumber, setSquareNumber] = useState(0);
  const [values, setValues] = useState(() => {return [...Array(numGuesses)].map(e => Array(wordLength).fill(''))});
  const [message, setMessage] = useState( () => {return ""});


  let rows = [...Array(numGuesses).keys()];
  const [submitted, setSubmitted] =  useState(() => {return [...Array(numGuesses).fill(false)]});
  const secretWord = "steel";

  //Lazy init dictionary for the states of all letters
  const [letterStates, setLetterStates] = useState(() => {
    let alphabet = [...Array(26).keys()].map(e=>String.fromCharCode(e+65));
    let initSet: {[key:string]: Guess_Value} = {};
    for (let i = 0; i < alphabet.length; i++){
      initSet[alphabet[i]] = Guess_Value.Black;
    }
    return initSet;
  }); 
  
  function keyDownHandler(e: globalThis.KeyboardEvent) {
    //Try to submit
    if(e.key == "Enter"){
      if (squareNumber < wordLength){
        setMessage("Not enough letters");
        return;
      }
      else{
        //TODO: check if word is in list
        let newSubmitted = submitted.slice();
        newSubmitted[rowNumber] = true;
        setSubmitted(newSubmitted);
        setRowNumber(rowNumber => rowNumber + 1);
        setSquareNumber(0);
        setMessage("");
        return;
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
      return;
    }

    //Check for valid letter
    else if( !(/^[a-z]$/i.test(e.key))){
      console.log("Invalid input");
      return;
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
  
  //Change messages
  useEffect(() => {
    const element: HTMLElement|null = document.getElementById("Message");

    function removeStyle(element: HTMLElement){
      element.className = "msg_hidden";
      setMessage("");
    };

    function changeStyle(element: HTMLElement){
    element.style.width = `${message.length + 2}pc`;
    element.className = "msg_show"
    setTimeout(removeStyle,3000,element);
    };

    if (message != ""){
    element ? changeStyle(element): null;
    };
  }, [message]);

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
          <Row guessArray={values[elem]} wordLength={wordLength} submitted={submitted[elem]} 
               secretWord={secretWord} key={elem} letterStates={letterStates} setLetterStates={setLetterStates}/>
        )
      }
      
    </div>

    <div className='MessageBox'>
      <input className="msg_hidden" id="Message" value={message} disabled /> 
    </div>
    <Keyboard letterStates={letterStates}></Keyboard>
  </>
  
  )
}

export default App
