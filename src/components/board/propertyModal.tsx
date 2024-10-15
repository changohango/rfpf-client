import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { db, upgradeProperty } from "../../firebase";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
const images = require.context('../../assets/icons', true);

function PropertyModal({ show, handleClose, properties, currentModal, playerBalance, handlePurchase, selectedGame, loggedInUser, gameState, boardSpace, didSpin }: any) {
    const [didUpgrade, setDidUpgrade] = useState<any>();

    useEffect(() => {
        const didUpgradeQuery = ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid + "/didUpgrade");
        onValue(didUpgradeQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setDidUpgrade(data);
            }
        });
    }, []);

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
                        <h4>Owned By: {properties[currentModal].owner}</h4>
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
                                {(properties[currentModal].upgradeStatus === "None" && loggedInUser.displayName === properties[currentModal].owner && !didUpgrade && !properties[currentModal].justPurchased && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid && !didSpin) && <Button onClick={() => upgradeProperty(selectedGame, currentModal, "plow", playerBalance)}>Plow</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className="">Fertilize: {properties[currentModal].fertilize}</p>
                            </Col>
                            <Col>
                                {(properties[currentModal].upgradeStatus === "plow" && loggedInUser.displayName === properties[currentModal].owner && !didUpgrade && !properties[currentModal].justPurchased && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid && !didSpin) && <Button onClick={() => upgradeProperty(selectedGame, currentModal, "fertilize", playerBalance)}>Fertilize</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className="">Plant: {properties[currentModal].plant}</p>
                            </Col>
                            <Col>
                                {(properties[currentModal].upgradeStatus === "fertilize" && loggedInUser.displayName === properties[currentModal].owner && !didUpgrade && !properties[currentModal].justPurchased && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid && !didSpin) && <Button onClick={() => upgradeProperty(selectedGame, currentModal, "plant", playerBalance)}>Plant</Button>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className="mb-1">Gather: {properties[currentModal].gather}</p>
                            </Col>
                            <Col>
                                {(properties[currentModal].upgradeStatus === "plant" && loggedInUser.displayName === properties[currentModal].owner && !didUpgrade && !properties[currentModal].justPurchased && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid && !didSpin) && <Button onClick={() => upgradeProperty(selectedGame, currentModal, "gather", playerBalance)}>Gather</Button>}
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    {(properties[currentModal].owner === "None" && properties[currentModal].price < playerBalance && handlePurchase !== "None" && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid && boardSpace === properties[currentModal].boardNum && didSpin) ?
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