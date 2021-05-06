var config = require("./config.json");
var discord = require("discord.js");
var client = new discord.Client();
var fs = require("fs");
var prefix = "log";
var db = require("quick.db");

client.on("ready", async function() {
  console.log(`ready, logged in as ${client.user.tag}`);
  setInterval(() => {
    client.user.setActivity(`loghelp | in ${client.guilds.size} servers`, {
      type: "WATCHING"
    });
  }, 16000);
});

//logging
client.on("messageDelete", async message => {
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }

  if (message.guild) {
    if (message.author.bot) return;
    var y = db.get("messagedelete_" + message.guild.id);
    if (y !== `enabled`) return;
    var x = db.get("loggingchannel_" + message.guild.id);
    x = client.channels.get(x);
    if (message.channel == x) return;
    var embed = new discord.RichEmbed()
      .setColor("#FF0000")
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setDescription(
        `**Message deleted from** ${message.author} **in channel** ${message.channel} \n${message.content}`
      )
      .setFooter(`ID: ${client.guilds.id}`, client.guilds.iconURL)
      .setTimestamp();
    x.send(embed).catch();
  }
});

client.on("channelCreate", async function(channel) {
  if (!channel.guild) return;
  var y = db.get(`channelcreate_${channel.guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + channel.guild.id);
  var x = client.channels.get(x);
  var embed = new discord.RichEmbed()
    .setColor("#09dc0b")
    .setAuthor(channel.guild.name, channel.guild.iconURL)
    .setTitle("Channel Created")
    .addField("Channel", channel)
    .addField("Type", channel.type)
    .setFooter(`ID: ${channel.guild.id}`, channel.guild.iconURL)
    .setTimestamp();
  x.send(embed).catch();
});

client.on("channelDelete", async function(channel) {
  if (!channel.guild) return;
  var y = db.get(`channelcreate_${channel.guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + channel.guild.id);
  var x = client.channels.get(x);

  var embed = new discord.RichEmbed()
    .setColor("#FF0000")
    .setAuthor(channel.guild.name, channel.guild.iconURL)
    .setTitle("Channel Deleted")
    .addField("Name", channel.name)
    .addField("Type", channel.type)
    .setFooter(`ID: ${channel.guild.id}`, channel.guild.iconURL)
    .setTimestamp();
  x.send(embed).catch();
});
client.on("emojiCreate", async function(emoji) {
  var y = db.get(`emojicreate_${emoji.guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + emoji.guild.id);
  var x = client.channels.get(x);

  var embed = new discord.RichEmbed()
    .setColor("#09dc0b")
    .setAuthor(emoji.guild.name, emoji.guild.iconURL)
    .setTitle("Emoji Created")
    .addField("Added Emoji", emoji + ` :${emoji.name}:`)
    .setFooter(`ID: ${emoji.guild.id}`, emoji.guild.iconURL)
    .setTimestamp();
  x.send(embed).catch();
});
client.on("emojiDelete", async function(emoji) {
  var y = db.get(`emojidelete_${emoji.guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + emoji.guild.id);
  var x = client.channels.get(x);

  var embed = new discord.RichEmbed()
    .setColor("#FF0000")
    .setAuthor(emoji.guild.name, emoji.guild.iconURL)
    .setTitle("Emoji Deleted")
    .addField("Name", `[:${emoji.name}:](${emoji.url})`)
    .setFooter(`ID: ${emoji.guild.id}`, emoji.guild.iconURL)
    .setTimestamp();
  x.send(embed).catch();
});
client.on("guildBanAdd", async function(guild, user) {
  var y = db.get(`guildbanadd_${guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + guild.id);
  var x = client.channels.get(x);

  var embed = new discord.RichEmbed()
    .setColor("#FF0000")
    .setAuthor(user.tag, user.avatarURL)
    .setDescription(`:police_officer: :lock: ${user.tag} **was banned** `)
    .setFooter(`ID: ${guild.id}`, guild.iconURL)
    .setTimestamp();
  x.send(embed).catch();
});
client.on("guildBanRemove", async function(guild, user) {
  var y = db.get(`guildbanremove_${guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + guild.id);
  var x = client.channels.get(x);

  var embed = new discord.RichEmbed()
    .setColor("GREEN")
    .setAuthor(user.tag, user.avatarURL)
    .setDescription(`:police_officer: :unlock: ${user.tag} **was unbanned**`)
    .setFooter(`ID: ${guild.id}`, guild.iconURL)
    .setTimestamp();
  x.send(embed).catch();
});
client.on("guildMemberAdd", async function(member) {
  var y = db.get(`guildmemberadd_${member.guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + member.guild.id);
  var x = client.channels.get(x);

  var embed = new discord.RichEmbed()
    .setColor("GREEN")
    .setAuthor(member.user.tag, member.user.avatarURL)
    .setDescription(`:inbox_tray: ${member.user.tag} **joined the server**`)
    .addField("Account creation", member.user.createdAt)
    .setFooter(`ID: ${member.user.id}`)
    .setTimestamp();
  x.send(embed).catch();
});
client.on("guildMemberRemove", async function(member) {
  var y = db.get(`guildmemberremove_${member.guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + member.guild.id);
  var x = client.channels.get(x);

  var embed = new discord.RichEmbed()
    .setColor("RED")
    .setAuthor(member.user.tag, member.user.avatarURL)
    .setDescription(`:outbox_tray: ${member.user.tag} **left the server**`)
    .setFooter(`ID: ${member.user.id}`)
    .setTimestamp();
  x.send(embed).catch();
});

client.on("messageDeleteBulk", async function(messages) {
  var y = db.get(`messagebulkdelete_${messages.random().guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + messages.random().guild.id);
  var x = client.channels.get(x);
  if (messages.random().channel == x) return;

  await messages
    .array()
    .reverse()
    .forEach(m => {
      var x = m.createdAt.toString().split(" ");
      fs.appendFile(
        "messagebulkdelete.txt",
        `[${m.author.tag}], [#${m.channel.name}]: ["${
          m.content
        }"], created at [${x[0]} ${x[1]} ${x[2]} ${x[3]} ${x[4]}]\n\n`,
        function(err) {
          if (err) throw err;
          console.log("Saved!");
        }
      );
    });

  var embed = new discord.RichEmbed()
    .setColor("#FFD700")
    .setAuthor(messages.random().guild.name, messages.random().guild.iconURL)
    .setDescription(
      `**${messages.array().length} messages got deleted in** ${
        messages.random().channel
      }`
    )
    .setFooter(`ID: ${messages.random().guild.id}`)
    .setTimestamp();
  await x.send(embed).catch();
  await x.send(`Here is the log file for the deleted messages: \n`).catch();
  await x
    .send({
      files: [
        {
          attachment: "messagebulkdelete.txt"
        }
      ]
    })
    .catch();

  fs.unlink("messagebulkdelete.txt", function(err) {
    if (err) throw err;
    console.log("File deleted!");
  });
});

client.on("roleCreate", async function(role) {
  var y = db.get(`rolecreate_${role.guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + role.guild.id);
  var x = client.channels.get(x);

  var embed = new discord.RichEmbed()
    .setColor("#09dc0b")
    .setAuthor(role.guild.name, role.guild.iconURL)
    .setTitle(`Role ${role.name} Created`)
    .setDescription(
      `Name: ${role.name} \nColor: ${role.color} \nHoisted: ${role.hoist} \nMentionable: ${role.mentionable}`
    )
    .setFooter(`ID: ${role.id}`)
    .setTimestamp();
  x.send(embed).catch();
});
client.on("roleDelete", async function(role) {
  var y = db.get(`roledelete_${role.guild.id}`);
  if (y !== "enabled") return;
  var x = db.get("loggingchannel_" + role.guild.id);
  var x = client.channels.get(x);

  var embed = new discord.RichEmbed()
    .setColor("#FF0000")
    .setAuthor(role.guild.name, role.guild.iconURL)
    .setTitle(`Role ${role.name} Deleted`)
    .setDescription(
      `Name: ${role.name} \nColor: ${role.color} \nHoisted: ${role.hoist} \nMentionable: ${role.mentionable}`
    )
    .setFooter(`ID: ${role.id}`)
    .setTimestamp();

  x.send(embed).catch();
});

client.on("message", async message => {
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;

  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }

  if (command === "options") {
    if (!message.guild)
      return message.channel.send(`Use this command in a server, not in dm!`);
    if (
      !message.member.hasPermission(`MANAGE_CHANNELS`) ||
      !message.member.hasPermission(`MANAGE_GUILD`)
    )
      return message.channel.send(
        `:no_entry: Sorry, but you have no permission to use that Command!`
      );
    var embed = new discord.RichEmbed()
      .setAuthor(`Help for ${message.guild.name}`, message.guild.iconURL)
      .setTitle(`Configuration for logging in ${message.guild.name}\n`)
      .setColor("PURPLE");
    var y = await db.get(`allenabled_${message.guild.id}`);
    if (y == "enabled") {
      embed.addField("**[1]**     logging deleted messages", "enabled");
      embed.addField("**[2]**     logging created roles", "enabled");
      embed.addField("**[3]**     logging deleted roles", "enabled");
      embed.addField("**[4]**     logging bulk message deletes", "enabled");
      embed.addField("**[5]**     logging member leaves/user kicks", "enabled");
      embed.addField("**[6]**     logging member joins", "enabled");
      embed.addField("**[7]**     logging guild bans", "enabled");
      embed.addField("**[8]**     logging guild unbans", "enabled");
      embed.addField("**[9]**     logging emoji creations", "enabled");
      embed.addField("**[10]**    logging emoji deletions", "enabled");
      embed.addField("**[11]**    logging channel creations", "enabled");
      embed.addField("**[12]**    logging channel deletions", "enabled");

      var x = await db.get("loggingchannel_" + message.guild.id);
      if (x == null)
        embed.addField(
          `There is no logging channel set up for this server. To set one up, type:`,
          `\`${prefix}setchannel #channel\``
        );
      if (x !== null) {
        var y = client.channels.get(x);
        embed.addField(
          `----------------------`,
          `The current logging channel is ${y}. \n To set up another channel, type **${prefix}setchannel #channel**.`
        );
      }
      embed.setFooter(`Bot was made by Synthetic Development!`);
    } else if (y == "disabled") {
      embed.addField("**[1]**    logging deleted messages ", "disabled");
      embed.addField("**[2]**    logging created roles ", "disabled");
      embed.addField("**[3]**    logging deleted roles ", "disabled");
      embed.addField("**[4]**    logging bulk message deletes", "disabled");
      embed.addField("**[5]**    logging member leaves/user kicks", "disabled");
      embed.addField("**[6]**    logging member joins", "disabled");
      embed.addField("**[7]**    logging guild bans", "disabled");
      embed.addField("**[8]**    logging guild unbans", "disabled");
      embed.addField("**[9]**    logging emoji creations", "disabled");
      embed.addField("**[10]**   logging emoji deletions", "disabled");
      embed.addField("**[11]**   logging channel creations", "disabled");
      embed.addField("**[12]**   logging channel deletions", "disabled");

      var x = await db.get("loggingchannel_" + message.guild.id);
      if (x == null)
        embed.addField(
          `There is no logging channel set up for this server. To set one up, type:`,
          `\`${prefix}setchannel #channel\``
        );
      if (x !== null) {
        var y = client.channels.get(x);
        embed.addField(
          `----------------------`,
          `The current logging channel is ${y}. \n To set up another channel, type **${prefix}setchannel #channel**.`
        );
      }
    } else {
      var x = await db.get("messagedelete_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[1]**    logging deleted messages", "disabled");
      } else {
        embed.addField("**[1]**    logging deleted messages", "enabled");
      }
      var x = await db.get("rolecreate_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[2]**    logging created roles ", "disabled");
      } else {
        embed.addField("**[2]**    logging created roles", "enabled");
      }
      var x = await db.get("roledelete_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[3]**    logging deleted roles", "disabled");
      } else {
        embed.addField("**[3]**    logging deleted roles", "enabled");
      }
      var x = await db.get("messagebulkdelete_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[4]**    logging bulk message deletes", "disabled");
      } else {
        embed.addField("**[4]**    logging bulk message deletes", "enabled");
      }
      var x = await db.get("guildmemberremove_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField(
          "**[5]**    logging member leaves/user kicks",
          "disabled"
        );
      } else {
        embed.addField(
          "**[5]**    logging member leaves/user kicks",
          "enabled"
        );
      }
      var x = await db.get("guildmemberadd_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[6]**    logging member joins", "disabled");
      } else {
        embed.addField("**[6]**    logging member joins", "enabled");
      }
      var x = await db.get("guildbanadd_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[7]**    logging guild bans", "disabled");
      } else {
        embed.addField("**[7]**    logging guild bans", "enabled");
      }
      var x = await db.get("guildbanremove_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[8]**    logging guild unbans", "disabled");
      } else {
        embed.addField("**[8]**    logging guild unbans", "enabled");
      }
      var x = await db.get("emojicreate_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[9]**    logging emoji creations", "disabled");
      } else {
        embed.addField("**[9]**    logging emoji creations", "enabled");
      }
      var x = await db.get("emojidelete_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[10]**   logging emoji deletions", "disabled");
      } else {
        embed.addField("**[10]**   logging emoji deletions", "enabled");
      }
      var x = await db.get("channelcreate_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[11]**   logging channel creations", "disabled");
      } else {
        embed.addField("**[11]**   logging channel creations", "enabled");
      }
      var x = await db.get("channeldelete_" + message.guild.id);
      if (x == null || x == "disabled") {
        embed.addField("**[12]**   logging channel deletions", "disabled");
      } else {
        embed.addField("**[12]**   logging channel deletions", "enabled");
      }

      var x = await db.get("loggingchannel_" + message.guild.id);
      if (x == null)
        embed.addField(
          `There is no logging channel set up for this server. To set one up, type:`,
          `\`${prefix}setchannel #channel\``
        );
      if (x !== null) {
        var y = client.channels.get(x);
        embed.addField(
          `----------------------`,
          `The current logging channel is ${y}. \n To set up another channel, type **${prefix}setchannel #channel**.`
        );
      }
    }
    embed.setFooter(`Bot by Synthetic Development`);
    embed.addField(
      `----------------------\n`,
      `[Discord Server](https://discord.gg/WCm8mDdqRr)`
    );
    message.channel.send(embed);
  }

  if (command == "reset") {
    if (!message.guild)
      return message.reply("You have to use this command in a Server!");
    if (
      !message.member.hasPermission(`MANAGE_CHANNELS`) ||
      !message.member.hasPermission(`MANAGE_GUILD`)
    )
      return message.channel.send(
        `:no_entry: Sorry, but you have no permission to use that Command!`
      );
    await db.delete(`loggingchannel_${message.guild.id}`);
    await db.delete(`allenabled_${message.guild.id}`);
    await db.delete(`messagedelete_${message.guild.id}`);
    await db.delete("rolecreate_" + message.guild.id);
    await db.delete("roledelete_" + message.guild.id);
    await db.delete("messagebulkdelete_" + message.guild.id);
    await db.delete("guildmemberremove_" + message.guild.id);
    await db.delete("guildmemberadd_" + message.guild.id);
    await db.delete("guildbanadd_" + message.guild.id);
    await db.delete("guildbanremove_" + message.guild.id);
    await db.delete("emojicreate_" + message.guild.id);
    await db.delete("emojidelete_" + message.guild.id);
    await db.delete("channelcreate_" + message.guild.id);
    await db.delete("channeldelete_" + message.guild.id);
    message.channel.send(
      `Done, cleared all cache for this server. Type \`${prefix}help\` to setup again!`
    );
  }

  if (command == "disable") {
    if (!message.guild)
      return message.reply("You have to use this command in a Server!");
    if (
      !message.member.hasPermission(`MANAGE_CHANNELS`) ||
      !message.member.hasPermission(`MANAGE_GUILD`)
    )
      return message.channel.send(
        `:no_entry: Sorry, but you have no permission to use that Command!`
      );
    if (!args[0])
      return message.channel.send(
        `You need to specify a number with the event you don't want to log. Type \`${prefix}help\``
      );
    var x = await db.get("loggingchannel_" + message.guild.id);
    if (x == null || x == "none") {
      return message.channel.send(
        `You haven't set up a logging channel for this guild. Type \`${prefix}help\``
      );
    }
    if (args[0] > 12 || args[0] < 1)
      return message.reply(
        `type \`${prefix}help\` and find the number with what event u want to disable logging for`
      );
    switch (args[0]) {
      case "1":
        await db.set(`messagedelete_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging for deleted messages`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "2":
        await db.set(`rolecreate_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging for created roles`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "3":
        await db.set(`roledelete_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging for deleted roles`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "4":
        await db.set(`messagebulkdelete_${message.guild.id}`, "disabled");
        message.channel.send(
          `Ok, disabled the logging for message bulk deletes`
        );
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "5":
        await db.set(`guildmemberremove_${message.guild.id}`, "disabled");
        message.channel.send(
          `Ok, disabled the logging member leaves/user kicks`
        );
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "6":
        await db.set(`guildmemberadd_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging for new members`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "7":
        await db.set(`guildbanadd_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging banned users`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "8":
        await db.set(`guildbanremove_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging unbanned users`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "9":
        await db.set(`emojicreate_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging for emoji creations`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "10":
        await db.set(`emojidelete_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging for emoji deletions`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "11":
        await db.set(`channelcreate_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging for channel creations`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "12":
        await db.set(`channeldelete_${message.guild.id}`, "disabled");
        message.channel.send(`Ok, disabled the logging for channel deletions`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "all":
        await db.set(`allenabled_${message.guild.id}`, "disabled");
        await db.set(`messagedelete_${message.guild.id}`, "disabled");
        await db.set("rolecreate_" + message.guild.id, "disabled");
        await db.set("roledelete_" + message.guild.id, "disabled");
        await db.set("messagebulkdelete_" + message.guild.id, "disabled");
        await db.set("guildmemberremove_" + message.guild.id, "disabled");
        await db.set("guildmemberadd_" + message.guild.id, "disabled");
        await db.set("guildbanadd_" + message.guild.id, "disabled");
        await db.set("guildbanremove_" + message.guild.id, "disabled");
        await db.set("emojicreate_" + message.guild.id, "disabled");
        await db.set("emojidelete_" + message.guild.id, "disabled");
        await db.set("channelcreate_" + message.guild.id, "disabled");
        await db.set("channeldelete_" + message.guild.id, "disabled");
        message.channel.send(
          `Ok disabled logging for all events in this guild`
        );
    }
  }

  if (command == "enable") {
    if (!message.guild)
      return message.reply("You have to use this command in a Server!");
    if (
      !message.member.hasPermission(`MANAGE_CHANNELS`) ||
      !message.member.hasPermission(`MANAGE_GUILD`)
    )
      return message.channel.send(
        `:no_entry: Sorry, but you have no permission to use that Command!`
      );
    if (!args[0])
      return message.channel.send(
        `You need to specify a number with the event you want to log. Type \`${prefix}help\``
      );
    var x = await db.get("loggingchannel_" + message.guild.id);
    if (x == null || x == "none") {
      return message.channel.send(
        `You haven't set up a logging channel for this guild. Type \`${prefix}help\``
      );
    }
    if (args[0] > 12 || args[0] < 1)
      return message.reply(
        `Type \`${prefix}help\` and find the number with what event you want to enable logging for`
      );
    switch (args[0]) {
      case "1":
        await db.set(`messagedelete_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging for deleted messages`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "2":
        await db.set(`rolecreate_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging for created roles`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "3":
        await db.set(`roledelete_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging for deleted roles`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "4":
        await db.set(`messagebulkdelete_${message.guild.id}`, "enabled");
        message.channel.send(
          `Ok, enabled the logging for message bulk deletes`
        );
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "5":
        await db.set(`guildmemberremove_${message.guild.id}`, "enabled");
        message.channel.send(
          `Ok, enabled the logging member leaves/user kicks`
        );
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "6":
        await db.set(`guildmemberadd_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging for new members`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "7":
        await db.set(`guildbanadd_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging banned users`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "8":
        await db.set(`guildbanremove_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging unbanned users`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "9":
        await db.set(`emojicreate_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging for emoji creations`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "10":
        await db.set(`emojidelete_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging for emoji deletions`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "11":
        await db.set(`channelcreate_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging for channel creations`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "12":
        await db.set(`channeldelete_${message.guild.id}`, "enabled");
        message.channel.send(`Ok, enabled the logging for channel deletions`);
        await db.delete(`allenabled_${message.guild.id}`);
        break;
      case "all":
        await db.set(`allenabled_${message.guild.id}`, "enabled");

        await db.set("rolecreate_" + message.guild.id, "enabled");
        await db.set(`messagedelete_${message.guild.id}`, "enabled");
        await db.set("roledelete_" + message.guild.id, "enabled");
        await db.set("messagebulkdelete_" + message.guild.id, "enabled");
        await db.set("guildmemberremove_" + message.guild.id, "enabled");
        await db.set("guildmemberadd_" + message.guild.id, "enabled");
        await db.set("guildbanadd_" + message.guild.id, "enabled");
        await db.set("guildbanremove_" + message.guild.id, "enabled");
        await db.set("emojicreate_" + message.guild.id, "enabled");
        await db.set("emojidelete_" + message.guild.id, "enabled");
        await db.set("channelcreate_" + message.guild.id, "enabled");
        await db.set("channeldelete_" + message.guild.id, "enabled");
        message.channel.send(
          `Ok enabled logging for all events in this guild.`
        );
    }
  }

  if (command == "setchannel") {
    if (!message.guild)
      return message.reply("You have to use this command in a Server!");
    if (
      !message.member.hasPermission(`MANAGE_CHANNELS`) ||
      !message.member.hasPermission(`MANAGE_GUILD`)
    )
      return message.channel.send(
        `:no_entry: Sorry, but you have no permission to use that Command!`
      );
    if (!args[0] || args[1])
      return message.reply(
        `please specify the channel, like so: \`${prefix}setchannel #channel\``
      );

    x = message.mentions.channels.first();
    if (!x)
      return message.channel.send(
        `please specify the channel, like so: \`${prefix}setchannel #channel\``
      );
    await db.set(`loggingchannel_${message.guild.id}`, x.id);
    message.channel.send(`**logging channel for this guild was set to ${x}**`);
  }

  if (command == "help") {
    var embed = new discord.RichEmbed()
    .setColor("#FF0000")
    .setTitle('Help Menu')
    .setAuthor("Logify-an advanced logger bot")
  	.setThumbnail('https://cdn.glitch.com/d9a75167-d231-4563-b524-f6f168f9e0bb%2F578-removebg-preview.png?v=1620201085780')
    embed.addField("----------------------","**Commands:**");
    embed.addField("📌  **logenable [number]-**","`enable the logging for a module`");
    embed.addField("📌  **logenable all-**","`enable all logging modules`");
    embed.addField("📌  **logdisable [number]-**","`disable a logging module`");
    embed.addField("📌  **logdisable all-**","`disable all logging modules`");
    embed.addField("📌  **logreset-**","`refreshes the bots entire cache for the server; everything set to default, with no logging channel`")
	 .setTimestamp()
    message.channel.send(embed);
  }  
});
client.on("error", e => {
  console.log(e);
});
client.login(config.token || process.env.TOKEN).catch(e => console.log(e));
