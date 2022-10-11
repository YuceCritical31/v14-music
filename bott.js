const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { DisTube } = require('distube');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require("@distube/yt-dlp");
const ayarlar = require("./settings/ayarlar.js");




class MainClient extends Client {
    constructor() {
        super({
            shards: "auto",
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
            ],
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
        });

        process.on('unhandledRejection', error => console.log(error));
        process.on('uncaughtException', error => console.log(error));

        this.config = require('./settings/ayarlar.js');
        this.prefix = this.config.PREFIX;
        this.sahip = this.config.SAHİP;
        if (!this.token) this.token = this.config.TOKEN;

        const client = this;

      let spotifyoptions = {
  parallel: true,
  emitEventsAfterFetching: true,
          }
      if(process.env.enabled){
   spotifyoptions.api = {
       clientId: process.env.spotifyclientID,
       clientSecret: process.env.spotifyClientSecret,
  }
      }
        this.distube = new DisTube(client, {
          
            searchSongs: 0, /// ARAMA MODUNU ETKİNLEŞTİRMEK İÇİN 5'E AYARLAYIN!
            searchCooldown: 30,
            leaveOnEmpty: true,
            emptyCooldown: 60,
            leaveOnFinish: true,
            leaveOnStop: true,
            plugins: [
                new SoundCloudPlugin(),
                new SpotifyPlugin({
                  parallel: true,
  emitEventsAfterFetching: false,
  api: {
    clientId: process.env.spotifyclientID,
    clientSecret: process.env.spotifyClientSecret,
          },
                }),
                new YtDlpPlugin()],
        });

        ["aliases", "commands"].forEach(x => client[x] = new Collection());
        ["loadCommands", "loadEvents", "loadDistube"].forEach(x => require(`./handlers/${x}`)(client));

    }
    connect() {
        return super.login(this.token);
    };
};
module.exports = MainClient;