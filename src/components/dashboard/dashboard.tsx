import Board from "../board/board";
import { db, handleSignOut } from "../../firebase";
import { equalTo, get, onValue, orderByChild, orderByKey, query, ref, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import newGameTemplate from "../../assets/json/newGameTemplate.json"

import './dashboard.css';
import SidePanel from "../game/sidePanel/sidePanel";
import Game from "../game/game";

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

function Dashboard({ loggedInUser }: any) {
    const [foundFriend, setFoundFriend] = useState<any>();
    const [foundFriendUid, setFoundFriendUid] = useState<string>("");

    const [friendsList, setFriendsList] = useState<any[]>([]);
    const [invitedFriends, setInvitedFriends] = useState<any[]>([]);

    const [gameKeys, setGameKeys] = useState<any[]>([]);
    const [selectedGame, setSelectedGame] = useState();
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [showNewGame, setShowNewGame] = useState(false);
    const [showSearchGame, setShowSearchGame] = useState(false);
    const [gameFound, setGameFound] = useState(false);

    useEffect(() => {
        const keyQuery = ref(db, "gameKeys/");

        onValue(keyQuery, (snapshot: any) => {
            if (snapshot.exists()) {
                const foundGameKeys = Object.keys(snapshot.val())
                console.log(foundGameKeys)
                get(ref(db, "games/")).then((res) => {
                    if (res.exists()) {
                        const games = res.val()
                        const matches = []
                        for (var i = 0; i < foundGameKeys.length; i++) {
                            if (Object.keys(games[foundGameKeys[i]].players).includes(loggedInUser.uid)) {
                                matches.push(foundGameKeys[i])
                            }
                        }
                        setGameKeys(matches)
                    }
                })
            }
        })
    }, []);

    // useEffect(() => {
    //     const didSpinQuery = ref(db, "gameKeys/");
    //     onValue(didSpinQuery, (snapshot) => {
    //         const data = snapshot.val();
    //         if (snapshot.exists()) {
    //             setGameKeys(Object.keys(data));
    //         }
    //     })
    // }, [])

    function searchForGame(e: any) {
        e.preventDefault()
        const { gameId } = e.target.elements
        get(ref(db, "gameIds")).then(async (snapshot) => {
            if (snapshot.val()) {
                const data = Object.keys(snapshot.val())
                var matchFound = false
                for (var i in data) {
                    if (gameId.value === data[i]) {
                        matchFound = true
                    }
                }
                if (matchFound) {
                    setGameFound(true)
                    console.log(loggedInUser)
                    const gameKeyRef = query(ref(db, 'games'), ...[orderByChild("gameId"), equalTo(gameId.value)])
                    const snapshot = await get(gameKeyRef);
                    const gameKey = Object.keys(snapshot.val())[0];
                    const includeLoggedInUser: any = {}
                    includeLoggedInUser[loggedInUser.uid] = {
                        email: loggedInUser.email,
                        name: loggedInUser.displayName,
                        balance: 25000,
                        boardSpace: 0,
                        didSpin: false,
                        didUpgrade: false,
                        isOut: false
                    }
                    update(ref(db, "games/" + gameKey + "/players"), includeLoggedInUser)
                } else {
                    setGameFound(false)
                }
            }
        })
    }

    function makeId(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    function checkMatch(data: any) {
        const gameId = makeId(5)
        var matchFound = false
        for (var i in data) {
            if (gameId === data[i]) {
                matchFound = true
            }
        }

        if (!matchFound) {
            return gameId
        } else {
            checkMatch(data)
        }
    }

    async function createNewGame(e: any) {
        e.preventDefault()
        const { gameName } = e.target.elements
        const obj: any = {}
        obj[gameName.value] = true

        const includeLoggedInUser: any = {}
        includeLoggedInUser[loggedInUser.uid] = {
            email: loggedInUser.email,
            name: loggedInUser.displayName,
            balance: 25000,
            boardSpace: 0,
            didSpin: false,
            didUpgrade: false,
            isOut: false
        }

        var gameRandId: any = "";
        await get(ref(db, "gameIds")).then((snapshot) => {
            if (snapshot.val()) {
                gameRandId = checkMatch(Object.keys(snapshot.val()))
            } else {
                gameRandId = makeId(5)
            }
        })

        const gameIdObj: any = {}
        gameIdObj[gameRandId] = true

        set(ref(db, "games/" + gameName.value), newGameTemplate).then(() => {
            for (var i in invitedFriends) {
                invitedFriends[i][Object.keys(invitedFriends[i])[0]].balance = 25000;
                invitedFriends[i][Object.keys(invitedFriends[i])[0]].boardSpace = 0;
                invitedFriends[i][Object.keys(invitedFriends[i])[0]].didSpin = false;
                invitedFriends[i][Object.keys(invitedFriends[i])[0]].didUpgrade = false;
                invitedFriends[i][Object.keys(invitedFriends[i])[0]].isOut = false;
                delete invitedFriends[i][Object.keys(invitedFriends[i])[0]].friends;
                update(ref(db, "games/" + gameName.value + "/players"), invitedFriends[i])
            }
        }).then(() => {
            update(ref(db, "games/" + gameName.value + "/players"), includeLoggedInUser)
        }).then(() => {
            update(ref(db, "games/" + gameName.value), { gameId: gameRandId })
            update(ref(db, "games/" + gameName.value + "/gameState"), { "gameOwner": loggedInUser.uid })
        }).then(() => {
            update(ref(db, "gameKeys/"), obj);
            update(ref(db, "gameIds"), gameIdObj);
        })
        handleCloseNewGame()
    }

    // async function getGameIds() {
    //     const gamesRef = query(ref(db, "gameIds"), ...[orderByKey()]);
    //     const games: any = []
    //     await get(gamesRef).then(async (snapshot) => {
    //         if (snapshot.exists()) {
    //             for (var i in Object.keys(snapshot.val())) {
    //                 const data = await get(query(ref(db, "games/" + Object.keys(snapshot.val())[i] + "/players"), ...[orderByKey()]))
    //                 if (Object.keys(data.val()).includes(loggedInUser.uid)) {
    //                     games.push(Object.keys(snapshot.val())[i])
    //                 }
    //             }
    //         }
    //     })
    //     setGameKeys(games)
    // }

    async function getGames() {
        const gamesRef = query(ref(db, "gameKeys"), ...[orderByKey()]);
        const games: any = []
        await get(gamesRef).then(async (snapshot) => {
            if (snapshot.exists()) {
                for (var i in Object.keys(snapshot.val())) {
                    const data = await get(query(ref(db, "games/" + Object.keys(snapshot.val())[i] + "/players"), ...[orderByKey()]))
                    if (Object.keys(data.val()).includes(loggedInUser.uid)) {
                        games.push(Object.keys(snapshot.val())[i])
                    }
                }
            }
        })
        setGameKeys(games)
    }

    async function getFriendsList() {
        get(ref(db, 'users/' + loggedInUser.uid + '/friends')).then((snapshot) => {
            if (snapshot.val()) {
                for (var i in Object.keys(snapshot.val())) {
                    get(query(ref(db, 'users'), ...[orderByKey(), equalTo(Object.keys(snapshot.val())[i])])).then((friendSnapshot) => {
                        setFriendsList(friendsList => [...friendsList, friendSnapshot.val()])
                    })
                }
            }
        })
    }

    async function searchForFriend(e: any) {
        e.preventDefault()
        const { email } = e.target.elements
        const usersRef = query(ref(db, 'users'), ...[orderByChild("email"), equalTo(email.value)])
        const snapshot = await get(usersRef);
        const data = snapshot.val();
        if (data) {
            setFoundFriend(Object.values(data)[0])
            setFoundFriendUid(Object.keys(data)[0]);
        } else {
            setFoundFriend(undefined)
            setFoundFriendUid("");
        }
    }

    function handleAddFriend() {
        const obj: any = {}
        obj[foundFriendUid] = true
        update(ref(db, "users/" + loggedInUser.uid + "/friends"), obj)
    }

    function handleNewGame() {
        setShowNewGame(true)
        getFriendsList()
    }

    function handleCloseNewGame() {
        setShowNewGame(false)
        setFriendsList([])
        setInvitedFriends([])
    }

    function inviteFriend(index: number) {
        setInvitedFriends(invitedFriends => [...invitedFriends, friendsList[index]])
        setFriendsList([
            ...friendsList.slice(0, index),
            ...friendsList.slice(index + 1)
        ])
    }

    return (
        <>
            {selectedGame &&
                <>
                    <Button onClick={() => setSelectedGame(undefined)}>Back</Button>
                    <Game selectedGame={selectedGame} loggedInUser={loggedInUser} />
                </>}
            {!selectedGame && <>
                <h3>Welcome back, {loggedInUser.displayName}!</h3>
                <br />
                <p>Your Games:</p>
                {gameKeys && gameKeys.map((game: any) => (
                    <Button key={game} onClick={() => setSelectedGame(game)}>{game}</Button>
                ))}
                <hr />
                <div className="mt-5">
                    <Button onClick={() => handleNewGame()}>New Game</Button>
                    <Button className="mx-3" onClick={() => setShowSearchGame(true)}>Find Game</Button>
                </div>
                <hr />
                <div className="mt-5">
                    <Button onClick={() => setShowAddFriend(true)}>Add Friend</Button>
                </div>
                <hr />
                <Button className='my-5' onClick={handleSignOut}>Logout</Button>
            </>}
            <Modal show={showAddFriend} onHide={() => setShowAddFriend(false)}>
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
                        <Card.Body>{foundFriend.email} / {foundFriend.name}<Button className="mx-3" onClick={() => handleAddFriend()}>Add Friend</Button></Card.Body>
                    </Card>}
                </Modal.Body>
            </Modal>
            <Modal show={showNewGame} onHide={() => handleCloseNewGame()}>
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>New Game</Modal.Title>
                    </Modal.Header>
                </>
                <Modal.Body>
                    <Form onSubmit={createNewGame}>
                        <Form.Group className="mb-3" controlId="gameName">
                            <Form.Label>Pick a name for your game:</Form.Label>
                            <Form.Control type="text" placeholder="Enter game name" />
                        </Form.Group>
                        <hr />
                        <h3>Invite Friends: </h3>
                        <div>
                            {friendsList.map((friend: any, i) => (
                                <Card key={friend[Object.keys(friend)[0]].email}>
                                    <Card.Body>{friend[Object.keys(friend)[0]].email} / {friend[Object.keys(friend)[0]].name}<Button className="mx-3" onClick={() => inviteFriend(i)}>Invite</Button></Card.Body>
                                </Card>
                            ))}
                        </div>
                        <hr />
                        <h3>Invited Friends: </h3>
                        <div>
                            {invitedFriends.map((friend: any, i) => (
                                <Card key={friend[Object.keys(friend)[0]].email}>
                                    <Card.Body>{friend[Object.keys(friend)[0]].email} / {friend[Object.keys(friend)[0]].name}</Card.Body>
                                </Card>
                            ))}
                        </div>
                        <hr />
                        <Button type="submit">Start Game</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showSearchGame} onHide={() => setShowSearchGame(false)}>
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>Search for a Game</Modal.Title>
                    </Modal.Header>
                </>
                <Modal.Body>
                    <Form onSubmit={searchForGame}>
                        <Form.Group className="mb-3" controlId="gameId">
                            <Form.Label>Game ID</Form.Label>
                            <Form.Control type="text" placeholder="Enter Game ID" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Join
                        </Button>
                        <hr />
                        {gameFound && <h1>Game Found!</h1>}
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Dashboard;
