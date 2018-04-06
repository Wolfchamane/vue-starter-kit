<template lang="pug">
    #app.app
        router-view
</template>

<script>
    export default {
        name    : 'app'
    };
</script>

<style lang="sass">
    @import '../styles/main'
    .app
        width: 100%
        height: 100%
</style>
