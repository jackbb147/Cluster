// require('dotenv').config()
const config = {
    db: {
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.Database,
        password: process.env.PW,
        port: process.env.SQLPORT
    }
}

module.exports = {
    config
}