import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { db, upgradeProperty } from "../../firebase";
import { useEffect, useState } from "react";
import { get, onValue, ref } from "firebase/database";
const images = require.context('../../assets/icons', true);

function PropertyModal({ show, handleClose, properties, currentModal, playerBalance, handlePurchase, selectedGame, loggedInUser, gameState, boardSpace, didSpin, players }: any) {
    const [didUpgrade, setDidUpgrade] = useState<any>();
    const [propertyOwner, setPropertOwner] = useState<any>();

    useEffect(() => {
        const didUpgradeQuery = ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid + "/didUpgrade");
        onValue(didUpgradeQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setDidUpgrade(data);
            }
        });

        const ownerQuery = ref(db, "games/" + selectedGame + "/properties/" + currentModal + "/owner");
        onValue(ownerQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                if (snapshot.val() !== "None") {
                    setPropertOwner(players[data].name);
                }
            }
        });

    }, []);

    function getUsername(ownerId: any) {
        var returnVal = ""
        if (ownerId !== "None") {
            get(ref(db, "games/" + selectedGame + "/players/" + ownerId + "/name")).then((snapshot) => {
                if (snapshot.exists()) {
                    returnVal = snapshot.val()
                }
            })
        }
        return returnVal
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <>
                    {properties && <Modal.Header closeButton style={{ background: properties[currentModal].color }}>
                        <Modal.Title>{properties[currentModal].name}<img className="mx-2 modalImage" src={images(`./${currentModal}.png`)} alt={currentModal} /></Modal.Title>
                    </Modal.Header>}
                </>
                <Modal.Body>
                    <div className="d-flex">
                        {propertyOwner ? <h4>Owned By: {propertyOwner}</h4> : <h4>Not Owned</h4>}
                        <h4 className="mx-auto">Price: {properties[currentModal].price}</h4>
                    </div>
                    <br></br>
                    <p>Rent Due: {properties[currentModal].rentDue}</p>
                    <Container>
                        <Row>
                            <Col>
                                <p className="mt-1">Plow: {properties[currentModal].plow}</p>
                            </Col>
                            <Col>
                                {(properties[currentModal].upgradeStatus === "None" && loggedInUser.uid === properties[currentModal].owner && !didUpgrade && !properties[currentModal].justPurchased && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid && !didSpin) && <Button onClick={() => upgradeProperty(selectedGame, currentModal, "plow", playerBalance, players, properties)}>Plow</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className="">Fertilize: {properties[currentModal].fertilize}</p>
                            </Col>
                            <Col>
                                {(properties[currentModal].upgradeStatus === "plow" && 
                                    loggedInUser.uid === properties[currentModal].owner && 
                                    !didUpgrade && 
                                    !properties[currentModal].justPurchased &&
                                     gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid &&
                                      !didSpin) && <Button onClick={() => upgradeProperty(selectedGame, currentModal, "fertilize", playerBalance, players, properties)}>Fertilize</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className="">Plant: {properties[currentModal].plant}</p>
                            </Col>
                            <Col>
                                {(properties[currentModal].upgradeStatus === "fertilize" && loggedInUser.uid === properties[currentModal].owner && !didUpgrade && !properties[currentModal].justPurchased && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid && !didSpin) && <Button onClick={() => upgradeProperty(selectedGame, currentModal, "plant", playerBalance, players, properties)}>Plant</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className="mb-1">Gather: {properties[currentModal].gather}</p>
                            </Col>
                            <Col>
                                {(properties[currentModal].upgradeStatus === "plant" && loggedInUser.uid === properties[currentModal].owner && !didUpgrade && !properties[currentModal].justPurchased && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid && !didSpin) && <Button onClick={() => upgradeProperty(selectedGame, currentModal, "gather", playerBalance, players, properties)}>Gather</Button>}
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    {boardSpace && (properties[currentModal].owner === "None" && properties[currentModal].price < playerBalance && handlePurchase !== "None" && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid && boardSpace === properties[currentModal].boardNum && didSpin) ?
                        <Button variant="primary" onClick={() => handlePurchase(properties[currentModal].price)}>Purchase</Button> :
                        <Button disabled variant="primary">Purchase</Button>}
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PropertyModal;