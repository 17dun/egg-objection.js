'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const users = await this.ctx.model.User.query().orderBy('id');
    console.log(users);
    this.ctx.body = 'hi, ' + this.app.plugins.objection.name;
  }
}

module.exports = HomeController;
