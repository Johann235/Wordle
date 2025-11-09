import Square from "./Square.tsx"
import './Row.css';

export default function Row({rowNumber}){
    return (
    <>
        <div className="Row">
            <Square rowNumber={rowNumber} squareNumber={0}/>
            <Square rowNumber={rowNumber} squareNumber={1}/>
            <Square rowNumber={rowNumber} squareNumber={2}/>
            <Square rowNumber={rowNumber} squareNumber={3}/>
            <Square rowNumber={rowNumber} squareNumber={4}/> 
        </div>
   
    </>
    )

}