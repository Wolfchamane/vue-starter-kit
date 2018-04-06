/* eslint new-cap: 0 */
import Base from './_base';
export default class Collection extends Base
{
    constructor()
    {
        super(...arguments);
    }

    _afterInit(key = 'items')
    {
        this._applyModelValues(key);
    }
    _applyModelValues(key = 'items')
    {
        if (Array.isArray(this._model) && typeof this[key] === 'function')
        {
            let clazz = this[key];
            this[key] = this._model.map(item =>
            {
                return new clazz(item);
            });
        }
    }

    findBy(prop = '', key = '', value = '')
    {
        let result;
        if (Array.isArray(this[prop]))
        {
            result = this[prop].find(item =>
            {
                return item[key] === value;
            });
        }
        return result;
    }
}
