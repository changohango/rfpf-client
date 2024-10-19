import { useEffect, useState } from "react";
import Board from "../board/board";
import SidePanel from "./sidePanel/sidePanel";
import Json from "../../assets/json/properties.json"
import { get, onValue, ref, update } from "firebase/database";
import { db } from "../../firebase";
import { Button, Card } from "react-bootstrap";


function Game({ selectedGame, loggedInUser }: any) {
    const [properties, setProperties] = useState<any>(Json)
    const [playerBalance, setPlayerBalance] = useState();
    const [gameState, setGameState] = useState<any>();
    const [players, setPlayers] = useState<any>({});
    const [didSpin, setDidSpin] = useState<any>(false);
    const [isGameOver, setIsGameOver] = useState<any>(false);
    const [viewStats, setViewStats] = useState<any>(false);

    useEffect(() => {
        if (selectedGame) {
            const balanceQuery = ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid + "/balance");
            onValue(balanceQuery, (snapshot) => {
                if (snapshot.exists() && gameState && "turnOrder" in gameState && gameState["turnOrder"][gameState["currentTurn"]] === loggedInUser.uid) {
                    if (snapshot.val() < 1) {
                        var newTurnOrder: any = []
                        var nextTurn = 0
                        for (var i = 0; i < Object.keys(gameState.turnOrder).length; i++) {
                            if (gameState.turnOrder[i] === loggedInUser.uid) {
                                if (i + 1 >= gameState.turnOrder.length) {
                                    nextTurn = 0
                                } else {
                                    nextTurn = gameState.currentTurn
                                }
                            } else {
                                newTurnOrder.push(gameState.turnOrder[i])
                            }
                        }
                        if (players[loggedInUser.uid].properties) {
                            for (var j in Object.keys(players[loggedInUser.uid].properties)) {
                                properties[j].owner = "None"
                                properties[j].upgradeStaus = "None"
                                properties[j].rentDue = properties[j].displayRent
                            }
                        }
                        players[loggedInUser.uid].properties = {}
                        update(ref(db, "games/" + selectedGame + "/properties"), properties)
                        update(ref(db, "games/" + selectedGame + "/players"), players)
                        update(ref(db, "games/" + selectedGame + "/gameState"), { "turnOrder": newTurnOrder, "currentTurn": nextTurn })
                        update(ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid), { "isOut": true })
                    } else {
                        update(ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid), { "isOut": false })
                    }
                }
            });
        }
    }, [playerBalance])

    useEffect(() => {
        const didSpinQuery = ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid + "/didSpin");
        onValue(didSpinQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setDidSpin(data);
            }
        })

        if (selectedGame) {
            const balanceQuery = ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid + "/balance");
            onValue(balanceQuery, (snapshot) => {
                if (snapshot.exists()) {
                    setPlayerBalance(snapshot.val());
                }
            });
        }

        const query = ref(db, "games/" + selectedGame);
        onValue(query, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setProperties(data.properties)
            }
        });
        const gameStateQuery = ref(db, "games/" + selectedGame + "/gameState")
        onValue(gameStateQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setGameState(data)
            }
        })
        const playersQuery = ref(db, "games/" + selectedGame + "/players")
        onValue(playersQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setPlayers(data)
            }
        })
    }, []);

    useEffect(() => {
        if (gameState && "turnOrder" in gameState) {
            if (Object.keys(gameState.turnOrder).length < 2) {
                setIsGameOver(true)
                console.log("Game is over!");
            }
        }
    }, [gameState])


    if (isGameOver && players) {
        if (viewStats) {
            return (
                <>
                    <h1>Stats</h1>
                    <div className="d-flex">
                        {players && Object.keys(players).map((player: any) => (
                            <Card className="me-3" key={players[player].name} style={{ width: "200px" }}>
                                <Card.Body>
                                    <Card.Title>{players[player].name}</Card.Title>
                                    Properties Owned: {players[player].properties}
                                    Final Balance: {players[player].balance}
                                    <p className="mt-2">// Eventually going to add other stats here //</p>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                    <Button className="mt-3" onClick={() => setViewStats(false)}>Back</Button >
                </>
            )
        }
        return (
            <>
                <h1 className="mt-3">Game over! Thanks for playing! Winner: {players[gameState["turnOrder"][0]].name}</h1>
                <Button className="mt-3" onClick={() => setViewStats(true)}>View stats?</Button>
            </>
        )
    }

    if (players) {
        return (
            <>
                <Board gameId={selectedGame} currentUser={loggedInUser} properties={properties} playerBalance={playerBalance} gameState={gameState} players={players} didSpin={didSpin} />
                <SidePanel loggedInUser={loggedInUser} selectedGame={selectedGame} properties={properties} gameState={gameState} players={players} didSpin={didSpin}/>
            </>
        )
    } else {
        return <h1>Loading...</h1>
    }
}

export default Game;