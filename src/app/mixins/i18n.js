/* global Core */
const i18nMixin = {
    methods : {
        t(key = '', context = null)
        {
            return Core.i18n.translate(key, context);
        }
    }
};

export default i18nMixin;
