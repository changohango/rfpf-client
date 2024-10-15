import { useEffect, useState } from "react";
import './board.css';
import { Button, Modal } from "react-bootstrap";
import { Property } from "../dashboard/dashboard";
import { db } from "../../firebase";
import Json from "../../assets/json/properties.json"
import { get, onValue, push, ref, set, update } from "firebase/database";
import classNames from "classnames";
import PropertyModal from "./propertyModal";

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

function Board({ gameId, currentUser, properties, playerBalance, gameState, players }: any) {
    const [currentModal, setCurrentModal] = useState<string>("none")
    const [show, setShow] = useState(false);
    const [boardState, setBoardState] = useState(Json)
    const [spinnerResult, setSpinnerResult] = useState(0)
    const [didSpin, setDidSpin] = useState<any>();
    const [purchasedProperty, setPurchasedProperty] = useState<any>();
    const [boardSpace, setBoardSpace] = useState<any>();

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

        const didSpinQuery = ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/didSpin");
        onValue(didSpinQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setDidSpin(data);
            }
        })

        const currentTurnQuery = ref(db, "games/" + gameId + "/gameState/currentTurn");
        onValue(currentTurnQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                if (gameState) {
                    if (gameState["turnOrder"][data] == currentUser.uid) {
                        console.log(data)
                        update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), {
                            "didSpin": false
                        });
                    }
                }
            }
        })

        const boardSpaceQuery = ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/boardSpace");
        onValue(boardSpaceQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setBoardSpace(data);
            }
        })
    }, []);

    const handleClose = () => setShow(false);

    function handleShow(boardSpace: BoardSpace) {
        if (boardSpace.isProperty) {
            setCurrentModal(boardSpace.name)
            setShow(true)
        }
    }

    function handlePurchase(price: any) {
        update(ref(db, "games/" + gameId + "/properties/" + currentModal + "/"), {
            owner: currentUser.displayName
        });
        push(ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/properties"), currentModal)
        const newBal = playerBalance - price
        set(ref(db, "games/" + gameId + "/players/" + currentUser.uid + "/balance"), newBal)
        setBoardState({ ...boardState })
        setPurchasedProperty(currentModal)
    }

    function getRandomSpin(min: number, max: number) {
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
                        } else {
                            newBoardSpace = snapshot.val() + result;
                        }
                        update(ref(db, "games/" + gameId + "/players/" + currentUser.uid), { "boardSpace": newBoardSpace, "didSpin": true });
                    }
                })
            }
        } else {
            getRandomSpin(min, max)
        }
    }

    function endTurn() {
        if (gameState["currentTurn"] + 1 > Object.keys(players).length - 1) {
            update(ref(db, "games/" + gameId + "/gameState"), { "currentTurn": 0 })
        } else {
            update(ref(db, "games/" + gameId + "/gameState"), { "currentTurn": gameState["currentTurn"] + 1 })
        }
        if (purchasedProperty) {
            update(ref(db, "games/" + gameId + "/properties/" + purchasedProperty), { "justPurchased": false })
        }
    }

    function startGame() {
        const numPlayers = Object.keys(players).length
        var shuffle: any = Object.keys(players)
        var currentIndex = numPlayers

        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [shuffle[currentIndex], shuffle[randomIndex]] = [
                shuffle[randomIndex], shuffle[currentIndex]];
        }

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

    if (properties && gameState && players) return (
        <>
            {boardSpaces.map((boardSpace: BoardSpace) => (
                <div className="pointer" key={boardSpace.id}>
                    <img src={boardArt(`./${boardSpace.name}.svg`)} id={boardSpace.name} alt={boardSpace.name} onClick={() => handleShow(boardSpace)}></img>
                </div>
            ))}
            <div id="spinnerBase">
                <img src={boardArt('./spinnerBase.svg')} />
                <img className={conditionalStyles} key={spinnerResult} src={boardArt('./spinner.svg')} />
                <div className="text-center">
                    {(gameState["gameStarted"] && gameState["turnOrder"][gameState["currentTurn"]] === currentUser.uid && !didSpin) && <Button className="my-3" onClick={() => getRandomSpin(1, 9)}>Spin</Button>}
                    {spinnerResult === 9 && <p>LINE!! Spin again</p>}
                </div>
            </div>
            {gameState["gameStarted"] && gameState["turnOrder"][gameState["currentTurn"]] === currentUser.uid && <div id="turnNotification">
                <h3>It is your turn!</h3>
            </div>}
            <div id="startGame">
                {(!gameState["gameStarted"] && gameState["gameOwner"] === currentUser.uid) && <Button onClick={() => startGame()}>Start Game!</Button>}
                {(gameState["gameStarted"] && gameState["turnOrder"][gameState["currentTurn"]] === currentUser.uid) && <Button onClick={() => endTurn()}>End Turn</Button>}
            </div>
            {show && <PropertyModal
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
                        didSpin = {didSpin} />}
        </>
    )
    return (
        <>
            <h1>test2</h1>
        </>
    )
}

export default Board;