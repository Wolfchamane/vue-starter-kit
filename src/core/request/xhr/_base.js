import Base from '../../_base';

// const handleAsValidValues = ['json', 'text', 'blob', 'arraybuffer', ''];
const defaultHeaders = {
    json                : {
        'Accept'        : 'application/json, text/html, */*; q=0.01',
        'Content-Type'  : 'application/json; charset=utf-8'
    },
    text                : {
        'Accept'        : 'text/html, text/plain, */*; q=0.01',
        'Content-Type'  : 'text/plain; charset=utf-8'
    }
};

/**
 * XHR default class base.
 * Performs AJAX request through a Promise interface. When the request is completed, the Promise is
 * resolved or rejected base on service response.
 * @namespace   Core
 * @class       RequestXHRBase
 * @extends     Base
 */
export default class RequestXHRBase extends Base
{
    /**
     * Flags if request should be handled with any kind of authentication.
     * @property    withCredentials
     * @type        {Boolean}
     * @default     false
     */

    /**
     * Numeric value for the limit timeout of the request.
     * @property    timeout
     * @type        {Number}
     * @default     60
     */

    /**
     * Flags the kind of response to be expected.
     * Possible values are: 'json', 'text', 'blob', 'arraybuffer' or ''
     * @property    handleAs
     * @type        {String}
     * @default     ''
     */

    /**
     * XHR request method.
     * @see {@link https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html|Request Methods}
     * @property    method
     * @type        {String}
     * @default     'GET'
     */

    /**
     * XHR request query params.
     * Can be used to substitute query `{param}` values or to add as usually (`?params`)
     * @property    params
     * @type        {Object}
     * @default     null
     */

    /**
     * XHR headers to be sent
     * @see {@link https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html|Request Headers}
     * @property    headers
     * @type        {Object}
     * @default     null
     */

    /**
     * XHR body payload
     * @property    body
     * @type        {Object}
     * @default     null
     */

    /**
     * XHR request endpoint domain, including protocol and port (if required), i.e.: "https://my-domain:8000"
     * @property    host
     * @type        {String}
     * @default     ''
     */

    /**
     * XHR request endpoint path, without leading forward slash, i.e.: "accounts/account/1"
     * @property    path
     * @type        {String}
     * @default     ''
     */

    /**
     * Flags if request is forced or not
     * @property    force
     * @type        {Boolean}
     * @default     false
     */

    /**
     * Promise reference object.
     * @property    _rsvp
     * @type        {Object}
     * @default     {{isPending: Boolean, promise: Object, resolve: Object, reject: Object}}
     * @private
     */

    /**
     * Request reference object.
     * @property    _request
     * @type        {Object}
     * @default     null
     * @private
     */

    /**
     * Default XHR headers
     * @property    _headers
     * @type        {Object}
     * @default     {{'Accept': 'application/json, text/plain, *\/*; q=0.01', 'Content-Type': 'application/json; charset=utf-8'}}
     * @private
     */

    /**
     * Last response obtained from service
     * @property    _lastResponse
     * @type        {*}
     * @default     null
     * @private
     */

