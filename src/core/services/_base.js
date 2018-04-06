/* eslint new-cap: 0 */
import RequestFirebaseBase from '../request/firebase/_base';
export default class ServiceBase
{
    constructor(path = '', model = null)
    {
        this.request = new RequestFirebaseBase(path);
        this.model = model;
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
}
