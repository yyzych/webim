<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';
    
    @import '../statics/scss/reset';
    @import '../statics/scss/animation';
    @import '../statics/scss/scaffolding';
    @import '../statics/scss/helper';
    @import '../statics/scss/icon';

</style>

<template>
    <div id="container">        
        <router-view keep-alive transition="fade" transition-mode='out-in'>
        </router-view>
    </div>
</template>
