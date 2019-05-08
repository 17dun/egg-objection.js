'use strict';

exports.keys = '123456';

exports.objection = {
  client: {
    knex: {
      client: 'mysql2',
      connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'qwer1234',
        database: 'example',
      },
    },
  },
};