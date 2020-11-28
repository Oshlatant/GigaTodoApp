const express = require("express");
const { generate_id, response_text } = require(`${require.main.path}/utils.js`);

const router = express.Router();

router.get("/todos/:id", function(req, res){
    //response the todo associated with param id
    const { params: {id}, db } = req;

    if(id in db && db[id] !== null){
        res.json(db[id]);
        return;
    }
    response_text("Todo not found or deleted");
});

router.patch("/todos/:id", function(req, res){
    const { params: {id}, db, save_db, body } = req; //req.params.id, ..., req.body, etc...
    db[id] = {...db[id], ...body};        
    
    save_db(db, (res) => res.json(db[id]));
})

router.delete("/todos/:id", function(req, res){
    //delete the todo associated with param id
    const { params: {id}, db, save_db } = req;

    db[id] = null;
    save_db(db, () => response_text(res,`Todo at id: ${id} has been deleted`));
});

router.get("/todos", function(req, res){
    //response all todos in one object
    const { db } = req;

    for(let id in db){
        if(db[id] === null){
            delete db[id];
        }
    }
    res.json(db);
});

router.post("/todos", function(req, res){
    //write in DB an todo from request querys: key
    const { db, save_db, body } = req;
    const id = generate_id(db);
    db[id] = body;
    save_db(db, () => res.json({...db[id], id: id}));
});


module.exports = router;