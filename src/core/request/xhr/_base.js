import RequestBase from '../_base';

export default class RequestXHRBase extends RequestBase
{

    /**
     * @constructor
     */
    constructor()
    {
        super();
        //Default properties values
        this.withCredentials = false;
        this.timeout = 60;
        this.handleAs = 'json';
        this.headers = null;
        this.host = window.Core._environment;
    }

    _onReadyStateChange()
    {
        if (this._lastRequest.request.readyState === XMLHttpRequest.DONE)
        {
            let response = this._lastRequest.request.response;
            if (this._lastRequest.request.status <= 399)
            {
                this._onRequestSuccess(response);
            }
            else
            {
                this._onRequestFail(response);
            }
        }
    }

    _buildBody()
    {
        let body = this.body;
        switch (this.handleAs)
        {
            case 'text':
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

    _applyRequestsHeaders()
    {
        let toApply = Object.assign({}, this.headers || {});
        Object.keys(toApply).forEach(
            header =>
            {
                this._lastRequest.request.setRequestHeader(header, toApply[header]);
            }
        );
        this._lastRequest.headers = toApply;
    }

    _buildURL()
    {
        let url = super._buildURL([this.host, this.path].join('/'));
        this._lastRequest.url = encodeURI(`${url}${url.lastIndexOf('?') !== -1 ? '&' : '?'}_${(new Date()).getTime()}`);
    }

    _buildRequest()
    {
        this._lastRequest.body = this._buildBody();
        this._lastRequest.method = this.method.toUpperCase();

        this._lastRequest.request = new XMLHttpRequest();
        this._lastRequest.request.responseType = this.handleAs;
        this._lastRequest.request.onreadystatechange = this._onReadyStateChange.bind(this);
        this._lastRequest.request.withCredentials = this.withCredentials;
        this._lastRequest.request.timeout = this.timeout * 1000;
        this._lastRequest.request.open(this._lastRequest.method, this._lastRequest.url);
        this._applyRequestsHeaders();
        this._lastRequest.request.send(this._lastRequest.body);
    }

    generateRequest(force = false)
    {
        return super.generateRequest(force);
    }

    toString(name = '')
    {
        return super.toString(name || 'CoreRequestBase');
    }
}
