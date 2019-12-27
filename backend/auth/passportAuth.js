module.exports = function(passport, facebookStrategy, config, mongoose) {

    var chatUserSchema = mongoose.Schema({
        profileID: String,
        fullName: String,
        profilePic: String
    });

    var userModel = mongoose.model('chatUser', chatUserSchema);

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        //console.log('id ' + id);
        userModel.findById(id, function(err, user) {
            done(null, user);
        })
    })

    passport.use(new facebookStrategy({
        clientID: config.fb.appId,
        clientSecret: config.fb.appSecret,
        callbackURL: config.fb.callbackURL,
        profileFields: ['id', 'displayName', 'photos']
    }, function(accessToken, refreshToken, profile, done) {
        userModel.findOne({ 'profileID': profile.id }, function(err, result) {
            if (result) {
                done(null, result);
            } else {
                var newChatUser = new userModel({
                    profileID: profile.id,
                    fullName: profile.displayName,
                    profilePic: profile.photos[0].value || ''
                });

                newChatUser.save(function(err) {
                    done(null, newChatUser);
                })
            }
        })
    }))
}