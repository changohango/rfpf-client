import { Button, ButtonGroup, Modal } from "react-bootstrap";
import { getUpgradeColor } from "./sidePanel";

function OtherPlayerModal({ player, show, handleClose, properties, images }: any) {
    console.log(player)

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>{player.name}</Modal.Title>
                    </Modal.Header>
                </>
                <Modal.Body>
                    <p>Balance: {player.balance}</p>
                    {player.properties ? <p>Owned Properties:</p> : <p>No properties owned!</p>}
                    {player.properties && Object.keys(player.properties).map((ownedProperty: any) => (
                        <ButtonGroup className="me-3">
                            {properties[player.properties[ownedProperty]].upgradeStatus !== "None" && <Button className="me-2 propertyButton upgrade border-0" style={{ background: getUpgradeColor(properties[player.properties[ownedProperty]].upgradeStatus) }}></Button>}
                            <Button
                                className="propertyButton"
                                key={ownedProperty}
                                style={
                                    {
                                        background: properties[player.properties[ownedProperty]].color,
                                        borderWidth: "0",
                                        color: "#000000", fontSize: 12
                                    }
                                }
                            >
                                <img className="me-1 sidePanelIcon" src={images(`./${player.properties[ownedProperty]}.png`)} alt={player.properties[ownedProperty]} />
                                <b>{properties[player.properties[ownedProperty]].name.toUpperCase()}</b>
                            </Button>
                        </ButtonGroup>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default OtherPlayerModal;