import { ref, update } from "firebase/database";
import { db, getPassGo, handlePropertyLandedOn, handleTransaction } from "../../firebase";
import { boardActions, getMessage } from "./boardActions";

export function getRiskCardActions(cardNumber: any, selectedGame: any, uid: any, players: any, setMessage: any, properties: any, setIsNoRentDue: any, setIsNextTurnLost: any, setDoubleTurnLost: any) {
    switch (cardNumber) {
        //---------------------Gain Money------------------------------------
        case 0:
            //collect $1200 from sale of wheat
            handleTransaction(selectedGame, uid, 1200, 0);
            setMessage("Wheat prices have much improved over last year, " + players[uid].name + " collects $1,200 from sale of wheat.")
            break;
        case 1:
            //bumper crop of peaches - collect $500
            handleTransaction(selectedGame, uid, 500, 0);
            setMessage("Bumper crop of peaches, " + players[uid].name + " collects $500.")
            break;
        case 2:
            //fire damage, insurance pays - collect $600
            handleTransaction(selectedGame, uid, 600, 0);
            setMessage("Equipment damaged by fire, " + players[uid].name + " collects $600 from insurance.")
            break;
        case 3:
            //beef prices increase - collect $1000 or $2800 if phillips is owned
            if (players[uid]["properties"] && Object.values(players[uid].properties).includes("phillips")) {
                handleTransaction(selectedGame, uid, 2800, 0);
                setMessage("Beef prices increase, " + players[uid].name + " collects $2,800 as they own Phillip's Cattle Farm.")
            } else {
                handleTransaction(selectedGame, uid, 1000, 0);
                setMessage("Beef prices increase, " + players[uid].name + " only collects $1,000 as they do not own Phillip's Cattle Farm.")
            }
            break;
        case 4:
            //parity - collect $550
            handleTransaction(selectedGame, uid, 550, 0);
            setMessage(players[uid].name + " collects $550 for parity.")
            break;
        case 5:
            //soybean crop stored for higher prices - collect 2350
            handleTransaction(selectedGame, uid, 2350, 0);
            setMessage("Last years soybean crop was stored for higher prices, " + players[uid].name + " collects $2,350.")
            break;
        case 6:
            //old tractor - collect $350
            handleTransaction(selectedGame, uid, 350, 0);
            setMessage("Sale of an old tractor, " + players[uid].name + " collects $350.")
            break;
        case 7:
            //buy apple crop - collect $1500
            handleTransaction(selectedGame, uid, 1500, 0);
            setMessage("Granny Applie Pie Co. buys apple crop at a premium, " + players[uid].name + " collects $1500.")
            break;
        case 8:
            //sell tobacco crop - collect $800
            handleTransaction(selectedGame, uid, 800, 0);
            setMessage("Sell tobacco crop to new American Cigar Co., " + players[uid].name + " collects $800.")
            break;
        case 9:
            //sale of corn crop - collect $2100 ONLY if you own lavenders
            if (players[uid]["properties"] && Object.values(players[uid].properties).includes("lavenders")) {
                handleTransaction(selectedGame, uid, 2100, 0);
                setMessage("Sale of corn crop to oil company for gasohol, " + players[uid].name + " collects $2,100 as they own Lavender's Corn Farm.")
            } else {
                setMessage("Sale of corn crop to oil company for gasohol, " + players[uid].name + " collects nothing as they do not own Lavender's Corn Farm.")
            }
            break;
        case 10:
            //sale of hay crop - collect $1650
            handleTransaction(selectedGame, uid, 1650, 0);
            setMessage("Sale of hay crop, " + players[uid].name + " collects $1,650.")
            break;
        case 11:
            //pork bellies go up on stock exchange - collect $200, double if you own sharps
            if (players[uid]["properties"] && Object.values(players[uid].properties).includes("sharps")) {
                handleTransaction(selectedGame, uid, 400, 0);
                setMessage("Pork bellies go up on stock exchange, " + players[uid].name + " collects $400 as they own Sharp's Pig Farm.")
            } else {
                handleTransaction(selectedGame, uid, 200, 0);
                setMessage("Pork bellies go up on stock exchange, " + players[uid].name + " only collects $200 as they do not own Sharp's Pig Farm.")
            }
            break;
        case 12:
            //rebate - collect $200
            handleTransaction(selectedGame, uid, 200, 0)
            setMessage("Rebate on income taxes, " + players[uid].name + " collects $200.")
            break;

        //---------------------Lose Money------------------------------------
        case 13:
            //new crop of baby chickens - pay $650
            handleTransaction(selectedGame, uid, 650, 1);
            setMessage("Recieve new crop of baby chicks, " + players[uid].name + " pays $650 for help hand watering and feeding until chicks are big enough to go on auto machines.")
            break;
        case 14:
            //salvation army - pay $70
            handleTransaction(selectedGame, uid, 70, 1);
            setMessage("Salvation army donation, " + players[uid].name + " pays $70.")
            break;
        case 15:
            //crop damaged by pests - pay $720
            handleTransaction(selectedGame, uid, 720, 1);
            setMessage("Crop damaged by pests, " + players[uid].name + " pays $720 for pesticides.")
            break;
        case 16:
            //tornado - pay $100
            handleTransaction(selectedGame, uid, 100, 1);
            setMessage("Tornado hits and destroys barn, " + players[uid].name + " pays $100 for insurance deductable.")
            break;
        case 17:
            //fireants and armadillos - pay $200
            handleTransaction(selectedGame, uid, 200, 1);
            setMessage("Vineyard raided by fireants and armidillos, " + players[uid].name + " pays $200 for spray.")
            break;
        case 18:
            //fox gets in chicken house - pay $150
            handleTransaction(selectedGame, uid, 150, 1);
            setMessage("Fox gets into chicken house and scares the chickens, " + players[uid].name + " pays $150 as the chickens quit laying.")
            break;
        case 19:
            //property taxes - pay $380
            handleTransaction(selectedGame, uid, 380, 1);
            setMessage("Farmer's property taxes, " + players[uid].name + " pays $380.")
            break;
        case 20:
            //bank account overdrawn - pay $30
            handleTransaction(selectedGame, uid, 30, 1);
            setMessage("Bank account overdrawn, " + players[uid].name + " pays $30 service charge.")
            break;
        case 21:
            //poachers - pay $400
            handleTransaction(selectedGame, uid, 400, 1);
            setMessage("Poacher fishes out catfish pond, " + players[uid].name + " pays $400.")
            break;
        case 22:
            //farmowners policy - pay $450
            handleTransaction(selectedGame, uid, 450, 1);
            setMessage("Farmowner's policy expired, " + players[uid].name + " pays $450 premium.")
            break;
        case 23:
            //herbicides - pay $400
            handleTransaction(selectedGame, uid, 400, 1);
            setMessage("To avoid weeds & grass on their crop, " + players[uid].name + " pays $400 for herbicides.")
            break;
        case 24:
            //fire department - pay $50
            handleTransaction(selectedGame, uid, 50, 1);
            setMessage("The rural volunteer fire department is asking for contributions, " + players[uid].name + " donates $50.")
            break;
        case 25:
            //airline cancels peanut contract - pay $1000
            handleTransaction(selectedGame, uid, 1000, 1);
            setMessage("Airline cancels peanut contract, " + players[uid].name + " pays $1,000.")
            break;
        case 26:
            //pilferage by neighbors - pay $200
            handleTransaction(selectedGame, uid, 200, 1);
            setMessage("Loss of 1/4 crop of watermelons due to pilferage by neighbors, " + players[uid].name + " pays $200 for fencing.")
            break;
        case 27:
            //sheriff's boy ranch - pay $150
            handleTransaction(selectedGame, uid, 150, 1);
            setMessage("For the Sherrif's Boy Ranch, " + players[uid].name + " donates $150.")
            break;
        case 28:
            //AFBF membership - pay $60
            handleTransaction(selectedGame, uid, 60, 1);
            setMessage("Renew American Farm Bureau Federation membership, " + players[uid].name + " pays $60.")
            break;
        case 29:
            //church bazaar - pay $50
            handleTransaction(selectedGame, uid, 50, 1);
            setMessage("For the Church Bazaar, " + players[uid].name + " donates $50.")
            break;

        //---------------------Move Space/Game State Effect-----------------------------------
        case 30:
            //Move to lavenders and pay owner
            if (players[uid].boardSpace > 18) {
                getPassGo(uid, selectedGame, players, setMessage)
            }
            if (properties["lavenders"].owner !== "None" && properties["lavenders"].owner !== uid) {
                handleTransaction(selectedGame, uid, properties["lavenders"].rentDue, 1)
                handleTransaction(selectedGame, properties["lavenders"].owner, properties["lavenders"].rentDue, 0)
                setMessage(players[uid].name + " moved to " + properties["lavenders"].name + ", paying " + players[properties["lavenders"].owner].name + " $" + properties["lavenders"].rentDue)
            } else if (properties["lavenders"].owner === uid) {
                setMessage(players[uid].name + " moved to " + properties["lavenders"].name + ", they already own this property.")
            } else {
                setMessage(players[uid].name + " moved to " + properties["lavenders"].name + ", property is available for purchase!")
            }
            update(ref(db, "games/" + selectedGame + "/players/" + uid), { "boardSpace": 18 })
            break;
        case 31:
            //Move to jury duty and collect
            if (players[uid].boardSpace > 7) {
                getPassGo(uid, selectedGame, players, setMessage)
            }
            handleTransaction(selectedGame, uid, 100, 1)
            setMessage(players[uid].name + " moved to Jury Duty and collected $100!")
            update(ref(db, "games/" + selectedGame + "/players/" + uid), { "boardSpace": 7 })
            break;
        case 32:
            //Go back 3 spaces
            const newBoardSpace = players[uid].boardSpace - 3
            var match: any = ""
            for (var i in Object.keys(properties)) {
                if (properties[Object.keys(properties)[i]].boardNum === newBoardSpace) {
                    match = Object.keys(properties)[i]
                }
            }
            if (match !== "") {
                setMessage(players[uid].name + " moved back 3 spaces: " + handlePropertyLandedOn(selectedGame, properties, uid, players, setMessage, match))
            } else {
                const boardAction = boardActions(selectedGame, uid, newBoardSpace, players)
                setMessage(players[uid].name + " moved back 3 spaces: " + getMessage(uid, newBoardSpace, players))
                if (boardAction === "noRentDue") {
                    setIsNoRentDue(true)
                }
                if (boardAction === "nextTurnLost") {
                    console.log("Next turn being lost")
                    setIsNextTurnLost(true)
                }
            }
            update(ref(db, "games/" + selectedGame + "/players/" + uid), { "boardSpace": newBoardSpace });
            break;
        case 33:
            //advance to nearest owned farm
            const nearestProperty = findNearestOwnedPropertyKey(players[uid], properties, 32);
            if (nearestProperty) {
                if (players[uid].boardSpace > 18) {
                    getPassGo(uid, selectedGame, players, setMessage)
                }
                console.log(nearestProperty)
                if (properties[nearestProperty].owner !== "None" && properties[nearestProperty].owner !== uid) {
                    handleTransaction(selectedGame, uid, properties[nearestProperty].rentDue, 1)
                    handleTransaction(selectedGame, properties[nearestProperty].owner, properties[nearestProperty].rentDue, 0)
                    setMessage(players[uid].name + " moved to nearest owned farm, " + properties[nearestProperty].name + ", paying " + players[properties[nearestProperty].owner].name + " $" + properties[nearestProperty].rentDue)
                } else if (properties[nearestProperty].owner === uid) {
                    setMessage(players[uid].name + " moved to nearest owned farm, " + properties[nearestProperty].name + ", they already own this property.")
                } else {
                    setMessage(players[uid].name + " moved to nearest owned farm, " + properties[nearestProperty].name + ", property is available for purchase!")
                }
                update(ref(db, "games/" + selectedGame + "/players/" + uid), { "boardSpace": properties[nearestProperty].boardNum })
            } else {
                setMessage(players[uid].name + " moving to nearest owned farm (no farms owned!)")
            }
            break;
        case 34:
            //advance to jacobs and pay double if owned, otherwise pay half price
            if (players[uid].boardSpace > 13) {
                getPassGo(uid, selectedGame, players, setMessage)
            }
            if (properties["jacobs"].owner !== "None" && properties["jacobs"].owner !== uid) {
                if (players[properties["jacobs"].owner].isNoRentDue) {
                    setMessage(players[uid].name + " moved to " + properties["jacobs"].name + " (DOUBLE RENT), but " + players[properties["jacobs"].owner].name + " has no rent due!" )
                } else {
                    handleTransaction(selectedGame, uid, properties["jacobs"].rentDue * 2, 1)
                    handleTransaction(selectedGame, properties["jacobs"].owner, properties["jacobs"].rentDue * 2, 0)
                    setMessage(players[uid].name + " moved to " + properties["jacobs"].name + " (DOUBLE RENT), paying " + players[properties["jacobs"].owner].name + " $" + properties["jacobs"].rentDue * 2)
                }
            } else if (properties["jacobs"].owner === uid) {
                setMessage(players[uid].name + " moved to " + properties["jacobs"].name + ", they already own this property.")
            } else {
                setMessage(players[uid].name + " moved to " + properties["jacobs"].name + ", property is available for purchase for half price!")
                update(ref(db, "games/" + selectedGame + "/properties/jacobs"), { "price": properties["jacobs"].price / 2 })
            }
            update(ref(db, "games/" + selectedGame + "/players/" + uid), { "boardSpace": 13 })
            break;
        case 35:
            //go to family reunion, lose a turn
            if (players[uid].boardSpace > 20) {
                getPassGo(uid, selectedGame, players, setMessage)
            }
            boardActions(selectedGame, uid, 20, players)
            console.log("Next turn being lost")
            setIsNextTurnLost(true)
            update(ref(db, "games/" + selectedGame + "/players/" + uid), { "boardSpace": 20 })
            setMessage(players[uid].name + " moves to family reunion and loses a turn.")
            break;
        case 36:
            setIsNoRentDue(true)
            setMessage("Federal grain embargo, " + players[uid].name + " does not collect rent until next turn.")
            break;
        case 37:
            //drought spell, lose 2 turns
            setIsNextTurnLost(true)
            setDoubleTurnLost(true)
            setMessage("Drought spell, " + players[uid].name + " loses 2 turns.")
            break;
        case 38:
            //lightning hits dairy farm, lose 2 turns
            setIsNextTurnLost(true)
            setDoubleTurnLost(true)
            setMessage("Lightning hits dairy farm, " + players[uid].name + " loses 2 turns.")
            break;
        case 39:
            //wet spell, do not collect rent for 1 turn
            setMessage("Wet spell, " + players[uid].name + " does not collect rent until next turn.")
            setIsNoRentDue(true)
            break;
    }
}

// Function to find the nearest owned property on a circular board
function findNearestOwnedPropertyKey(player: any, properties: any, totalSpaces: number): string | null {
    let currentSpace: number = player.boardSpace;

    // Convert properties object to an array of [key, value] pairs
    let propertyEntries = Object.entries(properties);

    // Filter owned properties
    let ownedProperties = propertyEntries.filter(([key, property]: [string, any]) => property.owner !== "None");

    // If there are no owned properties, return null
    if (ownedProperties.length === 0) return null;

    // Calculate clockwise distances only
    let nearestProperty = ownedProperties.reduce((nearest: any, [key, property]: [string, any]) => {
        let propertySpace: number = property.boardNum;

        // Calculate clockwise distance, considering wrap-around
        let clockwiseDistance = (propertySpace - currentSpace + totalSpaces) % totalSpaces;

        // Update the nearest property key if this one is closer
        if (nearest === null || clockwiseDistance < nearest.distance) {
            return { key, distance: clockwiseDistance };
        }
        return nearest;
    }, null);

    return nearestProperty ? nearestProperty.key : null;
}