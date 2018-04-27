/* global Core */
export default class AlertsEngine
{
    constructor()
    {
        this.items = [];
        this.ERROR_ALERT = 'error';
        this.WARNING_ALERT = 'warning';
        this.INFO_ALERT = 'info';
        this.SUCCESS_ALERT = 'success';
    }

    _removeAlert(alert = null)
    {
        if (alert !== null && alert.duration !== 0)
        {
            alert.style = 'close';
            setTimeout(() =>
            {
                clearTimeout(alert.timeout);
                alert.timeout = null;
                this.items.splice(alert.id - 1, 1);
            }, 500);
        }
    }

    clear()
    {}

    addAlert(type = 'error', message = '', duration = 4)
    {
        let model = {
            style       : '',
            type        : type,
            message     : Core.i18n.translate(message),
            duration    : duration,
            timeout     : null,
            icon        : null
        };

        model.id = this.items.length + 1;
        this.items.push(model);
        setTimeout(() =>
        {
            model.style = 'open';
            model.timeout = setTimeout(this._removeAlert.bind(this, model), model.duration * 1000);
        }, 500);
    }
}
