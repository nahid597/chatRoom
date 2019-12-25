module.exports = function(express, app, path) {
    var router = express.Router();

    router.get('/', function(req, res, next) {
        res.sendFile(path.join(__dirname, '../../front' + '/index/index.component.html'));
    });

    router.get('/chatrooms', function(req, res, next) {
        res.sendFile(path.join(__dirname, '../../front' + '/chatroom/chatroom.component.html'));
    });

    router.get('/currentroom', function(req, res, next) {
        res.sendFile(path.join(__dirname, '../../front' + '/room/room.component.html'));
    });

    router.get('/setcolor', function(req, res, next) {
        req.session.favColor = "red";
        res.send('color is set');
    });

    router.get('/getcolor', function(req, res, next) {
        res.send('color is ' + (req.session.favColor === undefined ? "Not found" : req.session.favColor));
    });


    app.use('/', router);
}