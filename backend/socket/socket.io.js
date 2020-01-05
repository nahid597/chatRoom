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

        var userList2 = [];

        socket.on('joinroom', function(data) {
            //updateUserList(data.room_number, data.username, data.profilePic);
            socket.username = data.username;
            socket.userPic = data.profilePic;
            socket.join(data.room_number);
            updateUserList(data.room_number, true, data.username, data.profilePic);
        });

        // console.log(socket.username);
        //socket.emit('messageFeed', JSON.stringify(msgs));

        socket.on('newMessage', function(data) {
            // var msgs = [];
            // msgs.push(data);
            // console.log(msgs);
            socket.broadcast.to(data.room_number).emit('messageFeed', JSON.stringify(data));
            // socket.emit('messageFeed', JSON.stringify(msgs));
        });


        function updateUserList(room, updateAll, username, profilePic) {
            // var getUser = io.sockets.clients(room);
            var getUser;
            //getUser = io.sockets.sockets[room];
            // console.log(socket);

            //getUser = io.sockets.adapter.rooms[room].sockets;
            // let rooms = Object.keys(socket.rooms);
            // console.log('rooms are ' + rooms);

            // io.in(room).clients((err, clients) => {
            //     if (err) return err;
            //     console.log('clients' + clients[0].profilePic);
            // });



            // console.log('get user  ' + getUser);

            // problem is here..
            // io.of('/messages').in(room).clients(function(error, clients) {

            //     console.log(clients.username);
            // });

            getUser = io.nsps['/messages'].adapter.rooms[room].length;
            //getUser = io.sockets.adapter.rooms[room].lenght;

            console.log('user number ' + getUser);

            var userList = [];

            for (var i = 0; i < getUser; i++) {
                userList2.push({
                    username: username,
                    profilePic: profilePic
                });
            }

            //console.log('get user list ' + username);
            //console.log('profile pic ' + profilePic);

            for (var i = 0; i < getUser; i++) {
                userList.push({
                    username: userList2[i].username,
                    profilePic: userList2[i].profilePic
                });
            }

            // for (var i in getUser) {
            //     //console.log('name ' + getUser[i].username);
            //     userList.push({
            //         username: getUser[i].username,
            //         profilePic: getUser[i].profilePic
            //     });

            // }


            // if (updateAll) {
            socket.broadcast.to(room).emit('updateUserLists', JSON.stringify(userList));
            //}

            socket.to(room).emit('updateUserLists', JSON.stringify(userList));

        }

        socket.on('updateList', function(data) {
            updateUserList(data.room_number, true, data.username, data.profilePic);
        })
    })
}