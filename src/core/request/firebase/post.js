import RequestFirebaseBase from "./_base";

export default class RequestFirebasePOST extends RequestFirebaseBase
{
    constructor()
    {
        super();
    }

    _post()
    {
        return super._post(...arguments).set(this.body).then(this._onRequestSuccess.bind(this));
    }
}
