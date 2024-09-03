import Board from "./board/board";
import { db } from "../firebase";
import { onValue, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import newGameTemplate from "../assets/json/newGameTemplate.json"

interface Player {
    id: number;
    name: string;
    balance: number;
    ownedProperties: string[];
}

export interface Property {
    boardNum: number
    color: string
    displayRent: number
    fertilize: number
    gather: number
    id: string
    imagePath: string
    layByRent: number
    name: string
    owner: string
    path: string
    plant: number
    plow: number
    price: number
    rentDue: number
    sell: number
    upgradeStatus: string
}



function Game({loggedInUser}: any) {
    const [properties, setProperties] = useState()
    const [gameKeys, setGameKeys] = useState<any>();
    const [selectedGame, setSelectedGame] = useState();

    useEffect(() => {
        const query = ref(db, "gameKeys");
        return onValue(query, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setGameKeys(Object.keys(data))
            }
        });
    }, []);

    function handleNewGame() {
        const obj: any = {}
        var gameNum = 0
        if (gameKeys) {
            gameNum = Number(gameKeys[gameKeys.length - 1].slice(-1)) + 1
        } else {
            gameNum = 0
        }
        obj["game" + gameNum] = true
        console.log(obj)
        update(ref(db, "gameKeys/"), obj);
        update(ref(db, "games/game" + gameNum), newGameTemplate).then(() => {
            update(ref(db, "games/game" + gameNum + "/players"), {
                
            })
        })
    }


    const player1: Player = { id: 0, name: "Jonny", balance: 1000, ownedProperties: [] }
    const player2: Player = { id: 0, name: "Micah", balance: 1000, ownedProperties: [] }
    return (
        <>
            {selectedGame && <Button onClick={() => setSelectedGame(undefined)}>Back</Button>}
            <div className="container">
                <div className="row">
                    <div className="col">
                        {selectedGame && <Board gameId={selectedGame} currentUser={loggedInUser} />}
                    </div>
                    <div className="col">
                    </div>
                </div>
            </div>
            {!selectedGame && <>
                <h1>Welcome back, {loggedInUser.displayName}!</h1>
                {gameKeys && gameKeys.map((game: any) => (
                    <Button key={game} onClick={() => setSelectedGame(game)}>{game}</Button>
                ))}
                <div className="mt-5">
                    <Button onClick={() => handleNewGame()}>New Game</Button>
                </div>
            </>}
        </>
    )
}

export default Game;
