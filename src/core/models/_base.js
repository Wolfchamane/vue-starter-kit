export default class Base
{
    constructor(model = null)
    {
        this._model = model;
    }
    _beforeInit()
    {}
    _afterInit()
    {
        this._applyModelValues();
        this._applyDateValues();
    }
    _applyModelValues()
    {
        Object.keys(this._model || {}).forEach(prop =>
        {
            if (typeof this[prop] !== 'undefined')
            {
                this[prop] = this._model[prop];
            }
        });
    }
    _applyDateValues()
    {
        Object.keys(this._model || {}).forEach(prop =>
        {
            if (/date/gi.test(prop))
            {
                this[prop] = new Date(this[prop]);
            }
        });
    }
    update(newModel = null)
    {
        this._beforeInit();
        this._model = newModel || {};
        this._afterInit();
    }
    export()
    {
        let result = {};
        Object.keys(this || {}).forEach(key =>
        {
            if (this.hasOwnProperty(key) && key.charAt(0) !== '_')
            {
                result[key] = this[key];
            }
        });
        return result;
    }
}
