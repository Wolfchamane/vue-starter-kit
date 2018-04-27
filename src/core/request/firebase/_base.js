import firebase from 'firebase';
import RequestBase from '../_base';
export default class RequestFirebaseBase extends RequestBase
{
    constructor(path = '')
    {
        super();
    }
    _onRequestSuccess(snapshot = null)
    {
        let response;
        if (snapshot !== null)
        {
            response = snapshot.val();
        }
        super._onRequestSuccess(response);
    }

    _get()
    {
        return firebase.database().ref(this._lastRequest.url);
    }

    _post()
    {
        return firebase.database().ref(this._lastRequest.url);
    }

    _buildRequest()
    {
        this._lastRequest.body = this.body;
        this._lastRequest.url = this._replaceQueryParams(this.path);
        this[`_${this.method.toLowerCase()}`]();
    }
}
