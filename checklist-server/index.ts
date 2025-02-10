import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as fs from "fs";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://omegalul.ddns.net",
        methods: ["GET", "POST"]
    }
});

const data = fs.readFileSync("episodes.csv", "utf-8");
const rows = data.split("\n").map(row => row.split(","))

type Episode = {
    id: number,
    displayCount: string,
    epCount: string, 
    titleLink: string, 
    title: string, 
    dLink: string, 
    completed: boolean
}

var checklistItems: Episode[] = [];

var counter = 1
for (let row of rows) {
    var ep: Episode = {id: counter, displayCount: row[0], epCount: row[1], titleLink: row[2], title: row[3], dLink: row[4], completed: false}

    checklistItems.push(ep)
    counter += 1
}


// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('a user connected');

    // Send the current checklist to the new user
    socket.emit('checklist-update', checklistItems);

    // Handle toggling checklist items
    socket.on('toggle-item', (id: number, completed: boolean) => {
        const item = checklistItems.find((item) => item.id === id);
        if (item) {
            item.completed = !completed; // Toggle the completed status
            io.emit('checklist-update', checklistItems); // Broadcast the updated list to all clients
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Serve the frontend
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});