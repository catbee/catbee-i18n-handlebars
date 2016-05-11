const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { experiment, test, beforeEach } = lab;

const assert = require('assert');
const ServiceLocator = require('catberry-locator');
const EventEmitter = require('events').EventEmitter;

const I18n = require('../../src/i18n');

const GLUE = '\u0004';
const pluralForm = 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);'; // ru

experiment('i18n.', () => {
  let i18n;
  let locator;

  experiment('Default setting.', () => {
    beforeEach((done) => {
      locator = new ServiceLocator();
      locator.registerInstance('config', {
        i18n: {
          plural: pluralForm
        }
      });
      locator.register('eventBus', EventEmitter, true);

      i18n = I18n(locator);

      done();
    });

    experiment('_t - Простой перевод.', () => {
      test('Без перевода.', (done) => {
        var str = 'привет';

        assert.equal(str, i18n._t(str));

        done();
      });

      test('С переменной без перевода.', (done) => {
        var str = '${str}';

        var hbContext = {
          str: 'ничоси'
        };

        assert.equal(hbContext.str, i18n._t.call(hbContext, str));

        done();
      });

      test('С переводом.', (done) => {
        var str = 'привет';

        var root = {
          l10n: {
            привет: [null, 'hello']
          }
        };

        var options = {
          data: { root }
        };

        assert.equal('hello', i18n._t.call(root, str, options));

        done();
      });

      test('С переводом и переменной.', (done) => {
        var str = 'привет ${name}';

        var root = {
          l10n: {
            'привет ${name}': [null, 'hello ${name}']
          },
          name: 'Dude'
        };

        var options = {
          data: { root }
        };

        assert.equal('hello Dude', i18n._t.call(root, str, options));

        done();
      });
    });

    experiment('_pt - Перевод с контекстом.', () => {
      var context = 'Приветствие';

      test('Без перевода.', (done) => {
        var str = 'привет';

        assert.equal(str, i18n._pt(context, str));

        done();
      });

      test('С переменной без перевода.', (done) => {
        var str = '${str}';

        var hbContext = {
          str: 'ничоси'
        };

        assert.equal(hbContext.str, i18n._pt.call(hbContext, context, str));

        done();
      });

      test('С переводом.', (done) => {
        var str = 'привет';

        var root = {
          l10n: {
            [`${context}${GLUE}${str}`]: [null, 'hello']
          }
        };

        var options = {
          data: { root }
        };

        assert.equal('hello', i18n._pt.call(root, context, str, options));

        done();
      });

      test('С переводом и переменной.', (done) => {
        var str = 'привет ${name}';

        var root = {
          l10n: {
            [`${context}${GLUE}${str}`]: [null, 'hello ${name}']
          },
          name: 'Dude'
        };

        var options = {
          data: { root }
        };

        assert.equal('hello Dude', i18n._pt.call(root, context, str, options));

        done();
      });
    });

    experiment('_nt - Перевод со склонением (plural).', () => {
      test('Без перевода.', (done) => {
        var ruPlural = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1];
        var str = 'фотография';
        var plural1 = 'фотографии';
        var plural2 = 'фотографий';

        var plural = [str, plural1, plural2];

        for (let i = 0; i < ruPlural.length; i++) {
          assert.equal(
            plural[ruPlural[i]],
            i18n._nt(str, plural1, plural2, i)
          );
        }

        done();
      });

      test('С переменной без перевода.', (done) => {
        var ruPlural = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1];
        var str = '${count} фотография';
        var plural1 = '${count} фотографии';
        var plural2 = '${count} фотографий';

        var plural = ['фотография', 'фотографии', 'фотографий'];

        for (let i = 0; i < ruPlural.length; i++) {
          assert.equal(
            `${i} ${plural[ruPlural[i]]}`,
            i18n._nt.call({ count: i }, str, plural1, plural2, i)
          );
        }

        done();
      });

      test('С переводом.', (done) => {
        var csPlural = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
        var str = 'филиал';
        var plural1 = 'филиала';
        var plural2 = 'филиалов';

        var plural = ['pobočka', 'pobočky', 'poboček'];

        var root = {
          l10n: {
            '': { 'plural-forms': 'nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2' },
            [str]: [str, ...plural]
          }
        };

        var options = {
          data: { root }
        };

        for (let i = 0; i < csPlural.length; i++) {
          assert.equal(
            plural[csPlural[i]],
            i18n._nt.call(root, str, plural1, plural2, i, options)
          );
        }

        done();
      });

      test('С переводом и переменной.', (done) => {
        var csPlural = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
        var str = '${count} филиал';
        var plural1 = '${count} филиала';
        var plural2 = '${count} филиалов';

        var plural = ['pobočka', 'pobočky', 'poboček'];

        var root = {
          l10n: {
            '': { 'plural-forms': 'nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2\n' },
            [str]: [str, '${count} pobočka', '${count} pobočky', '${count} poboček']
          }
        };

        var options = {
          data: { root }
        };

        for (let i = 0; i < csPlural.length; i++) {
          assert.equal(
            `${i} ${plural[csPlural[i]]}`,
            i18n._nt.call(Object
              .assign({}, root, { count: i }), str, plural1, plural2, i, options)
          );
        }

        done();
      });
    });

    experiment('_npt - Перевод со склонением и контекстом', () => {
      var context = 'Банковская карта';

      test('Без перевода', (done) => {
        var ruPlural = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1];
        var str = 'карта';
        var plural1 = 'карты';
        var plural2 = 'карт';

        var plural = [str, plural1, plural2];

        for (let i = 0; i < ruPlural.length; i++) {
          assert.equal(
            plural[ruPlural[i]],
            i18n._npt(context, str, plural1, plural2, i)
          );
        }

        done();
      });
      test('С переменной без перевода.', (done) => {
        var ruPlural = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1];
        var str = '${count} карта';
        var plural1 = '${count} карты';
        var plural2 = '${count} карт';

        var plural = ['карта', 'карты', 'карт'];

        for (let i = 0; i < ruPlural.length; i++) {
          assert.equal(
            `${i} ${plural[ruPlural[i]]}`,
            i18n._npt.call({ count: i }, context, str, plural1, plural2, i)
          );
        }

        done();
      });
      test('С переводом.', (done) => {
        var enPlural = [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        var str = 'карта';
        var plural1 = 'карты';
        var plural2 = 'карт';

        var plural = ['card', 'cards'];

        var root = {
          l10n: {
            '': { 'plural-forms': 'nplurals=2; plural=(n != 1)\n' },
            [`${context}${GLUE}${str}`]: [str, ...plural]
          }
        };

        var options = {
          data: { root }
        };

        for (let i = 0; i < enPlural.length; i++) {
          assert.equal(
            plural[enPlural[i]],
            i18n._npt.call(Object
              .assign({}, root, { count: i }), context, str, plural1, plural2, i, options)
          );
        }

        done();
      });
      test('С переводом и переменной.', (done) => {
        var enPlural = [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        var str = '${count} карта';
        var plural1 = '${count} карты';
        var plural2 = '${count} карт';

        var plural = ['card', 'cards'];

        var root = {
          l10n: {
            '': { 'plural-forms': 'nplurals=2; plural=(n != 1)\n' },
            [`${context}${GLUE}${str}`]: [str, '${count} card', '${count} cards']
          }
        };

        var options = {
          data: { root }
        };

        for (let i = 0; i < enPlural.length; i++) {
          assert.equal(
            `${i} ${plural[enPlural[i]]}`,
            i18n._npt.call(Object
              .assign({}, root, { count: i }), context, str, plural1, plural2, i, options)
          );
        }

        done();
      });
    });
  });
});