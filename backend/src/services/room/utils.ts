export const generateRoomCode = () =>
    Math.random().toString(36).substr(2, 5).toUpperCase();
