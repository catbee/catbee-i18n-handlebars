# catbee-i18n-handlebars

[![Build Status][travis-img]][travis-url]
[![Code Coverage][codecov-img]][codecov-url]

# Handlebars i18n helpers

``` js
  const i18nHelpers = require('catbee-i18n-handlebars');
  i18nHelpers.register(serviceLocator); // expect handlebars in serviceLocator
```

## Four helpers for usage in .hbs .handlebars templates

- `{{ _t "Your name" }}` - Simple translate
- `{{ _pt "Translate context" "Your name" }}` - Simple translate with context
- `{{ _nt "Apple" "Apples" count }}` - Translate with plural form
- `{{ _npt "Translate context" "Apple" "Apples" count }}` - Translate with plural form and context

## Example

### Helpers get translates from `@root.l10n` and variables (`${name}`) for replace in string from current `this` context

template
``` html
  {{#each names}}
    <div class="Text">{{ _t "Your name ${name}" }}</div>
  {{/each}}
```
with context
``` js
  // template context
  const ctx = {
    l10n: {
      "": {
        "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)"
      },
      "Your name ${var}": [ null, "Vaše jméno ${name}"],
    },
    names: [
      { name: 'Jack' }
      { name: 'Ion' }
      { name: 'Bit' }
    ]
  };
```
have output:
```
Vaše jméno Jack
Vaše jméno Ion
Vaše jméno Bit
```

## config

Service get `config` from serviceLocator and use `config.i18n` property.

``` js
config = { // default config
  i18n: {
    // po2json default glue symbol to concat context and str
    glue: '\u0004',
    // plural form for your application default language
    plural: 'nplurals=1; plural=0;',
    // name of property with po2json object in ctx object
    context: 'l10n'
  }
};
```

## Errors
All errors in i18n helpers will be emitted to catbee eventBus:
``` js
  eventBus.emit('error', error);
```

[travis-img]: https://travis-ci.org/catbee/catbee-i18n-handlebars.svg?branch=master
[travis-url]: https://travis-ci.org/catbee/catbee-i18n-handlebars

[codecov-img]: https://codecov.io/github/catbee/catbee-i18n-handlebars/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/catbee/catbee-i18n-handlebars?branch=master
