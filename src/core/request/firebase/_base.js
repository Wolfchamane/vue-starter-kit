import firebase from 'firebase';
export default class RequestFirebaseBase
{
    constructor(path = '')
    {
        this.path           = path;
        this.method         = 'GET';
        this.params         = null;
        this.body           = null;
        this._lastRequest   = {
            url             : '',
            params          : '',
            response        : null,
            body            : null
        };
        this._rsvp          = {
            isPending       : false,
            promise         : null,
            resolve         : null,
            reject          : null
        };
    }
    _onRequestError(error = null)
    {
        this._lastRequest.response = error;
        this._rsvp.reject(error);
        this._rsvp.isPending = false;
    }
    _onRequestSuccess(snapshot = null)
    {
        if (snapshot !== null)
        {
            this._lastRequest.response = snapshot.val();
        }
        this._rsvp.resolve(this._lastRequest.response);
        this._rsvp.isPending = false;
    }
    _buildRequestURL()
    {
        let url = this.path;
        let aux = Object.assign({}, this.params || {});
        if (url.lastIndexOf('{') !== -1)
        {
            url = url.replace(/(\{[a-z]+\})/g, match =>
            {
                let key = match.replace(/[{}]+/g, '');
                let value = aux[key];
                delete aux[key];
                return value;
            });
        }
        this._lastRequest.url = url;
        this._lastRequest.params = this.params;
    }
    _get()
    {
        return firebase.database().ref(this._lastRequest.url).on('value', this._onRequestSuccess.bind(this));
    }
    _post()
    {
        this._lastRequest.body = this.body;
        return firebase.database().ref(this._lastRequest.url).set(this.body).then(this._onRequestSuccess.bind(this));
    }
    generateRequest()
    {
        this._rsvp.isPending = true;
        return new Promise((resolve, reject) =>
        {
            this._rsvp.resolve = resolve;
            this._rsvp.reject = reject;

            this._buildRequestURL();

            this[`_${this.method.toLowerCase()}`]();
        });
    }
}
