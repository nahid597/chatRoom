module.exports = function(io, rooms) {
    var chatrooms = io.of('/roomlist').on('connection', function(socket) {
        console.log('connection established in the server!! ');

        // broadcast room in current active room
        socket.emit('roomupdate', JSON.stringify(rooms));

        socket.on('newroom', function(data) {
            rooms.push(data);
            socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
            socket.emit('roomupdate', JSON.stringify(rooms));
        })
    });

    var messages = io.of('/messages').on('connection', function(socket) {
        console.log('connection established in chat room!! ');

        socket.on('joinroom', function(data) {
            socket.username = data.username;
            socket.userPic = data.profilePic;
            socket.join(data.room_number);
        })
    })
}