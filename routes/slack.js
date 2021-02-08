const fetch = require("cross-fetch");

var SlackBot = require("slackbots");
const express = require("express");

const app = express();
const fs = require("fs");
moment = require("moment");

const { createMessageAdapter } = require("@slack/interactive-messages");
const slackSigningSecret = "05b8ed9b7593825e6a12c95b8d3e3e6f";
const slackInteractions = createMessageAdapter(slackSigningSecret);

const { WebClient } = require("@slack/web-api");
const token =
  "xoxp-224498606455-233668675862-1705544204806-6e813939bda1df3618e78af53cfca1b4";
const web = new WebClient(token);
const { App } = require("@slack/bolt");

const Slackuser = require("../models/slackuser");
const Slackchannel = require("../models/slackchannel");

var bot = new SlackBot({
  token: "xoxb-224498606455-1686841326421-wCDx5fvB4uhMkt6FONPcKYCg",
  name: "paisabot",
});

let conversationsStore = {};

async function populateConversationStore(conversationIdChannel) {
  try {
    const result = await web.conversations.list({
      types: "private_channel",
      limit: 200,
    });
    let channelName = "";
    result.channels.forEach(function (conversation) {
      if (conversationIdChannel === conversation.id) {
        channelName = conversation.name;
      }
    });
    return channelName;
  } catch (error) {
    console.error(error);
  }
}

const webhook =
  "https://hooks.slack.com/services/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";
const mensaje = {
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":mag: Search results for *Cata*",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*<fakeLink.toYourApp.com|facebook>*. Enviar solicitudes a facebook desde mi app",
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          emoji: true,
          text: "acepta?",
        },
        options: [
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Si",
            },
            value: "11",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "No",
            },
            value: "22",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Tal vez",
            },
            value: "33",
          },
        ],
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*<fakeLink.toYourApp.com|Customer Support - Workflow Diagram Catalogue>*\nThis resource was put together by members of...",
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          emoji: true,
          text: "Manage",
        },
        options: [
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Manage it",
            },
            value: "value-0",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Read it",
            },
            value: "value-1",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Save it",
            },
            value: "value-2",
          },
        ],
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*<fakeLink.toYourApp.com|Self-Serve Learning Options Catalogue>*\nSee the learning and development options we...",
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          emoji: true,
          text: "Manage",
        },
        options: [
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Manage it",
            },
            value: "value-0",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Read it",
            },
            value: "value-1",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Save it",
            },
            value: "value-2",
          },
        ],
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*<fakeLink.toYourApp.com|Use Case Catalogue - CF Presentation - [June 12, 2018]>*\nThis is presentation will continue to be updated as...",
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          emoji: true,
          text: "Manage",
        },
        options: [
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Manage it",
            },
            value: "value-0",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Read it",
            },
            value: "value-1",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Save it",
            },
            value: "value-2",
          },
        ],
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*<fakeLink.toYourApp.com|Comprehensive Benefits Catalogue - 2019>*\nInformation about all the benfits we offer is...",
      },
      accessory: {
        type: "static_select",
        placeholder: {
          type: "plain_text",
          emoji: true,
          text: "Manage",
        },
        options: [
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Manage it",
            },
            value: "value-0",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Read it",
            },
            value: "value-1",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Save it",
            },
            value: "value-2",
          },
        ],
      },
    },
    {
      type: "divider",
    },
  ],
};

const selectConversationMode = {
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "How many people do you want to meet each week?",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "1",
            emoji: true,
          },
          value: "1",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "3",
            emoji: true,
          },
          value: "3",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "5",
            emoji: true,
          },
          value: "5",
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "10",
            emoji: true,
          },
          value: "10",
        },
      ],
    },
  ],
};

const enviar_mensaje = () => {
  fetch(webhook, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(selectConversationMode),
  })
    .then(function (response) {
      console.log("response =", response);
      return response.json();
    })
    .then(function (data) {
      console.log("data = ", data);
    })
    .catch(function (err) {
      console.log("te llafe");
    });
};

bot.on("message", async function (data) {
  // all ingoing events https://api.slack.com/rtm
  //bot.postMessageToUser('pedrorojas', 'meow!', { 'slackbot': true, icon_emoji: ':cat:' });

  console.log("volvi por aqui");

  if (!data.text || data.type !== "message" || data.subtype == "bot_message")
    return;

  const channel = await populateConversationStore(data.channel);

  if (data.channel) {
    try {
      bot.postMessageToChannel(channel, "pedro");
    } catch (error) {
      console.log("error 222");
    }
    enviar_mensaje();
  }

  if (data.text === "mijooo") {
    // bot.postMessageToChannel(conversationsStore[data.channel].name, 'hagale sin miedooooooo!');
  }
});

app.post("/adduser", (req, res) => {
  const params = req.body;
  fs.writeFile("slack.txt", "Hello world!", function (err) {
    // If an error occurred, show it and return
    if (err) return console.error(err);
    // Successfully wrote to the file!
  });

  const {
    user_name,
    user_id,
    team_id,
    team_domain,
    channel_id,
    channel_name,
    text,
    response_url,
  } = params;

  let slackuser = new Slackuser({
    user_name,
    user_id,
    team_id,
    team_domain,
    channel_id,
    channel_name,
    text,
    response_url,
  });

  slackuser.save((err, result) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err,
        message: " Falla en los parametros",
      });
    }

    res.json({
      ok: true,
      result,
    });
  });
});

app.post("/addconversation", (req, res) => {
  const params = req.body;
  if (params.text) {
    (async () => {
      // const res = await web.chat.postMessage({ channel: conversationId, text: 'Hello there' });

      let procesado = params.text.replace(/\s+/g, ""); // > "Textodeejemplo"

      const result1 = await web.conversations.create({
        name: String(procesado),
      });

      let slackchannel = new Slackchannel({
        name: params.text.trim(),
      });

      slackchannel.save((err, result) => {
        if (err) {
          res.status(400).json({
            ok: false,
            err,
            message: " Falla en los parametros",
          });
        }

        res.json({
          ok: true,
          id: result1.id,
        });
      });
    })();
  }
});

app.post("/play", (req, res) => {
  Slackuser.find().exec((err, result) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    var listado = [1, 2, 3, 4];
    const Total = listado.length;
    var aleatorio = "";
    var seleccion = "";
    var newArray = [];
    const limit = 3;

    for (i = 0; i <= Total; i++) {
      aleatorio = Math.floor(Math.random() * listado.length);
      seleccion = listado[aleatorio];
      listado.splice(aleatorio, 1);
      newArray.push(seleccion);
      if (limit <= i + 1) {
        break;
      }
    }

    let userArray = [];

    newArray.map((item) => {
      userArray.push(result[parseInt(item)].user_id);
    });

    const users__ = userArray.join(",");

    if (result) {
      (async () => {
        // const res = await web.chat.postMessage({ channel: conversationId, text: 'Hello there' });

        const result = await web.conversations.invite({
          channel: "C01LGSBEH8R",
          users: users__,
        });

        res.json({
          ok: true,
          result,
        });
      })();

      res.json({
        ok: true,
      });
    }
  });
});

app.post("/conversationTypeSelected", (req, res) => {
  console.log(req.body);
  res.json({
    ok: true,
  });
});

module.exports = app;
