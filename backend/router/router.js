module.exports = function(express, app, path, passport, config, rooms) {
    var router = express.Router();

    // create middleware
    function securePages(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/');
        }
    }
    router.get('/', function(req, res, next) {
        //res.sendFile(path.join(__dirname, '../../front' + '/index/index.component.html'));
        res.render(path.join(__dirname, '../../front' + '/index/index.component.html'), { title: 'wellcome to chatRoom' });

    });

    router.get('/auth/facebook', passport.authenticate('facebook'));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/chatrooms',
        failureRedirect: '/'
    }));

    router.get('/chatrooms', securePages, function(req, res, next) {
        // console.log(req.user);
        // res.sendFile(path.join(__dirname, '../../front' + '/chatroom/chatroom.component.html'), { user: req.user });
        res.render(path.join(__dirname, '../../front' + '/chatroom/chatroom.component.html'), { title: 'ChatRoom', user: req.user, config: config });
    });

    router.get('/room/:id', securePages, function(req, res, next) {
        // res.sendFile(path.join(__dirname, '../../front' + '/room/room.component.html'));

        var room_name = findRoomName(req.params.id);
        res.render(path.join(__dirname, '../../front' + '/room/room.component.html'), {
            title: 'current chat room',
            user: req.user,
            room_number: req.params.id,
            room_name: room_name,
            config: config
        });
    });

    // find room name
    function findRoomName(room_id) {
        var n = 0;

        while (n < rooms.length) {
            if (rooms[n].room_number == room_id) {
                return rooms[n].room_name;
                break;
            }
            n++;
        }
    }

    router.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/');
    })


    app.use('/', router);
}