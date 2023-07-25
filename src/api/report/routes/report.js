'use strict';

/**
 * report router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/report',
            handler: 'report.create',
            config: {
                policies: []
            }
        }
    ]
}
