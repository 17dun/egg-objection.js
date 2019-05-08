'use strict';

const mock = require('egg-mock');

describe('test/objection.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/objection-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, objection')
      .expect(200);
  });
});
