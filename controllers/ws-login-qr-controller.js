import LoginQRCode from "../models/login-qr-model.js";

var clients = {}

const wsLoginQrController = async (ws, req) => {
    const code = req.query.id;
    
    const result = await LoginQRCode.findById({_id: code});
    console.log(code)
    console.log(result)
    if(result != null && result.expire_in.getTime() < Date.now()){
        if (!clients[code] || !Array.isArray(clients[code])) {
            clients[code] = []
        }
        // code is valid
        console.log('Code is valid');
        clients[code].push(ws)
        console.log("code:", code, "connected")
    }else{
        ws.close()
        if (!result) {
            // code was not found in the collection
            console.log('Code not found');
        } else if (result.expire_in.getTime() < Date.now()) {
            // code is expired
            console.log('Code is expired');
        }
    }

    
}

const sendToCodeClient = (client, data) => {
    const wsList = clients[client]
    if (wsList && wsList.length > 0) {
        for (let i = 0; i < wsList.length; i++) {
            wsList[i].send(
                JSON.stringify({
                    data: data
                })
            )
        }
    }
}

export { wsLoginQrController, sendToCodeClient }
