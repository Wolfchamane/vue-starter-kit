/* global Core, localStorage */
export default class SessionEngine
{
    constructor()
    {
        this.active     = false;
        this.token      = null;
        this.user       = null;
        this.expires    = null;
        this._storeKey  = 'muapp-session';
        this._timeout   = null;
        this._evalTime  = 10;
    }

    _store()
    {
        localStorage.setItem(this._storeKey, window.btoa(JSON.stringify({
            user    : this.user,
            token   : this.token,
            expires : this.expires.getTime()
        })));
    }

    _retrieve()
    {
        let store = localStorage.getItem(this._storeKey);
        if (store)
        {
            store = JSON.parse(window.atob(store));
        }
        else
        {
            store = {
                user        : null,
                token       : null,
                expiration  : 0
            };
        }
        return store;
    }

    _reset()
    {
        localStorage.removeItem(this._storeKey);
        this.active = false;
        this.token = null;
        this.expires = null;
        this.user = null;
        if (this._timeout)
        {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    }

    init(token = '')
    {
        this.active = true;
        this.token = token;
        this.expires = new Date();
        this.expires.setHours(Number(this.expires.getHours() + 1));
        this.user = Core.User.export();
        this._store();
        this._timeout = setTimeout(this.isActive.bind(this), this._evalTime * 60000);
    }

    finish()
    {
        Core.Services.PeopleDetail.update({id : Core.User.id}, Core.User.export());
        this._reset();
    }

    isActive()
    {
        let {user, token, expires} = this._retrieve();
        let isActive = this.active;
        let sessionExpiration = this.expires;
        if (!sessionExpiration)
        {
            sessionExpiration = new Date(expires);
        }
        isActive = (new Date()).getTime() <= sessionExpiration.getTime();
        if (isActive && !this.user && !this.token)
        {
            this.user = user;
            this.token = token;
        }
        if (!isActive)
        {
            this._reset();
        }
        this.active = isActive;
        return isActive;
    }
}
