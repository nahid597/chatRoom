module.exports = function(express, app, path, passport) {
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
        res.render(path.join(__dirname, '../../front' + '/chatroom/chatroom.component.html'), { title: 'ChatRoom', user: req.user });
    });

    router.get('/currentroom', function(req, res, next) {
        // res.sendFile(path.join(__dirname, '../../front' + '/room/room.component.html'));
        res.render(path.join(__dirname, '../../front' + '/room/room.component.html'), { title: 'current chat room' });
    });

    router.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/');
    })


    app.use('/', router);
}