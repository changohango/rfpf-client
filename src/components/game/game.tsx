import { useEffect, useState } from "react";
import Board from "../board/board";
import SidePanel from "./sidePanel/sidePanel";
import Json from "../../assets/json/properties.json"
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";


function Game({selectedGame, loggedInUser}: any) {
    const [properties, setProperties] = useState<any>(Json)
    const [playerBalance, setPlayerBalance] = useState();
    
    useEffect(() => {
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
    }, []);

    
    return (
        <>
            <Board gameId={selectedGame} currentUser={loggedInUser} properties={properties} playerBalance={playerBalance} />
            <SidePanel loggedInUser={loggedInUser} selectedGame={selectedGame} properties={properties} />
        </>
    )
}

export default Game;