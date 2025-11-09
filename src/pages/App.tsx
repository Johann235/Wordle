import { useState } from 'react';
import { useEffect } from 'react';
import Row from '../components/Row.tsx';

import './App.css';

function App() {
  function keyDownHandler(e: globalThis.KeyboardEvent) {
      console.log(e.key);
    }

  const [rowNumber, setRowNumber] = useState(0);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, []);

  return (
  <>
    <div className="Game"> 
          <Row rowNumber={0} />
          <Row rowNumber={1}/>
          <Row rowNumber={2}/>
          <Row rowNumber={3}/>
          <Row rowNumber={4}/>
    </div>
  </>
  
  )
}

export default App
