exports.generate_id = (todos) => {
    let id = 1;
    while(id in todos){
        id++;
    }
    
    return id;
}

exports.response_text = (res, string) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    })
    res.end(string);
}