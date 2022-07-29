const axios = require("axios");
const { EventEmitter } = require("events");
//made by Lyertia
//web: lyertia.wtf
//note: our package is beta, so please report any bugs you find
//you can use api directly

class lyertiaUtils extends EventEmitter {
  constructor(options) {
    super();

    const { authKey, client } = options;
    try {
      this.discord = require("discord.js");
    } catch (e) {
      throw new Error(
        "[ERROR] : discord.js is not installed. For support: https://discord.gg/a6mBgqgSgG/"
      );
    }

    if (!options)
      throw new Error(
        "[ERROR] : No options provided. For support: https://discord.gg/a6mBgqgSgG/"
      );
    if (!authKey)
      throw new Error(
        "[ERROR] : authKey is required. Please provide your authKey in package options. For support: https://discord.gg/a6mBgqgSgG/"
      );
    if (!client)
      throw new Error(
        "[ERROR] : client is required. Please provide your Discord Client in package options. For support: https://discord.gg/a6mBgqgSgG/"
      );
    if (typeof authKey !== "string")
      throw new Error(
        "[ERROR] : authKey must be a string. For support: https://discord.gg/a6mBgqgSgG/"
      );
    if (!(client instanceof this.discord.Client))
      throw new TypeError(
        "[ERROR] : client must be a Discord Client. For support: https://discord.gg/a6mBgqgSgG/"
      );

    this.client = client;
    this.key = authKey;
    this.api = "http://api.lyertia.eu.org/api/update-status/";
  }

  async post() {
    let guilds = this.client.guilds.cache.size;
    let users = this.client.guilds.cache
      .filter((guild) => guild.available)
      .reduce((prev, curr) => prev + curr.memberCount, 0);

    let data = {
      token: this.key,
      guildsCount: guilds,
      usersCount: users,
    };

    try {

      console.log("DtDetector started to auto-posting.");
      axios
        .post(this.api, data)
        .then((response) => {
          if (response.data.error == false) {
            console.log("DtDetector successfully posted.");
          } else if (response.data.error == true) {
            console.log("DtDetector failed to post.", response.data);
          }
        })
        .catch((error) => {
          console.log("DtDetector failed to post.", error);
        });

      setInterval(async () => {
        console.log("DtDetector started to auto-posting.");
        axios
          .post(this.api, data)
          .then((response) => {
            if (response.data.error == false) {
              console.log("DtDetector successfully posted.");
            } else if (response.data.error == true) {
              console.log("DtDetector failed to post.", response.data);
            }
          })
          .catch((error) => {
            console.log("DtDetector failed to post.", error);
          });
      }, 60000);
    } catch (e) {
      this.emit(
        "post",
        "Unable to connect to the api server. Post unseccessful."
      );
    }
  }
}
module.exports = lyertiaUtils;
