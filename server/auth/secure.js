module.exports = function (router) {
    router.use(function(req, res, next){
        if(req.session.passport.user){
            return next();
        } else {
            res.redirect('/')
        }
    })

    // CRUD

    var data = {
        users: [
            {
                name: "John"
            },
            {
                name: "Tom"
            },
            {
                name: "Leena"
            }
        ]
    };

    router.post("/create", function(req, res){
        data.users.push(req.body)
        res.send(JSON.stringify(data));
    })
    
    router.get("/read", function(req, res){
        res.send(JSON.stringify(data));
    })

    router.put("/update", function(req, res){
        var id = req.params.id || req.query.id || null;
        id = parseInt(id);
        if(id && id >= 0 && id < data.users.length){
            data.users[id] = req.body;
            res.send(JSON.stringify(data));
        } else {
            res.send("Id not found");
        }
    })

    router.delete("/delete", function(req, res){
        var id = req.params.id || req.query.id || null;
        id = parseInt(id);
        if(id && id >= 0 && id < data.users.length){
            data.users.splice(id, 1);
            res.send(JSON.stringify(data));
        } else {
            res.send("Id not found");
        }
    })
}