    /**
     * @constructor
     * @param   {Object} config Class configuration properties
     */
    constructor(config = null)
    {
        super();
        //Default properties values
        this.withCredentials = false;
        this.timeout = 60;
        this.handleAs = 'json';
        this.method = 'GET';
        this.params = null;
        this.headers = null;
        this.body = null;
        this.host = window.Core._environment;
        this.path = '';
        this.force = false;
        //Private properties
        this._rsvp = {
            isPending   : false,
            promise     : null,
            resolve     : null,
            reject      : null
        };
        this._request = null;
        this._lastResponse = null;
        //Apply config values over class properties
        this._applyConfigValues(config);
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
                        key = key.split('_').map(
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
                        this._normalize(ref[key]);
                    }
                }
            );
        }
    }

    _setLastResponse()
    {
        let response;
        switch (this.handleAs)
        {
            case 'json':
                try
                {
                    response = typeof this._request.response === 'string'
                        ? JSON.parse(this._request.response)
                        : Object.assign({}, this._request.response);
                }
                catch (e)
                {
                    response = null;
                }
                break;
            case 'text':
                response = this._request.response;
                break;
        }

        this._normalize(response || {});
        this._lastResponse = Object.assign({}, response || {});
    }

    _onRequestEnd(method = 'resolve')
    {
        this._setLastResponse();
        this._rsvp.isPending = false;
        this._rsvp[method](this._lastResponse);
    }

    _onRequestFail()
    {
        this._onRequestEnd('reject');
    }

    _onRequestSuccess()
    {
        this._onRequestEnd('resolve');
    }

    _onReadyStateChange()
    {
        if (this._request.readyState === XMLHttpRequest.DONE)
        {
            if (this._request.status <= 399)
            {
                this._onRequestSuccess();
            }
            else
            {
                this._onRequestFail();
            }
        }
    }

    _buildBody()
    {
        let body = this.body;
        switch (this.handleAs)
        {
            case 'json':
                body = JSON.stringify(body || '');
                break;
            case '':
            default:
                body = (Object.keys(body) || []).map(
                    key =>
                    {
                        return `${key}=${body[key]}`;
                    }
                );
                break;
        }

        return body;
    }

    _applyConfigValues(config = null)
    {
        if (config !== null)
        {
            Object.keys(config).forEach(
                key =>
                {
                    if (this.hasOwnProperty(key))
                    {
                        this[key] = config[key];
                    }
                }
            );
        }
    }

    _applyRequestsHeaders()
    {
        let toApply = {};
        Object.assign(toApply, defaultHeaders[this.handleAs] || {}, this.headers || {});
        Object.keys(toApply).forEach(
            header =>
            {
                this._request.setRequestHeader(header, toApply[header]);
            }
        );
    }

    _buildURL()
    {
        let url = [this.host, this.path].join('/');
        let aux = Object.assign({}, this.params || {});
        if (Object.keys(aux).length)
        {
            if (url.lastIndexOf('{') !== -1)
            {
                url = url.replace(
                    /(\{.+\})/g,
                    match =>
                    {
                        let key = match.replace(/[\{\}]+/g, '');
                        let value = aux[key];
                        delete aux[key];
                        return value;
                    }
                );
            }
            let queries = Object.keys(aux);
            if (queries.length > 0)
            {
                url = [
                    url,
                    queries.map(
                        key =>
                        {
                            return `${key}=${aux[key]}`;
                        }
                    ).join('&')
                ].join('?');
            }
        }
        return encodeURI(`${url}${url.lastIndexOf('?') !== -1 ? '&' : '?'}_${(new Date()).getTime()}`);
    }

    _buildRequest()
    {
        this.emit('building-request');
        this._request = new XMLHttpRequest();
        this._request.responseType = this.handleAs;
        this._request.onreadystatechange = this._onReadyStateChange.bind(this);
        this._request.withCredentials = this.withCredentials;
        this._request.timeout = this.timeout * 1000;
        this._request.open(this.method.toUpperCase(), this._buildURL());
        this._applyRequestsHeaders();
        this._request.send(this._buildBody());
    }

    _buildPromise()
    {
        if (!this._rsvp.isPending)
        {
            this.emit('building-promise');
            this._rsvp.isPending = true;
            this._rsvp.promise = new Promise(
                (res, rej) =>
                {
                    this._rsvp.resolve = res;
                    this._rsvp.reject = rej;

                    this._buildRequest();
                }
            );
        }
        return this._rsvp.promise;
    }

    toString(name = '')
    {
        return super.toString(name || 'CoreRequestBase');
    }

    generateRequest(force = false)
    {
        this.force = force;
        return this._buildPromise();
    }

    getLastRequest()
    {
        return this._request;
    }

    getLastResponse()
    {
        return this._lastResponse;
    }
}
