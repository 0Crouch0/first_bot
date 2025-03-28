const {Sequelize} = require('sequelize')

module.exports = new Sequelize (
    'tg_bot',
    'root',
    'root',
    {
        host: 'master.dc8a6aa1-1f10-4a0c-b46f-8724655047dc.c.dbaas.selcloud.ru',
        port: '5432',
        dialect: 'postgres',
    }

)