import './Square.css';

export default function Square({rowNumber, squareNumber, value}){
    return (
    <>
    <input className="InputSquare" type="text" pattern="[A-Z]*" maxLength="1" value={value} disabled/>
    </>
    )

}