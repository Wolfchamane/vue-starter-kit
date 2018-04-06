const EventEmitter = require('events');

/**
 * Base class for every item within Core namespace
 * @namespace   Core
 * @class       Base
 * @extends     EventEmitter
 */
export default class Base extends EventEmitter
{
    toString(name = '')
    {
        return `[object ${name || 'CoreBase'}]`;
    }
}
