import { db } from "./index"
const whoseTurnIsItRef = db.ref("whoseTurnIsIt")
const gridRef = db.ref("gridRef")
const connectionsRef = db.ref("connections")
const connectedRef = db.ref(".info/connected")

const connectToFirebase = () => {
    connectedRef.on("value", function (snap) {
        if (snap.val()) {
            const connection = connectionsRef.push(true)
            connection.onDisconnect().remove()
        }
    })
}

const getWhoseTurnIsItRef = () => {
    return whoseTurnIsItRef
}

const getGridRef = () => {
    return gridRef
}

const getConnectionsRef = () => {
    return connectionsRef
}

const setDefaultsInFirebase = (grid) => {
    gridRef.set(grid)
    whoseTurnIsItRef.set("X")
}

export { connectToFirebase, getGridRef, getConnectionsRef, getWhoseTurnIsItRef, setDefaultsInFirebase }