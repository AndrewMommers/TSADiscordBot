const { Client } = require("discord.js")


module.exports = {
    name: "ready",
    once: true,
    /***
    * @param {client} client
    */
    execute(client) {
        console.log("The client is now ready!")
        client.user.setActivity("HELLO!", {type: "WATCHING"})
    }
}