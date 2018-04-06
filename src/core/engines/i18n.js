import enEN from '../../langs/en';

export default class i18nEngine {
    constructor()
    {
        this._translations = null;
    }
    loadTranslations(lang = 'en')
    {
        switch (lang)
        {
            case 'en':
            default:
                this._translations = enEN;
        }
    }
    _get(ref = null, key = '')
    {
        let value;
        if (ref !== null && key !== '')
        {
            if (key.lastIndexOf('.') !== -1)
            {
                key = key.split('.');
                value = ref[key.shift()];
                if (typeof value === 'object' && key.length)
                {
                    value = this._get(value, key.join('.'));
                }
            }
            else
            {
                value = ref[key];
            }
        }
        return value;
    }
    translate(key = '', context = null)
    {
        let value = this._get(this._translations, key);
        if (typeof value === 'string' && value.lastIndexOf('{') !== -1 && context !== null)
        {
            value = value.replace(/(\{\w+\})/g, match =>
            {
                return context[match.replace(/[\{\}]+/g, '')];
            });
        }
        return value || key;
    }
}
