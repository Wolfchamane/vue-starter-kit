/* eslint new-cap: 0 */
export default class ServiceBase
{
    constructor(request = null, path = '', model = null)
    {
        this.request = request;
        this.model = model;

        if (typeof this.request === 'function')
        {
            this.request = new this.request(path);
        }
    }

    _createModel(data = null)
    {
        if (this.model !== null)
        {
            if (typeof this.model === 'function')
            {
                this.model = new this.model(data);
            }
            else
            {
                this.model.update(data);
            }
        }
    }

    fetch(params = null)
    {
        this.request.params = Object.assign(this.request.params || {}, params || {});
        this.request.method = 'GET';
        return this.request.generateRequest().then(this._createModel.bind(this));
    }

    update(params = null, payload = null)
    {
        this.request.params = Object.assign(this.request.params || {}, params || {});
        this.request.method = 'POST';
        this.request.body = payload;
        return this.request.generateRequest().then(this._createModel.bind(this));
    }

    create(params = null, payload = null)
    {
        this.request.params = Object.assign(this.request.params || {}, params || {});
        this.request.method = 'PUT';
        this.request.body = payload;
        return this.request.generateRequest().then(this._createModel.bind(this));
    }

    remove(params = null)
    {
        this.request.params = Object.assign(this.request.params || {}, params || {});
        this.request.method = 'DELETE';
        this.request.body = null;
        return this.request.generateRequest().then(this._createModel.bind(this));
    }
}
