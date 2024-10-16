import { getNumProperties, handleTransaction } from "../../firebase";

export function boardActions(selectedGame: any, uid: any, boardNum: number, players: any) {
    switch(boardNum) {
        case 3:
        case 8:
        case 16:
        case 23:
        case 28:
            //Opportunity
            break;
        case 4:
            //Equipment Auction - Gain 560
            handleTransaction(selectedGame, uid, 560, 0)
            break;
        case 7:
            //Jury Duty - Gain 100
            handleTransaction(selectedGame, uid, 100, 0)
            break;
        case 11:
            //Income tax
            const numProperties = Object.keys(players[uid].properties).length
            handleTransaction(selectedGame, uid, numProperties*200, 1)
            break;
        case 12:
            //No rent due
            break;
        case 15:
            //Equipment Auction 2 - Gain 420
            handleTransaction(selectedGame, uid, 420, 0)
            break;
        case 19:
            //Interest - Gain 350
            handleTransaction(selectedGame, uid, 350, 0)
            break;
        case 20:
            //Lose Turn
            break;
        case 24:
            //Equipment Auction 3 - Lose 500
            handleTransaction(selectedGame, uid, 500, 1)
            break;
        case 27:
            //Crop Damage - Lose 350
            handleTransaction(selectedGame, uid, 350, 1)
            break;
        case 31:
            //Tractor Repair - Lose 160
            handleTransaction(selectedGame, uid, 350, 1)
            break;
    }
}