const I18n = require('./i18n');

module.exports = {
  register (locator) {
    try {
      const i18n = I18n(locator);
      const handlebars = locator.resolve('handlebars');

      handlebars.registerHelper('_t', i18n._t);
      handlebars.registerHelper('_pt', i18n._pt);
      handlebars.registerHelper('_nt', i18n._nt);
      handlebars.registerHelper('_npt', i18n._npt);
    } catch (e) {
      locator.resolve('eventBus').emit('error', e);
    }
  }
};
