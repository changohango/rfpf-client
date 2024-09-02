import Board from "./board/board";
import { db } from "../firebase";
import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";

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



function Game() {
    const [properties, setProperties] = useState()
    useEffect(() => {
        const query = ref(db, "properties");
        return onValue(query, (snapshot) => {
          const data = snapshot.val();
          if (snapshot.exists()) {
            setProperties(data)
          }
        });
      }, []);

    const player1: Player = {id: 0, name: "Jonny", balance: 1000, ownedProperties: []}
    const player2: Player = {id: 0, name: "Micah", balance: 1000, ownedProperties: []}
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {properties && <Board properties={properties}/>}
                </div>
                <div className="col">
                </div>
            </div>
        </div>
    )
}

export default Game;