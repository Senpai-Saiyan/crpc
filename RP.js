const Discord = require('discord.js')
const client = new Discord.Client();
const path = require('path');
const data = require(path.join(__dirname + '/data.json'));

client.on('ready', () => {
    // based on the object from
    // https://github.com/discordapp/discord-rpc/blob/master/examples/send-presence
    console.log(`Logged in as ${client.user.tag}`);
    console.log('Ready, setting rich presence');
    if (!data.RPData.enabled) {
        client.user.setPresence({
            game: {
                name: data.RPData.name,
                type: data.RPData.type,
                url: data.RPData.url != "" ? data.RPData.url : null
            }
        }).catch(console.error).then(() => console.log('Successfully set game presence!'));;
    } else {
        client.user.setPresence({
            game: {
                name: data.RPData.name,
                type: data.RPData.type,
                url: data.RPData.url != "" ? data.RPData.url : null,
                details: data.RPData.details,
                state: data.RPData.state,
                timestamps: {
                    start: data.RPData.endTimestamp,
                },
                assets: {
                    large_image: data.RPData.largeImageID,
                    large_text: data.RPData.largeText,
                    small_image: data.RPData.smallImageID
                },
                application_id: data.RPData.application_id
            }
        }).catch(console.error).then(() => console.log('Successfully set rich game presence!'));
    }
});

function exitHandler(options, err) {
    client.user.setActivity({
        game: null
    });
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {
    cleanup: true
}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
    exit: true
}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {
    exit: true
}));
process.on('SIGUSR2', exitHandler.bind(null, {
    exit: true
}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
    exit: true
}));

client.login(data.dtoken);
console.log('Logging in!');
