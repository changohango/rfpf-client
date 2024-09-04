import Board from "./board/board";
import { db } from "../firebase";
import { child, equalTo, get, onValue, orderByChild, query, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
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



function Game({ loggedInUser }: any) {
    const [foundFriend, setFoundFriend] = useState<any>();
    const [properties, setProperties] = useState()
    const [gameKeys, setGameKeys] = useState<any>();
    const [selectedGame, setSelectedGame] = useState();

    const [showAddFriend, setShowAddFriend] = useState(false);

    const handleShowAddFriend = () => setShowAddFriend(true);
    const handleCloseAddFriend = () => setShowAddFriend(false);

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

    async function searchForFriend(e: any) {
        e.preventDefault()
        const { email } = e.target.elements
        const usersRef = query(ref(db, 'users'), ...[orderByChild("email"), equalTo(email.value)])
        const snapshot = await get(usersRef);
        const data = snapshot.val();
        if (data)
            setFoundFriend(Object.values(data)[0])
        else {
            setFoundFriend(undefined)
        }
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
                <div className="mt-5">
                    <Button onClick={() => handleShowAddFriend()}>Add Friend</Button>
                </div>
            </>}
            <Modal show={showAddFriend} onHide={handleCloseAddFriend}>
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Friend</Modal.Title>
                    </Modal.Header>
                </>
                <Modal.Body>
                    <Form onSubmit={searchForFriend}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Friend's Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                    {foundFriend && <Card>
                        <Card.Body>{foundFriend.email} / {foundFriend.name}</Card.Body>
                    </Card>}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Game;
