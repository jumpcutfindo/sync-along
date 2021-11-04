var rooms = new Map(); // room -> list of users separated by spaces
var users = new Map(); // user -> room that the user belongs to


/* F3.1 The application should allow users to create a room with a randomly generated room code. */
const initRoomManagementService = (app) => {
    app.post('/room/create', (req, res) => {
        const username = req.body.username;

        if (!username) {
            return res.status(400).json({
                isSuccessful: false,
                message: "Please provide a username to create a room"
            })
        }

        const code = Math.random().toString(36).substr(2, 5).toUpperCase();
    
        if (!rooms.has(code)) { // new room code
            rooms.set(code, username);
            users.set(username, code);
            console.log(`rooms=${[ ...rooms.entries() ]}`);
            console.log(`users=${[ ...users.entries() ]}`);

            return res.json({
                code,
            });
        }
    })

    /* F3.2 The application should allow users to join a room using a valid room code */
    app.post('/room/join', (req, res) => {
        const username = req.body.username;
        const code = req.body.code;

        if (!(username && code)) {
            return res.status(400).json({
                isSuccessful: false,
                message: "Please provide a username and room code to join a room."
            })
        }
        if (!rooms.has(code)) {
            return res.status(404).json({
                isSuccessful: false, // room not found
            })
        }

        users.set(username, code);
        rooms.set(code, rooms.get(code) + "," + username);

        console.log(`rooms=${[ ...rooms.entries() ]}`);
        console.log(`users=${[ ...users.entries() ]}`);

        return res.status(200).json({
            isSuccessful: true,
        })
    })

    /* F3.4 The application should allow that when the room owner leaves the room, all the remaining users will be automatically removed from the room and the room will be deleted from the application. */
    app.post("/room/delete", (req, res) => {
        const code = req.body.code;

        if (!rooms.has(code)) {
            return res.status(404).json({
                isSuccessful: false, // room not found to remove
            })
        }

        let room_users = rooms.get(code).split(",");
        for (let i = 0; i < room_users.length; i++) {
            console.log(`User ${room_users[ i ]} from room ${code} removed`);
            users.delete(room_users[ i ]);
        }
        rooms.delete(code);

        console.log(`rooms=${[ ...rooms.entries() ]}`);
        console.log(`users=${[ ...users.entries() ]}`);
        return res.status(200).json({
            isSuccessful: true,
        })
    })

    /* F3.5 The application should allow users (except the room owner - to-do) to leave the room that they are joining. */
    app.post("/leave", (req, res) => {
        const username = req.body.username;

        if (!username) {
            return res.status(400).json({
                isSuccessful: false,
                message: "Please provide a username to leave the room"
            })
        }
    
        if (!users.has(username)) {
            return res.status(400).json({
                isSuccessful: false,
                message: "User is currently not in any room."
            })
        }
    
        code = users.get(username);
        let room_users = rooms.get(code).split(",");
        room_users.pop(username); // remove user from room
        rooms.set(code, room_users.join(',')); // update room 
        users.delete(username);

        console.log(`rooms=${[ ...rooms.entries() ]}`);
        console.log(`users=${[ ...users.entries() ]}`);
        return res.status(200).json({
            isSuccessful: true,
        })
    });
}

module.exports = {initRoomManagementService};