import RequestXHRBase from './_base';

/**
 * Default class for any XHR GET request.
 * @namespace   Core
 * @class       RequestXHRGET
 * @extends     RequestBase
 */
export default class RequestXHRGET extends RequestXHRBase
{
    constructor(config = null)
    {
        super(Object.assign(config || {}, {
            method   : 'GET',
            handleAs : 'json'
        }));
    }
}
