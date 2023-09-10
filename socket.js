const ws = require('ws');
const jwt = require("jsonwebtoken");
const Message = require("./models/message");
async function connectSocket(server){
    const wss = new ws.WebSocketServer({server});
    wss.on('connection', (connection, req)=> {
        const jwtToken = req.headers['sec-websocket-protocol'];
        if(jwtToken){
            jwt.verify(jwtToken, process.env.JWT_SECRET, {}, (err, userData)=>{
                if(err) throw err;
                const {id, name} = userData;
                connection.userId = id;
                connection.username = name;
            });
        }
        [...wss.clients].forEach((client)=> {
            client.send(JSON.stringify(
                {
                    online : [...wss.clients].map(c => ({userId: c.userId, username: c.username}))
                }
            ))
        })
        connection.on('message', async (message) => {
            message = JSON.parse(message.toString());
            const {recipient, text} = message;
            const dbMessage = await Message.create({
                sender: connection.userId,
                text: text,
                reciepent: recipient
            });
            [...wss.clients]
                .filter(c=> c.userId === recipient)
                .forEach(c => c.send(JSON.stringify({text, sender: connection.userId, _id: dbMessage._id})));
        })
    })
}

module.exports = {connectSocket};