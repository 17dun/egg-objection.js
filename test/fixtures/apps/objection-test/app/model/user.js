'use strict';

module.exports = app => {
  class User extends app.model {
    static get tableName() {
      return 'users';
    }
  };
  return User;
}
