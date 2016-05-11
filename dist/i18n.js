'use strict';

var _get = require('lodash.get');
var i18nBase = require('i18n-base-methods');
var replaceVariables = require('replace-variables');

var GLUE = '\u0004';

/**
 * catbee i18n handlebars helpers module
 *
 * @type {function}
 * @param {ServiceLocator} locator
 * @returns {Object}
 */
module.exports = function (locator) {
  var bus = locator.resolve('eventBus');
  var config = locator.resolve('config');
  var glue = _get(config, 'i18n.glue', GLUE);
  var plural = _get(config, 'i18n.plural', 'nplurals=1; plural=0;');
  var context = _get(config, 'i18n.context', 'l10n');

  return {
    /**
     * Simple translate.
     *
     * @param {string} str
     * @param {Object} options
     * @returns {string}
     * @public
     */

    _t: function _t(str, options) {
      var l10n = _get(options, 'data.root.' + context);

      try {
        var template = i18nBase._t({ l10n: l10n, plural: plural }, str);

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
    _pt: function _pt(ctx, str, options) {
      var l10n = _get(options, 'data.root.' + context);

      try {
        var template = i18nBase._pt({ l10n: l10n, plural: plural }, ctx, str);

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
    _nt: function _nt(str, plural1, plural2, number, options) {
      var l10n = _get(options, 'data.root.' + context);
      var plurals = [str, plural1, plural2];

      var template = void 0;
      try {
        template = i18nBase._nt({ l10n: l10n, plural: plural }, plurals, number);
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
    _npt: function _npt(ctx, str, plural1, plural2, number, options) {
      var l10n = _get(options, 'data.root.' + context);

      var plurals = [str, plural1, plural2];

      var template;
      try {
        template = i18nBase._npt({ l10n: l10n, plural: plural }, ctx, plurals, number);
      } catch (e) {
        bus.emit('error', e);
        template = str;
      }

      return replaceVariables(this, template);
    }
  };
};