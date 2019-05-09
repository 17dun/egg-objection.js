'use strict';
const path = require('path');

module.exports = app => {
  app.addSingleton('objection', initObjection);
};


function initObjection(config, app) {
  const objection = require('objection');
  const Knex = require('knex');
  const knex = Knex(config.knex);

  promisifyTransaction(knex);

  app.knex = knex;

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


function promisifyTransaction (client) {
    const proto = Reflect.getPrototypeOf(client.client);

    if (proto._promisify_transaction) {
        return;
    }

    proto._promisify_transaction = true;

    proto._raw_transaction = proto.transaction;

    proto.transaction = function (...args) {
        if (typeof args[0] === 'function') {
            if (isGenerator(args[0])) args[0] = co.wrap(args[0]);
            return proto._raw_transaction.apply(this, args);
        }
        let config;
        let outTx;
        if (args.length > 0) outTx = args.pop();
        if (args.length > 0) config = args.pop();

        return new Promise(resolve => {
            const transaction = proto._raw_transaction.apply(this, [
                function _container (trx) {
                    resolve(trx);
                },
                config,
                outTx,
            ]);

            transaction.rollback = function (conn, error) {
                return this.query(conn, 'ROLLBACK', error ? 2 : 1, error)
                    .timeout(5000)
                    .catch(Promise.TimeoutError, () => {
                        this._resolver();
                    });
            };

            transaction.rollbackTo = function (conn, error) {
                return this.query(conn, `ROLLBACK TO SAVEPOINT ${this.txid}`, error ? 2 : 1, error)
                    .timeout(5000)
                    .catch(Promise.TimeoutError, () => {
                        this._resolver();
                    });
            };
        });
    };
}

function isGenerator (fn) {
    return Object.prototype.toString.call(fn) === '[object GeneratorFunction]';
}