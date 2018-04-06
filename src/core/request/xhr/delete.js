import RequestXHRBase from './_base';

/**
 * Default class for any XHR DELETE request.
 * @namespace   Core
 * @class       RequestXHRDELETE
 * @extends     RequestBase
 */
export default class RequestXHRDELETE extends RequestXHRBase
{
    constructor()
    {
        super(...arguments);
        this.method = 'DELETE';
    }
}
