import { useState } from 'react';
import { useEffect } from 'react';
import Row from '../components/Row.tsx';
import Keyboard from '../components/Keyboard.tsx'
import './App.css';
import fs from 'node:fs';

export enum Guess_Value{
    Green,
    Yellow,
    Grey,
    Black
}

function App() {
  const numGuesses = 6;
  const wordLength = 5;

  const [gameOver, setGameOver] = useState(false);
  const [rowNumber, setRowNumber] = useState(0);
  const [squareNumber, setSquareNumber] = useState(0);
  const [values, setValues] = useState(() => {return [...Array(numGuesses)].map(e => Array(wordLength).fill(''))});
  const [message, setMessage] = useState( () => {return ""});


  let rows = [...Array(numGuesses).keys()];
  let validWords = new Set();
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
    if(gameOver){
      return;
    }
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
        localStorage.setItem("rowNum", `${rowNumber + 1}`);
        if (rowNumber == numGuesses - 1){
          setMessage("Game over </3");
          localStorage.setItem("gameOver", "true")
          setGameOver(true);
        }
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

    //Check for invalid letter
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

  //Persisting guesses
  useEffect(() => {
    let guesses = localStorage.getItem("guesses");
    let rowNum = localStorage.getItem("rowNum");
    let isGameOver = localStorage.getItem("gameOver");
    gameOver? setGameOver(Boolean(isGameOver)) : null;
    rowNum? setRowNumber(Number(rowNum)): null;
    if (guesses){
      let curGuesses = guesses?.split(",");
      let newValues: string[][] = [];
      let newSubmitted: boolean[] = [];
      for (let i = 0; i < curGuesses.length; i ++){
        newValues.push(curGuesses[i].split(""))
        newSubmitted.push(true);
      };
      for (let i = curGuesses.length; i < numGuesses; i ++){
        newValues.push(Array(5).fill(""));
        newSubmitted.push(false);
      };
      localStorage.setItem("guesses", "");
      setValues(newValues);
      setSubmitted(newSubmitted)
    };
    

    fs.readFile('../words/word_list.txt', 'utf8', (err: unknown, data: string) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    });
    
  },[]);


  //For keyboard input
  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, [squareNumber, rowNumber, values,gameOver]);

  return (
  <>
    <div className="Game"> 
      { 
        rows.map( (elem) =>
          <Row guessArray={values[elem]} wordLength={wordLength} submitted={submitted[elem]} setGameOver={setGameOver} 
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
