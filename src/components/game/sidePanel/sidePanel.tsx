import { equalTo, get, onValue, orderByChild, ref, query, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { Button, ButtonGroup } from "react-bootstrap";

import './sidePanel.css';
import PropertyModal from "../../board/propertyModal";

const images = require.context('../../../assets/icons', true);

function SidePanel({ loggedInUser, selectedGame, properties }: any) {
    const [currentModal, setCurrentModal] = useState<string>("none")
    const [playerBalance, setPlayerBalance] = useState();
    const [playerNames, setPlayerNames] = useState<any[]>([]);
    const [ownedProperties, setOwnedProperties] = useState<any>();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    useEffect(() => {
        if (selectedGame) {
            const balanceQuery = ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid + "/balance");
            onValue(balanceQuery, (snapshot) => {
                if (snapshot.exists()) {
                    setPlayerBalance(snapshot.val());
                }
            });
            const propertiesQuery = ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid + "/properties");
            onValue(propertiesQuery, (snapshot) => {
                if (snapshot.exists()) {
                    var properties: any[] = []
                    for (var i in Object.keys(snapshot.val())) {
                        properties.push(snapshot.val()[Object.keys(snapshot.val())[i]])
                    }
                    setOwnedProperties(properties);
                } else {
                    setOwnedProperties([]);
                }
            })
            get(ref(db, "games/" + selectedGame + "/players")).then((snapshot) => {
                const players = []
                for (var i in Object.keys(snapshot.val())) {
                    players.push(snapshot.val()[Object.keys(snapshot.val())[i]].name)
                }
                setPlayerNames(players)
            });
        }
        if (selectedGame) {

        }
    }, [selectedGame]);

    function handleShow(property: any) {
        if (property) {
            setCurrentModal(property)
            setShow(true)
        }
    }

    function getUpgradeColor(upgradeStatus: any) {
        if (upgradeStatus === "plow")
            return "#ff0000"
        else if (upgradeStatus === "fertilize")
            return "#ded00d"
        else if (upgradeStatus === "plant")
            return "#0b35db"
        else if (upgradeStatus === "gather")
            return "#10e063"
    }

    return (
        <>
            <div className="sidePanel1">
                <h2>Your Balance: {playerBalance}</h2>
                <div>
                    <h3>Your Properties</h3>
                    {ownedProperties && ownedProperties.map((ownedProperty: any) => (
                        <ButtonGroup className="me-3" onClick={() => handleShow(ownedProperty)}>
                            {properties[ownedProperty].upgradeStatus !== "None" && <Button className="mt-3 me-2 propertyButton upgrade border-0" style={{background: getUpgradeColor(properties[ownedProperty].upgradeStatus)}}></Button>}
                            <Button
                                className="mt-3 propertyButton"
                                key={ownedProperty}
                                style={
                                    {
                                        background: properties[ownedProperty].color,
                                        borderWidth: "0",
                                        color: "#000000", fontSize: 12
                                    }
                                }
                            >
                                <img className="me-1 sidePanelIcon" src={images(`./${ownedProperty}.png`)} alt={ownedProperty} />
                                <b>{properties[ownedProperty].name.toUpperCase()}</b>
                            </Button>
                        </ButtonGroup>

                    ))}
                </div>
            </div>
            <div className="sidePanel2">
                <h1>Players</h1>
                {playerNames && playerNames.map((player: any) => (
                    <p>{player}</p>
                ))}
            </div>
            {show && <PropertyModal loggedInUser={loggedInUser} show={show} selectedGame={selectedGame} handleClose={handleClose} properties={properties} currentModal={currentModal} playerBalance={playerBalance} handlePurchase={"None"} />}
        </>
    )
}

export default SidePanel;