import RequestXHRBase from './_base';

/**
 * Default class for any XHR POST request.
 * @namespace   Core
 * @class       RequestXHRPOST
 * @extends     RequestBase
 */
export default class RequestXHRPOST extends RequestXHRBase
{
    constructor()
    {
        super(...arguments);
        this.method = 'POST';
    }
}
