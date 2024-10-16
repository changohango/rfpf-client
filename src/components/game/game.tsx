import { useEffect, useState } from "react";
import Board from "../board/board";
import SidePanel from "./sidePanel/sidePanel";
import Json from "../../assets/json/properties.json"
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";


function Game({selectedGame, loggedInUser}: any) {
    const [properties, setProperties] = useState<any>(Json)
    const [playerBalance, setPlayerBalance] = useState();
    const [gameState, setGameState] = useState();
    const [players, setPlayers] = useState<any>({});
    const [didSpin, setDidSpin] = useState<any>(false);
    
    useEffect(() => {
        if (selectedGame) {
            const balanceQuery = ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid + "/balance");
            onValue(balanceQuery, (snapshot) => {
                if (snapshot.exists()) {
                    setPlayerBalance(snapshot.val());
                }
            });
        }

        const didSpinQuery = ref(db, "games/" + selectedGame + "/players/" + loggedInUser.uid + "/didSpin");
        onValue(didSpinQuery, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                setDidSpin(data);
            }
        })

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

    
    if (players) { return (
        <>
            <Board gameId={selectedGame} currentUser={loggedInUser} properties={properties} playerBalance={playerBalance} gameState={gameState} players={players} didSpin={didSpin} />
            <SidePanel loggedInUser={loggedInUser} selectedGame={selectedGame} properties={properties} gameState={gameState} players={players} didSpin={didSpin} />
        </>
    ) } else {
        return <h1>Loading...</h1>
    }
}

export default Game;