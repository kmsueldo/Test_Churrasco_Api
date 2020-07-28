const server = require('./app')
const config = require('./config/server.js')

server.listen(config.SERVER_PORT, () => {
    console.log(`######################
###### API REST ######
######################`)
        console.log(`Server is running at port ${config.SERVER_PORT}`)
        console.log(`###############################`)

})