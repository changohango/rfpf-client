import { ref, update } from "firebase/database";
import { db, getNumProperties, handleTransaction } from "../../firebase";

export function getMessage(selectedGame: any, uid: any, boardNum: number, players: any) {
    switch(boardNum) {
        case 3:
        case 8:
        case 16:
        case 23:
        case 28:
            return "Opportunity knocks for " + players[uid].name + "! Take a Risk Card?"
        case 4:
            //Equipment Auction - Gain 560
            return "Equipment Auction - " + players[uid].name + " recieves $560 for sale of turning plow!"
        case 7:
            //Jury Duty - Gain 100
            return "Jury Duty! " + players[uid].name + " recieves $100."
        case 11:
            //Income tax
            if ("properties" in players[uid]) {
                const numProperties = Object.keys(players[uid].properties).length
                return players[uid].name + " pays income taxes on all farms owned. $200 per farm (" + numProperties + ")"
            }
            return players[uid].name + " pays income taxes on all farms owned- no farms owned!"
        case 12:
            //No rent due
            return "Rainy day - " + players[uid].name + " has no rent due for one turn!"
        case 15:
            //Equipment Auction 2 - Gain 420
            return "Equipment Auction - " + players[uid].name + " recieves $420 for sale of bush hog"
        case 19:
            //Interest - Gain 350
            return "Bank savings draws interest - " + players[uid].name + " recieves $350"
        case 20:
            //Lose Turn
            return "Family reunion - " + players[uid].name + " lost a turn!"
        case 24:
            //Equipment Auction 3 - Lose 500
            return "Equipment Auction - " + players[uid].name + " buys a cultivator for $500."
        case 27:
            //Crop Damage - Lose 350
            return "Crop damage by excess water - " + players[uid].name + " pays $350 for ditching."
        case 31:
            //Tractor Repair - Lose 160
            return "Tractor needs repair - " + players[uid].name + " pays $160."
    }
}