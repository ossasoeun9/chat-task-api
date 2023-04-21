import LoginQr from "../models/login-qr-model.js";

var clients = {}

const wsLoginQrController = async (ws, req) => {
    const code = req.params.id
    if (!clients[code] || !Array.isArray(clients[code])) {
        clients[code] = []
    }
    const result = await LoginQr.findOne({ code: code });
    if (!result) {
        // code was not found in the collection
        console.log('Code not found');
    } else if (result.expire_in.getTime() < Date.now()) {
        // code is expired
        console.log('Code is expired');
    } else {
        // code is valid
        console.log('Code is valid');
        clients[code].push(ws)
        console.log("code:", code, "connected")
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
