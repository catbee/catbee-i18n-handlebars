const _get = require('lodash.get');
const i18nBase = require('i18n-base-methods');
const replaceVariables = require('replace-variables');

const GLUE = '\u0004';

/**
 * catbee i18n handlebars helpers module
 *
 * @type {function}
 * @param {ServiceLocator} locator
 * @returns {Object}
 */
module.exports = (locator) => {
  const bus = locator.resolve('eventBus');
  const config = locator.resolve('config');
  const glue = _get(config, 'i18n.glue', GLUE);
  const plural = _get(config, 'i18n.plural', 'nplurals=1; plural=0;');
  const context = _get(config, 'i18n.context', 'l10n');

  return {
    /**
     * Simple translate.
     *
     * @param {string} str
     * @param {Object} options
     * @returns {string}
     * @public
     */
    _t (str, options) {
      const l10n = _get(options, `data.root.${context}`);

      try {
        const template = i18nBase._t({ l10n, plural }, str);

        return replaceVariables(this, template);
      } catch (e) {
        bus.emit('error', e);

        return str;
      }
    },

    /**
     * Simple translate with context.
     *
     * @param {string} ctx
     * @param {string} str
     * @param {Object} options
     * @returns {string}
     * @public
     */
    _pt (ctx, str, options) {
      const l10n = _get(options, `data.root.${context}`);

      try {
        const template = i18nBase._pt({ l10n, plural }, ctx, str);

        return replaceVariables(this, template);
      } catch (e) {
        bus.emit('error', e);

        return str;
      }

    },

    /**
     * Translate with plural form.
     *
     * @param {string} str
     * @param {string} plural1
     * @param {string} plural2
     * @param {number} number
     * @param {Object} options
     * @returns {string}
     * @public
     */
    _nt (str, plural1, plural2, number, options) {
      const l10n = _get(options, `data.root.${context}`);
      const plurals = [str, plural1, plural2];

      let template;
      try {
        template = i18nBase._nt({ l10n, plural }, plurals, number);
      } catch (e) {
        bus.emit('error', e);
        template = str;
      }

      return replaceVariables(this, template);
    },

    /**
     * Translate with context and plural form.
     *
     * @param {string} ctx
     * @param {string} str
     * @param {string} plural1
     * @param {string} plural2
     * @param {number} number
     * @param {Object} options
     * @returns {string}
     * @public
     */
    _npt (ctx, str, plural1, plural2, number, options) {
      const l10n = _get(options, `data.root.${context}`);

      const plurals = [str, plural1, plural2];

      var template;
      try {
        template = i18nBase._npt({ l10n, plural }, ctx, plurals, number);
      } catch (e) {
        bus.emit('error', e);
        template = str;
      }

      return replaceVariables(this, template);
    }
  };
};