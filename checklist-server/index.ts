import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

// In-memory storage for the checklist
const checklistItems = [
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Walk the dog', completed: false },
    { id: 3, text: 'Read a book', completed: false },
  // Add up to 20 items here
];

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