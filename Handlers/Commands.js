const { perms, Perms } = require("../Validation/Permissions");
const { Client } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const asciiTable = require("ascii-table");
const PG = promisify(glob);
const Ascii = require("ascii-table");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    const Table = new asciiTable("Command Loaded");

    CommandArray = [];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if(!command.name)
        return Table.addRow(file.split("/")[7], "🔸 FAILED", "Missins a name.")

        if(!command.description)
        return Table.addRow(command.name, "🔸 FAILED", "Missins a desciption.")

        if(command.permission) {
            if(Perms.includes(command.permission))
            command.defaultPermission = false;
            else
            return Table.addRow(command.name, "🔸", "Permission is invalid.")
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "🔹 SUCCESSFUL");
    });

    console.log(Table.toString());

    //PERMISSION CHECK

    client.on("ready", async () => {
        const MainGuild = await client.guilds.cache.get("937857220610248754");

        MainGuild.commands.set(CommandArray).then(async (command) => {
        const Roles = (commandName) => {
            const cmdPerms = CommadnsArray.find((c) => c.name === commandName).permission;

            return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
        }

        const fullPermissions = command.reduce((accumulator, r) => {
            const roles = Roles(r.name);
            if(!roles) return accumulator;

            const permissions = roles.reduce((a, r) => {
                return [...a, {id: r.id, type: "ROLE", permission: true}]
            }, [])

            return [...accumulator, {id: r.id, permissions}]
        }, [])
            await MainGuild.commands.permissions.set({ fullPermissions });
        })
    })
}