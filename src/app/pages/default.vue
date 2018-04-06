<template lang="pug">
    h1 {{t('labels.welcome')}}!
</template>
<script>
    import i18nMixin from '../mixins/i18n';
    export default {
        name    : 'default',
        mixins  : [i18nMixin]
    };
</script>
