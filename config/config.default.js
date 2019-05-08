'use strict';

/**
 * egg-objection default config
 * @member Config#objection
 * @property {String} SOME_KEY - some description
 */
exports.objectionjs = {
  client: {
    knex: {
      client: 'mysql2',
      connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'password_example',
        database: 'example',
      },
    },
    delegate: 'model', // 注入model到app[delegate]
    baseDir: 'model', // model文件目录
  },
};
