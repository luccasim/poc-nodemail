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

module.exports = {
    async create(ctx) {

        const data = ctx.request.body.data
        const title = data.title
        const dest = data.dest.reduce((accumulator, currentValue) => {
            return accumulator + ", " + currentValue;
        })
        const endpoint = data.endpoint
        const response = data.response
        const error = data.error

        console.log(dest);
        const info = await transporter.sendMail({
            from: 'App Espace abonnée <appespaceabonne@iliad.fr>',
            to: dest, // list of receivers
            subject: title, // Subject line
            text: response, // plain text body
            html: "<b>".concat(error, "</b>"), // html body
        });

        return ctx.request.body
    }
}