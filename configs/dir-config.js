import fs from 'fs'

const createDir = () => {
    try {
        if (!fs.existsSync('storage')) {
            fs.mkdirSync('storage')
        }
        if (!fs.existsSync('storage/user-profile')) {
            fs.mkdirSync('storage/user-profile')
        }
    } catch (err) {
        console.log(err)
    }
}

export default createDir