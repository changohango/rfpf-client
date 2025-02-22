import { useEffect, useState } from "react";
import './board.css';
import { Button, ButtonGroup, Card, Dropdown, Modal, Toast } from "react-bootstrap";
import { Property } from "../dashboard/dashboard";
import { db, getPassGo, handlePropertyLandedOn } from "../../firebase";
import Json from "../../assets/json/properties.json"
import { get, onValue, push, ref, set, update } from "firebase/database";
import classNames from "classnames";
import PropertyModal from "./propertyModal";
import { boardActions } from "./boardActions";
import { getUpgradeColor } from "../game/sidePanel/sidePanel";
import useSound from "use-sound";
import knockSound from '../../assets/sounds/knock.mp3'
import { getMessage } from "./boardActions";
import { getRiskCardActions } from "./riskCardActions";

const boardArt = require.context('../../assets/artwork', true);
const images = require.context('../../assets/icons', true);

interface BoardSpace {
    id: number;
    name: string;
    isProperty: boolean;
}

const lineDegrees = [23, 67, 112, 157, 203, 247, 294, 339]

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

export interface BoardProps {
    [key: string]: Property;
}

function Board({ gameId, currentUser, properties, playerBalance, gameState, players, didSpin }: any) {
    const [currentModal, setCurrentModal] = useState<string>("none")
    const [show, setShow] = useState(false);
    const [boardState, setBoardState] = useState(Json)
    const [spinnerResult, setSpinnerResult] = useState(0)
    const [purchasedProperty, setPurchasedProperty] = useState<any>();
    const [boardSpace, setBoardSpace] = useState<any>();
    const [displayPieces, setDisplayPieces] = useState<any>();
    const [showToast, setShowToast] = useState<any>(false);
    const [showPlayerToast, setShowPlayerToast] = useState<any>(false);
    const [playerToastDetails, setPlayerToastDetails] = useState<any>(false);
    const [toastDetails, setToastDetails] = useState<any>();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isNoRentDue, setIsNoRentDue] = useState<any>(false)
    const [isNextTurnLost, setIsNextTurnLost] = useState<any>(false);
    const [doubleTurnLost, setDoubleTurnLost] = useState<any>(false);
    const [lostTurnTracker, setLostTurnTracker] = useState<any>(0);
    const [messageDisplay, setMessageDisplay] = useState<any>(false)
    const [displayRisk, setDisplayRisk] = useState<boolean>(false);
    const [outstandingBalnce, setOutstandingBalance] = useState<any>(0);
    const [showSell, setShowSell] = useState<any>(false);
    const [gameCode, setGameCode] = useState<any>("")

    const [play] = useSound(knockSound);

    const conditionalStyles = classNames("spinner", {
        "noAnimation": spinnerResult === 0,
        "animation1": spinnerResult === 1,
        "animation2": spinnerResult === 2,
        "animation3": spinnerResult === 3,
        "animation4": spinnerResult === 4,
        "animation5": spinnerResult === 5,
        "animation6": spinnerResult === 6,
        "animation7": spinnerResult === 7,
        "animation8": spinnerResult === 8,
        "line": spinnerResult === 9
    })

    useEffect(() => {
        const handleMouseMove = (event: any) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (gameState) {
            setMessageDisplay(gameState.message);
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState && players && gameState.gameStarted && gameState.turnOrder[gameState.currentTurn] == currentUser.uid && !players[currentUser.uid].didSpin && !players[currentUser.uid].didUpgrade) {
            setMessage("It is " + players[currentUser.uid].name + "'s turn!")
        }
    })

    useEffect(() => {
        const query = ref(db, "games/" + gameId + "/gameState/spinnerResult");
        onValue(query, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                if (data === 9) {
                    const randIndex = Math.floor(Math.random() * (7 - 0 + 1));
                    const root = document.documentElement;
                    root.style.setProperty('--lineNumber', `${lineDegrees[randIndex]}deg`)
                }
                setSpinnerResult(data);
            }
        });

        const boardSpaceQuery = ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/boardSpace");
        onValue(boardSpaceQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setBoardSpace(data);
            }
        })

        const isSellingQuery = ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/isSelling");
        onValue(isSellingQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setShowSell(data);
            }
        })

        const gameCodeQuery = ref(db, "games/" + gameId + "/gameId");
        onValue(gameCodeQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setGameCode(data);
            }
        })

        const amountStillOwedQuery = ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/amountStillOwed");
        onValue(amountStillOwedQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setOutstandingBalance(data);
            }
        })


        const displayPiecesQuery = ref(db, "games/" + gameId + "/players/")
        onValue(displayPiecesQuery, (snapshot) => {
            const data = snapshot.val()
            var newDisplayPieces = []
            if (snapshot.exists()) {
                for (var i in Object.keys(data)) {
                    if (!data[Object.keys(data)[i]].isOut) {
                        var newObj: any = {}
                        newObj[Object.keys(data)[i]] = { name: data[Object.keys(data)[i]].name, "boardSpace": data[Object.keys(data)[i]].boardSpace, "color": data[Object.keys(data)[i]].tractorColor }
                        newDisplayPieces.push(newObj)
                    }
                }
            }
            setDisplayPieces(newDisplayPieces)
        })
    }, []);

    useEffect(() => {
        if (players && gameState) {
            if (players[currentUser.uid].isNoRentDue && gameState.turnOrder[gameState.currentTurn] === currentUser.uid) {
                update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "isNoRentDue": false })
                setIsNoRentDue(false)
            }
            if (players[currentUser.uid].isNextTurnLost && gameState.turnOrder[gameState.currentTurn] === currentUser.uid) {
                if (gameState["currentTurn"] + 1 > Object.keys(gameState.turnOrder).length - 1) {
                    update(ref(db, "games/" + gameId + "/gameState"), { "currentTurn": 0 })
                } else {
                    update(ref(db, "games/" + gameId + "/gameState"), { "currentTurn": gameState["currentTurn"] + 1 })
                }
                if (doubleTurnLost && !lostTurnTracker) {
                    setLostTurnTracker(true)
                } else {
                    setIsNextTurnLost(false)
                    update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "isNextTurnLost": false })
                }
            }
        }
    }, [gameState])

    const handleClose = () => setShow(false);

    function setMessage(message: any) {
        if (message)
            update(ref(db, "games/" + gameId + "/gameState"), { "message": message })
    }

    function handleShow(boardSpace: BoardSpace) {
        if (boardSpace.isProperty) {
            setCurrentModal(boardSpace.name)
            setShow(true)
        }
    }

    function handlePurchase(price: any) {
        update(ref(db, "games/" + gameId + "/properties/" + currentModal + "/"), {
            owner: currentUser.uid
        });
        push(ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/properties"), currentModal)
        const newBal = playerBalance - price
        set(ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/balance"), newBal)
        setMessage(players[currentUser.uid].name + " has purchased " + properties[currentModal].name + " for " + price)
        setBoardState({ ...boardState })
        setPurchasedProperty(currentModal)
    }

    function handleSpin(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        const result = Math.floor(Math.random() * (max - min + 1)) + min;

        if (result != spinnerResult) {
            update(ref(db, "games/" + gameId + "/gameState/"), { "spinnerResult": result });
            if (result !== 9) {
                get(ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/boardSpace")).then((snapshot) => {
                    if (snapshot.exists()) {
                        var newBoardSpace = 0
                        if (snapshot.val() + result > 31) {
                            newBoardSpace = (snapshot.val() + result) % 32
                            getPassGo(currentUser.uid, gameId, players, setMessage)
                        } else {
                            newBoardSpace = snapshot.val() + result;
                        }
                        update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "boardSpace": newBoardSpace, "didSpin": true });
                        var match: any = ""
                        for (var i in Object.keys(properties)) {
                            if (properties[Object.keys(properties)[i]].boardNum == newBoardSpace) {
                                match = Object.keys(properties)[i]
                            }
                        }
                        if (match !== "") {
                            handlePropertyLandedOn(gameId, properties, currentUser.uid, players, setMessage, match)
                        } else {
                            switch (newBoardSpace) {
                                case 3:
                                case 8:
                                case 16:
                                case 23:
                                case 28:
                                    play()
                                    setDisplayRisk(true)
                                    break;
                            }
                            const boardAction = boardActions(gameId, currentUser.uid, newBoardSpace, players)
                            setMessage(getMessage(currentUser.uid, newBoardSpace, players))
                            if (boardAction === "noRentDue") {
                                setIsNoRentDue(true)
                            }
                            if (boardAction === "nextTurnLost") {
                                console.log("Next turn being lost")
                                setIsNextTurnLost(true)
                            }
                        }
                    }
                })
            }
        } else {
            handleSpin(min, max)
        }
    }

    function handleRisk() {
        setDisplayRisk(false)
        if (!gameState['riskOrder']) {
            const riskOrder = Array.from({ length: 40 }, (_, index) => index);
            gameState['riskOrder'] = riskOrder
        }
        console.log(gameState['riskOrder'])
        const randomInt = Math.floor(Math.random() * gameState['riskOrder'].length - 1);
        const cardNum = gameState['riskOrder'].splice(randomInt, 1)
        update(ref(db, "games/" + gameId + "/gameState"), { "riskOrder": gameState['riskOrder'] })
        getRiskCardActions(cardNum[0], gameId, currentUser.uid, players, setMessage, properties, setIsNoRentDue, setIsNextTurnLost, setDoubleTurnLost)
    }

    function endTurn() {
        if (gameState["currentTurn"] + 1 > Object.keys(gameState.turnOrder).length - 1) {
            update(ref(db, "games/" + gameId + "/gameState"), { "currentTurn": 0 })
        } else {
            update(ref(db, "games/" + gameId + "/gameState"), { "currentTurn": gameState["currentTurn"] + 1 })
        }
        if (purchasedProperty) {
            update(ref(db, "games/" + gameId + "/properties/" + purchasedProperty), { "justPurchased": false })
        }
        update(ref(db, "games/" + gameId + "/properties/jacobs"), { "price": 4370 })
        update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "didUpgrade": false, "didSpin": false, "isNoRentDue": isNoRentDue, "isNextTurnLost": isNextTurnLost })
    }

    function startGame() {
        const numPlayers = Object.keys(players).length
        var shuffle: any = Object.keys(players)
        var currentIndex = numPlayers

        const tractorColors = ["blue", "red", "green", "brown", "yellow", "black"]

        for (var i in Object.keys(players)) {
            const randIndex = Math.floor(Math.random() * tractorColors.length)
            var tractorColor = tractorColors[randIndex];
            players[Object.keys(players)[i]].tractorColor = tractorColor
            tractorColors.splice(randIndex, 1);
        }
        update(ref(db, "games/" + gameId + "/players"), players)

        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [shuffle[currentIndex], shuffle[randomIndex]] = [
                shuffle[randomIndex], shuffle[currentIndex]];
        }

        //Initiate Risk Cards
        const riskOrder = Array.from({ length: 40 }, (_, index) => index);
        update(ref(db, "games/" + gameId + "/gameState"), { "riskOrder": riskOrder })

        const turnOrder: any = {}
        for (var i in shuffle.length) {
            turnOrder[shuffle[i]] = true
        }

        var newGameState = gameState
        newGameState["gameStarted"] = true
        newGameState["turnOrder"] = shuffle
        newGameState["currentTurn"] = 0
        update(ref(db, "games/" + gameId + "/gameState/"), newGameState)
    }

    function handleShowToast(boardSpace: any, upgradeStatus: any) {
        setShowToast(true)
        setToastDetails(boardSpace)
    }

    function handleShowPlayerToast(name: any) {
        setShowPlayerToast(true)
        setPlayerToastDetails(name)
    }

    function handleSell(property: any, mode: any, buyer: any) {
        if (mode === 1) {
            const upgradeStatus = properties[property].upgradeStatus
            var newUpgradeStatus = ""
            var gains = 0
            switch (upgradeStatus) {
                case "plow":
                    newUpgradeStatus = "None"
                    gains = properties[property]["plow"] / 2
                    break;
                case "fertilize":
                    newUpgradeStatus = "plow"
                    gains = properties[property]["fertilize"] / 2
                    break;
                case "plant":
                    newUpgradeStatus = "fertilize"
                    gains = properties[property]["plant"] / 2
                    break;
                case "gather":
                    newUpgradeStatus = "plant"
                    gains = properties[property]["gather"] / 2
                    break;
            }
            update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "balance": players[currentUser.uid].balance + gains, "amountStillOwed": players[currentUser.uid].amountStillOwed - gains })
            if (newUpgradeStatus !== "None") {
                update(ref(db, "games/" + gameId + "/properties/" + property), { "upgradeStatus": newUpgradeStatus, "rentDue": properties[property].displayRent })
            } else {
                update(ref(db, "games/" + gameId + "/properties/" + property), { "upgradeStatus": newUpgradeStatus, "rentDue": properties[properties[property].newUpgradeStatus] })
            }
        } else if (mode === 0) {
            for (const key in players[currentUser.uid].properties) {
                if (players[currentUser.uid].properties[key] === property) {
                    delete players[currentUser.uid].properties[key];
                }
            }
            update(ref(db, "games/" + gameId + "/properties/" + property), { "owner": "None", "rentDue": properties[property].displayRent })
            update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "balance": players[currentUser.uid].balance + properties[property].sell, "amountStillOwed": players[currentUser.uid].amountStillOwed - properties[property].sell, "properties": players[currentUser.uid].properties })
        } else if (mode === 2) {
            for (const key in players[currentUser.uid].properties) {
                if (players[currentUser.uid].properties[key] === property) {
                    delete players[currentUser.uid].properties[key];
                }
            }
            update(ref(db, "games/" + gameId + "/properties/" + property + "/"), {
                owner: buyer
            });
            push(ref(db, "games/" + gameId + "/players/" + buyer + "/properties"), property)
            const newBal = players[buyer].balance - properties[property].sell
            set(ref(db, "games/" + gameId + "/players/" + buyer + "/balance"), newBal)
            setMessage(players[buyer].name + " has purchased " + properties[property].name + " from " + players[currentUser.uid].name +  " for " + properties[property].sell)
            setBoardState({ ...boardState })
            update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "balance": players[currentUser.uid].balance + properties[property].sell, "amountStillOwed": players[currentUser.uid].amountStillOwed - properties[property].sell, "properties": players[currentUser.uid].properties })
        }
    }

    function handleConcede() {
        setShowSell(false)
        var newTurnOrder: any = []
        var nextTurn = 0
        for (var i = 0; i < Object.keys(gameState.turnOrder).length; i++) {
            if (gameState.turnOrder[i] === currentUser.uid) {
                if (i + 1 >= gameState.turnOrder.length) {
                    nextTurn = 0
                } else {
                    nextTurn = gameState.currentTurn
                }
            } else {
                newTurnOrder.push(gameState.turnOrder[i])
            }
        }
        if (players[currentUser.uid].properties) {
            console.log(players[currentUser.uid].properties)
            Object.keys(players[currentUser.uid].properties).forEach((key) => {
                properties[players[currentUser.uid].properties[key]].owner = "None"
                properties[players[currentUser.uid].properties[key]].upgradeStaus = "None"
                properties[players[currentUser.uid].properties[key]].rentDue = properties[players[currentUser.uid].properties[key]].displayRent
            })
        }
        players[currentUser.uid].properties = {}
        update(ref(db, "games/" + gameId + "/properties"), properties)
        update(ref(db, "games/" + gameId + "/gameState"), { "turnOrder": newTurnOrder, "currentTurn": nextTurn })
        update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "isOut": true })
    }

    function handleContinue() {
        setShowSell(false)
        update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "isSelling": false, "amountStillOwed": 0 })
    }

    if (properties && gameState && players) return (
        <>
            {boardSpaces.map((boardSpace: BoardSpace) => (
                <div className="pointer" key={boardSpace.id}>
                    {boardSpace.isProperty ?
                        <>
                            <div className={boardSpace.name + " " + properties[boardSpace.name].upgradeStatus}>
                                <img
                                    src={boardArt(`./${boardSpace.name}.svg`)}
                                    id={boardSpace.name} alt={boardSpace.name}
                                    onClick={() => handleShow(boardSpace)}
                                    onMouseEnter={() => handleShowToast(boardSpace.name, properties[boardSpace.name].upgradeStatus)}
                                    onMouseLeave={() => setShowToast(false)}
                                ></img>
                            </div>
                            <div className={boardSpace.name + "-diag " + properties[boardSpace.name].upgradeStatus} >
                            </div>
                        </> :
                        <div className={boardSpace.name}>
                            <img src={boardArt(`./${boardSpace.name}.svg`)} id={boardSpace.name} alt={boardSpace.name} onClick={() => handleShow(boardSpace)}></img>
                        </div>
                    }
                </div >
            ))
            }
            <div id="spinnerBase">
                <img src={boardArt('./spinnerBase.svg')} />
                <img className={conditionalStyles} key={spinnerResult} src={boardArt('./spinner.svg')} />
                <div className="text-center">
                    {(gameState["gameStarted"] && gameState["turnOrder"][gameState["currentTurn"]] === currentUser.uid && !didSpin) && <Button className="my-3" onClick={() => handleSpin(1, 9)}>Spin</Button>}
                    {spinnerResult === 9 && <p>LINE!! Spin again</p>}
                </div>
            </div>

            {showSell && <Modal show={showSell} backdrop="static">
                <Modal.Header>
                    <Modal.Title>Sell Properties</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You are facing elimination! Sell upgrades and properties until you have enough to pay. If you can't, you have to concede.</p>
                    {outstandingBalnce > 0 ? <strong style={{ color: "red" }}>Amount still owed: {players[currentUser.uid].amountStillOwed} </strong> : <strong style={{ color: "green" }}>No outstanding balance!</strong>}
                    <hr />
                    {players[currentUser.uid].properties ? Object.values(players[currentUser.uid].properties).map((ownedProperty: any) => (
                        <div>
                            <Card>
                                <Card.Title className="text-center">
                                    <ButtonGroup key={properties[ownedProperty].name} onClick={() => handleShow(ownedProperty)}>
                                        {properties[ownedProperty].upgradeStatus !== "None" && <Button className="mt-3 me-2 propertyButton upgrade border-0" style={{ background: getUpgradeColor(properties[ownedProperty].upgradeStatus) }}></Button>}
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
                                </Card.Title>
                                <Card.Body className="text-center">
                                    {properties[ownedProperty].upgradeStatus !== "None" ?
                                        <Button onClick={() => handleSell(ownedProperty, 1, null)} className="mt-1">Sell Upgrade to Bank for {properties[ownedProperty][properties[ownedProperty].upgradeStatus] / 2}</Button> :
                                        <div>
                                            <Button onClick={() => handleSell(ownedProperty, 0, null)} className="mt-1">Sell Property to Bank for {properties[ownedProperty].sell}</Button>
                                            <Dropdown className="mt-2">
                                                <Dropdown.Toggle>Sell Property to Player</Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {players && Object.values(players).map((player: any, i: any) => (
                                                        Object.keys(players)[i] !== currentUser.uid && player.balance > properties[ownedProperty].sell && <Dropdown.Item onClick={() => handleSell(ownedProperty, 2, Object.keys(players)[i])}>{player.name}</Dropdown.Item>
                                                    ))}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    }
                                </Card.Body>
                            </Card>
                        </div>
                    )) : <p>No properties owned :(</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleConcede()}>Concede</Button>
                    <Button disabled={outstandingBalnce > 0} onClick={() => handleContinue()}>Continue</Button>
                </Modal.Footer>
            </Modal>}
            <div className="text-center turnNotification">
                <h5 className="text-center">{messageDisplay}</h5>
                {!gameState["gameStarted"] && <h5>Code: {gameCode}</h5>}
                {displayRisk && <div className="d-flex">
                    <Button className="ms-3 me-5" onClick={() => handleRisk()}>Draw Risk Card</Button>
                    <Button onClick={() => setDisplayRisk(false)}>Decline</Button>
                </div>}
            </div>
            <div id="startGame">
                {(!gameState["gameStarted"] && gameState["gameOwner"] === currentUser.uid) && <Button onClick={() => startGame()}>Start Game!</Button>}
                {(gameState["gameStarted"] && gameState["turnOrder"][gameState["currentTurn"]] === currentUser.uid && didSpin) && <Button onClick={() => endTurn()}>End Turn</Button>}
            </div>
            {toastDetails && <Toast show={showToast} style={{
                position: 'absolute',
                top: mousePosition.y + 10,
                left: mousePosition.x + 10,
                zIndex: 9999
            }}>
                <Toast.Header closeButton={false} style={{
                    background: properties[toastDetails].color
                }}>
                    <strong className="me-auto">{properties[toastDetails].name}</strong>
                </Toast.Header>
                <Toast.Body>{properties[toastDetails].owner !== "None" ? "Owned By: " + players[properties[toastDetails].owner].name : "Not Owned"} {properties[toastDetails].upgradeStatus !== "None" && "// Upgrade Status: " + properties[toastDetails].upgradeStatus} </Toast.Body>
            </Toast>}
            {playerToastDetails && <Toast show={showPlayerToast} style={{
                position: 'absolute',
                top: mousePosition.y + 10,
                left: mousePosition.x + 10,
                zIndex: 9999,
            }}>
                <Toast.Body>{playerToastDetails}</Toast.Body>
            </Toast>}
            {
                show && <PropertyModal
                    loggedInUser={currentUser}
                    show={show}
                    selectedGame={gameId}
                    handleClose={handleClose}
                    properties={properties}
                    currentModal={currentModal}
                    playerBalance={playerBalance}
                    handlePurchase={handlePurchase}
                    gameState={gameState}
                    boardSpace={boardSpace}
                    didSpin={didSpin}
                    players={players} />
            }
            {
                gameState["gameStarted"] && displayPieces && displayPieces.length > 0 &&
                Object.entries(displayPieces.reduce((acc: Record<string, any[]>, piece: any) => {
                    const boardSpace = piece[Object.keys(piece)[0]].boardSpace;
                    if (!acc[boardSpace]) acc[boardSpace] = [];
                    acc[boardSpace].push(piece);
                    return acc;
                }, {})).map(([boardSpace, piecesAtSpot]) => (
                    (piecesAtSpot as any[]).map((piece: any, i: number) => (
                        <div id={`boardSpace${boardSpace}`}>
                            <img
                                onMouseEnter={() => handleShowPlayerToast(piece[Object.keys(piece)[0]].name)}
                                onMouseLeave={() => setShowPlayerToast(false)}
                                key={`tractor${boardSpace}-${i}`}
                                src={boardArt(`./gamePiece.svg`)}
                                className={`gamePiece gamePiece-${piece[Object.keys(piece)[0]].color}`}
                                alt={`tractor${boardSpace}`}
                                style={{
                                    position: 'relative',
                                    top: i * 10 + 'px',
                                    left: i * 5 + 'px',
                                    zIndex: i + 10,
                                }}
                            />
                        </div>
                    ))
                ))
            }
        </>
    )

    return (
        <>
        </>
    )
}

export default Board;