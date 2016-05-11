'use strict';

var i18n = require('./i18n');

module.exports = {
  register: function register(locator) {
    try {
      var handlebars = locator.resolve('handlebars');

      handlebars.registerHelper('_t', i18n._t);
      handlebars.registerHelper('_pt', i18n._pt);
      handlebars.registerHelper('_nt', i18n._nt);
      handlebars.registerHelper('_npt', i18n._npt);
    } catch (e) {
      locator.resolve('eventBus').emit('error', e);
    }
  }
};