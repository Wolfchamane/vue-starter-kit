/* eslint new-cap: 0 */
import i18nEngine           from './engines/i18n';
import SessionEngine        from './engines/session';
import AlertsEngine         from './engines/alerts';

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
