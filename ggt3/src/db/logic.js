import {db} from "./index"
const whoseTurnIsItRef = db.ref("whoseTurnIsIt") 
const gridRef = db.ref("gridRef")

const connectToFirebase = () => {
   const connectionsRef = db.ref("connections") 
   const connectedRef = db.ref(".info/connected")
   connectedRef.on("value", function(snap) {
       if (snap.val()) {
           const connection = connectionsRef.push(true)
           connection.onDisconnect().remove()
       }
   })
   connectionsRef.on("value", function(snap) {
        const numPlayers = snap.numChildren()
        console.log(`Players in game ${numPlayers}`)
   })
}

const getRefs = () => {
    return [whoseTurnIsItRef, gridRef]
}

const setDefaultsInFirebase = (grid) => {
    gridRef.set(grid)
    whoseTurnIsItRef.set("X")
} 

export {connectToFirebase, getRefs, setDefaultsInFirebase}