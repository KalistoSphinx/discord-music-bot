
# Discord Music Bot

A simple discord music bot with queue management and some extra features, run locally cuz I dont have da money to host this shit

## Installation 
Clone the project

```bash
  git clone https://github.com/KalistoSphinx/discord-music-bot.git
```

Go to the project directory

```bash
  cd discord-music-bot
```

Install dependencies

```bash
  npm install
```

Configurations
 - Create an app on discord developer portal and get the bot token
 - Create a .env file in the same directory and fill these details

```env
BOT_TOKEN= <BOT_TOKEN_HERE>
APP_ID= <APP_ID_HERE>
SERVER_ID= <SERVER_ID_HERE>
```

Start the bot

```bash
  npm run start
```
Wait until the lavalink server starts, then you are ready to play the music

You should see something like this in the terminal

`Node "jirayu" connected.`

## ⚠ If the lavalink server does not connect

Go to the `index.js` file and then go to this line

```js
const nodes = [
    {
        name: "jirayu",
        host: "lavalink.jirayu.net",
        port: 13592,
        password: "youshallnotpass",
        secure: false,
    }
];
```
replace the credentials with another one from this website https://lavalink.darrennathanael.com/NoSSL/Lavalink-NonSSL/

Do this until any one of them works, the one I used should work almost all the time, just incase it goes offline for sometime use a new one or just host a lavalink server on your own