# README

This projects is an starter kit to build a web app with VueJS.

## Features

- MVC Framework VueJS
- Default XHR Request Engine
- Firebase Request Engine
- Common APP Engines as _session_, _alerts_, _i18n_ ...
- Base ORM Solution
- Webpack bundling with dev-server and hot reload
- ES6, SASS and PUG development support


## Installation

```bash
$ git clone https://github.com/Wolfchamane/vue-starter-kit.git
$ cd vue-starter-kit
$ npm install
```

## ORM

Included with this starter kit there's a basic ORM solution that can be customize for your proyect.

All required files are within `/src/core/` folder and is accessible through `window.Core` object in runtime.

#### Services

A `service` will allow you to reach any desired API target and create or update a `model after data has being fetch`.

In order to create a `service` do following steps:

1. Create `my-service.js` @ `src/core/services/`.
2. Extend your service class from `ServiceBase` class.
3. Within constructor, add `ServiceBase`'s constructor parameters (see documentation).
4. Override, if required, any `ServiceBase` method.
5. Add your service to `src/core/index.js` file and initialize it.

```javascript
//my-service.js
import ServiceBase      from './_base';
import MyModel          from '../models/my-model';
import RequestXHRGET    from '../request/xhr/get';
export default class MyService extends ServiceBase
{
    constructor()
    {
        super(RequestXHRGET, 'people/{id}', MyModel);
    }
}
```


```javascript
//src/core/index.js
/* eslint new-cap: 0 */
import i18nEngine           from './engines/i18n';
import SessionEngine        from './engines/session';
import AlertsEngine         from './engines/alerts';
// IMPORT YOUR SERVICES HERE !!
import MyService            from './services/my-service';

/**
 * Creates the Core namespace
 * @constructor
 */
export function Core()
{
    return {
        _environment        : '',
        Session             : null,
        i18n                : null,
        Alerts              : null,
        Services            : {
            //Structure here your services
            MyService       : null
        },
        init(env = '')
        {
            this._environment = env;
            return new Promise((resolve, reject) =>
            {
                try
                {
                    this.i18n = new i18nEngine();
                    this.Session = new SessionEngine();
                    this.Alerts = new AlertsEngine();

                    //INIT HERE YOUR SERVICES
                    this.Services.MyService = new MyService();

                    this.i18n.loadTranslations();
                    resolve();
                }
                catch (error)
                {
                    reject(error);
                }
            });
        }
    };
}

```

#### Models

## i18n
