import { useState } from "react";
import './board.css';
import { Button, Modal } from "react-bootstrap";
import Json from '../../assets/properties.json'

const boardArt = require.context('../../assets/artwork', true);
const images = require.context('../../assets/icons', true);

interface BoardSpace {
    id: number;
    name: string;
    isProperty: boolean;
}

const boardSpaces: BoardSpace[] = [
    { id: 0, name: "start", isProperty: false },
    { id: 1, name: "landers", isProperty: true },
    { id: 2, name: "vernons", isProperty: true },
    { id: 3, name: "opportunity1", isProperty: false },
    { id: 4, name: "auction1", isProperty: false },
    { id: 5, name: "sharps", isProperty: true },
    { id: 6, name: "parkers", isProperty: true },   
    { id: 7, name: "juryDuty", isProperty: false },
    { id: 8, name: "opportunity2", isProperty: false },
    { id: 9, name: "lewis", isProperty: true },
    { id: 10, name: "hendersons", isProperty: true },
    { id: 11, name: "taxes", isProperty: false },
    { id: 12, name: "rainyDay", isProperty: false },
    { id: 13, name: "jacobs", isProperty: true },
    { id: 14, name: "phillips", isProperty: true },
    { id: 15, name: "auction2", isProperty: false },
    { id: 16, name: "opportunity3", isProperty: false },
    { id: 17, name: "scotts", isProperty: true },
    { id: 18, name: "lavenders", isProperty: true },
    { id: 19, name: "interest", isProperty: false },
    { id: 20, name: "familyReunion", isProperty: false },
    { id: 21, name: "jeffreys", isProperty: true },
    { id: 22, name: "millers", isProperty: true },
    { id: 23, name: "opportunity4", isProperty: false },
    { id: 24, name: "auction3", isProperty: false },
    { id: 25, name: "robbins", isProperty: true },
    { id: 26, name: "smiths", isProperty: true },
    { id: 27, name: "cropDamage", isProperty: false },
    { id: 28, name: "opportunity5", isProperty: false },
    { id: 29, name: "watsons", isProperty: true },
    { id: 30, name: "davis", isProperty: true },
    { id: 31, name: "tractor", isProperty: false },
]

function Board() {
    const [currentModal, setCurrentModal] = useState<string>("none")
    const [show, setShow] = useState(false);
    const [boardState, setBoardState] = useState(Json)

    const handleClose = () => setShow(false);

    function handleShow(boardSpace: BoardSpace) {
        if (boardSpace.isProperty) {
            setCurrentModal(boardSpace.name)
            setShow(true)
        }
    }

    function handlePurchase() {
        boardState[currentModal as keyof typeof boardState].owner = "Jonny"
        setBoardState({...boardState})
    }

    return (
        <>
            {boardSpaces.map((boardSpace: BoardSpace) => (
                <div className="pointer" key={boardSpace.id}>
                    <img src={boardArt(`./${boardSpace.name}.svg`)} id={boardSpace.name} alt={boardSpace.name} onClick={() => handleShow(boardSpace)}></img>
                </div>
            ))}
            {show && <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton style={{ background: boardState[currentModal as keyof typeof boardState].color }}>
                    <Modal.Title>{boardState[currentModal as keyof typeof boardState].name}<img className="mx-2 modalImage" src={images(`./${currentModal}.png`)} alt={currentModal}/></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex">
                        <h4>Owned By: {boardState[currentModal as keyof typeof boardState].owner}</h4>
                        <h4 className="mx-auto">Price: {boardState[currentModal as keyof typeof boardState].price}</h4>
                    </div>
                    <br></br>
                    <p>Rent Due: {boardState[currentModal as keyof typeof boardState].rentDue}</p>
                    <p>Plow: {boardState[currentModal as keyof typeof boardState].plow}</p>
                    <p>Fertilize: {boardState[currentModal as keyof typeof boardState].fertilize}</p>
                    <p>Plant: {boardState[currentModal as keyof typeof boardState].plant}</p>
                    <p>Gather: {boardState[currentModal as keyof typeof boardState].gather}</p>
                </Modal.Body>
                <Modal.Footer>
                    {boardState[currentModal as keyof typeof boardState].owner === "None" ?
                        <Button variant="primary" onClick={handlePurchase}>Purchase</Button> : 
                        <Button disabled variant="primary" onClick={handlePurchase}>Purchase</Button> }
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>}
        </>
    )
}

export default Board;