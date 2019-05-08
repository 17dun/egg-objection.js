# egg-objection

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/egg-objection.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-objection

<!--
Description here.
-->

## Install

```bash
$ npm i egg-objection --save
# 从下面选择一种
$ npm install pg
$ npm install sqlite3
$ npm install mysql
$ npm install mysql2
$ npm install mariasql
```

## Usage

```js
// {app_root}/config/plugin.js
exports.objection = {
  enable: true,
  package: 'egg-objection',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
config.objection = {
  client: {
    knex: {
      client: 'mysql2', // pg/sqlite3/mysql/mysql2/mariasql
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
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->
在app/model新建model

```js
// app/model/user.js

'use strict';

module.exports = app => {
  class User extends app.model {
    static get tableName() {
      return 'users';
    }
  };
  return User;
}

```
在controller里使用
```js
// app/controller/home.js

'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const users = await this.ctx.model.User.query().orderBy('id');
    this.ctx.body = users;
  }
}

module.exports = HomeController;

```


## License

[MIT](LICENSE)
