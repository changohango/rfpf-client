import React, { useState } from "react";
import './board.css';
import { Button, Modal } from "react-bootstrap";
import Json from '../../assets/properties.json'

const images = require.context('../../assets/artwork', true);

interface Property {
    id: number;
    name: string;
    svgName: string;
}

interface BoardSpace {
    id: number;
    name: string;
}

const boardSpaces: BoardSpace[] = [
    { id: 0, name: "start" },
    { id: 1, name: "landers" },
    { id: 2, name: "vernons" },
    { id: 3, name: "opportunity1" },
    { id: 4, name: "auction1" },
    { id: 5, name: "sharps" },
    { id: 6, name: "parkers" },
    { id: 7, name: "juryDuty" },
    { id: 8, name: "opportunity2" },
    { id: 9, name: "lewis" },
    { id: 10, name: "hendersons" },
    { id: 11, name: "taxes" },
    { id: 12, name: "rainyDay" },
    { id: 13, name: "jacobs" },
    { id: 14, name: "phillips" },
    { id: 15, name: "auction2" },
    { id: 16, name: "opportunity3" },
    { id: 17, name: "scotts" },
    { id: 18, name: "lavenders" },
    { id: 19, name: "interest" },
    { id: 20, name: "familyReunion" },
    { id: 21, name: "jeffreys" },
    { id: 22, name: "millers" },
    { id: 23, name: "opportunity4" },
    { id: 24, name: "auction3" },
    { id: 25, name: "robbins" },
    { id: 26, name: "smiths" },
    { id: 27, name: "cropDamage" },
    { id: 28, name: "opportunity5" },
    { id: 29, name: "watsons" },
    { id: 30, name: "davis" },
    { id: 31, name: "tractor" },
]


function Board() {
    const [currentModal, setCurrentModal] = useState("none")
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    function handleShow(property: string) {
        setCurrentModal(property)
        setShow(true)
    }
    return (
        <>
            {boardSpaces.map((boardSpace: BoardSpace) => (
                <div className="pointer">
                    <img src={images(`./${boardSpace.name}.svg`)} id={boardSpace.name} alt={boardSpace.name} onClick={() => handleShow(boardSpace.name)}></img>
                </div>
            ))}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentModal.toUpperCase()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This is a modal for the {currentModal.toUpperCase()} property.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <h1>{Json.hendersons.boardNum}</h1>
        </>
    )
}

export default Board;