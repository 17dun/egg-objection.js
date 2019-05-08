'use strict';
const path = require('path');

module.exports = app => {
  app.addSingleton('objection', initObjection);
};


function initObjection(config, app) {
  const objection = require('objection');
  const Knex = require('knex');
  const knex = Knex(config.knex);
  objection.Model.knex(knex);

  const modelDir = path.join(app.baseDir, 'app', config.baseDir);
  const delegate = config.delegate;
  const context = app.context;

  // delegate 默认为 'model'
  // app[delegate] = objection.Model 方便后续更改配置
  Object.defineProperty(app, delegate, {
    value: objection.Model,
    writable: false,
    configurable: true,
  });

  // delegate 默认为 'model'
  // app[delegate] 不等于 context[delegate]
  const DELEGATE = Symbol(`context#objection_${config.delegate}`);
  Object.defineProperty(context, delegate, {
    get() {
      if (!this[DELEGATE]) this[DELEGATE] = Object.create(app[delegate]);
      return this[DELEGATE];
    },
    configurable: true,
  });


  const target = Symbol(config.delegate);
  app.loader.loadToApp(modelDir, target, {
    caseStyle: 'upper',
    filter(model) {
      return !!model; // 过滤空model
    },
  });
  
  Object.assign(app[delegate], app[target]);

  return objection;
}
