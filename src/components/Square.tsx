import './Square.css';

export default function Square({rowNumber, squareNumber}){
    return (
    <>
    <input className="InputSquare" type="text" pattern="[A-Z]*" maxLength="1" />
    </>
    )

}