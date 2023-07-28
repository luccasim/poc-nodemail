'use strict';

/**
 * report controller
 */
const { createCoreController } = require('@strapi/strapi').factories;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.vlq16.iliad.fr",
    port: 465,
    secure: true,
    auth: {
        user: 'lcasimir.appespabo',
        pass: 'U0oZVsiDwr'
    }
});

const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .deletion {
            background-color: #ffeef0;
        }
        .terminal {
            background-color: #1e1e1e;
            color: #f0f0f0;
            padding: 10px;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
            border-radius: 5px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
        }
        .json {
            background-color: #FFFFFF;
            padding: 10px;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
            border-radius: 5px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
    <body>
        <h2>Une erreur de décodage est survenue.</h2>
        <p><strong>URL:</strong></p>
        <div>{url}<div />
        <p><strong>CURL: </strong></p>
        <div class="terminal">{curl}</div>
        <p><strong>JSON:</strong></p>
        <div class="json"><code>{json}</code></div>
    </body>
</html>
`;

module.exports = {
    async create(ctx) {

        const data = ctx.request.body.data
        const title = "[" + data.platform + "] " + data.title
        const dest = data.dest.reduce((accumulator, currentValue) => {
            return accumulator + ", " + currentValue;
        })

        // content
        const content = data.content
        const url = content.url
        const curl = content.curl
        const key = content.key
        const error = content.error

        const json = content.json.split('\n').map((value) => {
            if (value.includes(key)) {
                return `<span class="deletion">${value}\t<--  <b>${error}</b>\t</span>`;
            } else {
                return value;
            }
        }).reduce((partialResult, next) => {
            return `${partialResult}\n${next}`;
        }, '');

        const html = htmlMessage.replace(/{url}/g, url).replace(/{curl}/g, curl).replace(/{json}/g, json)

        const info = await transporter.sendMail({
            from: 'App Espace abonnée <appespaceabonne@iliad.fr>',
            to: dest,
            subject: title,
            html: html
        });

        return {success: true}
    }
}