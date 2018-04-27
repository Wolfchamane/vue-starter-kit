export default class RequestBase
{
    constructor(path = '')
    {
        this.path           = path;
        this.method         = 'GET';
        this.params         = null;
        this.body           = null;

        this._lastRequest   = {
            url         : '',
            method      : '',
            params      : null,
            body        : null,
            response    : null,
            request     : null
        };

        this._rsvp          = {
            isPending   : false,
            promise     : Promise,
            resolve     : null,
            reject      : null
        };
    }

    _normalize(ref = null)
    {
        if (typeof ref === 'object' && ref !== null)
        {
            Object.keys(ref).forEach(
                key =>
                {
                    let value = ref[key];
                    if (key.lastIndexOf('_') !== -1)
                    {
                        delete ref[key];
                        key = key.split(/[\_\-\.]+/g).map(
                            (item, index) =>
                            {
                                return index >= 1
                                    ? item.charAt(0).toUpperCase() + item.substr(1)
                                    : item;
                            }
                        ).join('.').replace(/\./g, '');
                        ref[key] = value;
                    }

                    if (typeof value === 'object')
                    {
                        ref[key] = this._normalize(ref[key]);
                    }
                }
            );
        }
        return ref;
    }


    _onRequestEnd(method = 'resolve', payload = null)
    {
        this._rsvp.isPending = false;
        this._rsvp.promise = Promise;
        this._rsvp[method](payload);
    }

    _onRequestFail(error = null)
    {
        error = this._normalize(error);
        this._lastRequest.response = error;
        this._onRequestEnd('reject', error);
    }

    _onRequestSuccess(response = null)
    {
        response = this._normalize(response);
        this._lastRequest.response = response;
        this._onRequestEnd('resolve', response);
    }

    _buildRequest()
    {
        /* eslint no-console: 0 */
        console.warn('Method _buildRequest() must be override!');
    }

    _buildPromise(callback = null)
    {
        this._rsvp.promise = new Promise((resolve, reject) =>
        {
            this._rsvp.resolve = resolve;
            this._rsvp.reject = reject;
            if (typeof callback === 'function')
            {
                callback();
            }
        });
        return this._rsvp.promise;
    }

    _buildURL(url = '')
    {
        let aux = Object.assign({}, this.params || {});
        if (url.lastIndexOf('{') !== -1)
        {
            url = url.replace(/({\w+})/g, match =>
            {
                let key = match.replace(/[\{\}]+/g, '');
                let value = aux[key];
                if (typeof value !== 'undefined')
                {
                    delete aux[key];
                }
                return value;
            });
        }
        let queries = Object.keys(aux);
        if (queries.length)
        {
            url += queries.map(query =>
            {
                return `${query}=${aux[query]}`;
            }).join('&');
        }
        this._lastRequest.url = url;
        this._lastRequest.params = this.params;
        return url;
    }

    generateRequest()
    {
        return this._buildPromise(() =>
        {
            this._buildURL();
            this._buildRequest(...arguments);
        });
    }

    getLastResponse()
    {
        return this._lastRequest.response;
    }

    getLastRequest()
    {
        return this._lastRequest;
    }
}
