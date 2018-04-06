import RequestXHRBase from './_base';

/**
 * Default class for any XHR PUT request.
 * @namespace   Core
 * @class       RequestXHRPUT
 * @extends     RequestBase
 */
export default class RequestXHRPUT extends RequestXHRBase
{
    constructor()
    {
        super(...arguments);
        this.method = 'PUT';
    }
}
