import RequestFirebaseBase from './_base';

export default class RequestFirebaseGET extends RequestFirebaseBase
{
    constructor()
    {
        super();
    }

    _get()
    {
        return super._get(...arguments).on('value', this._onRequestSuccess.bind(this));
    }
}
