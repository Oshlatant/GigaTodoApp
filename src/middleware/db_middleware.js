const fs = require("fs");
const db_path = `${require.main.path}/db/db.json`;

const db_middleware = function(req, res, next){
    req.save_db = function(db, callback){

        fs.writeFile(db_path, JSON.stringify(db, null, 4), function(err){
            if(err){
                console.error(":(");
                return;
            }
            
            callback(res);
        });
    };

    fs.readFile(db_path, {encoding: "utf-8"}, function(err, file){
        if(err){
            res.status(500).end("Impossible de lire le fichier :(");
            return;
        }

        req.db = JSON.parse(file);

        next();
    });
}

module.exports = db_middleware;