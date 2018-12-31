<template lang="pug">
.nr-progress
  .nr-progress__circle
  el-progress.nr-progress__bar(
    type="circle" :percentage="uploadProgress"
    :width="80"
    :stroke-width="5"
    :show-text="false")
  span.nr-progress__text {{Math.round(uploadProgress)}}%  
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Progress extends Vue {
  @Prop({ required: true, type: Number })
  private uploadProgress: number;
}
</script>

<style lang="stylus" scoped>
.nr-progress
  &__circle
    position absolute
    border-radius 50%
    width 75px
    height 75px
    left 50%
    top 50%
    transform translateX(-50%) translateY(-50%)
    background #2c3e50
    opacity 0.8
  &__bar 
    position absolute
    left 50%
    top 50%
    transform translateX(-50%) translateY(-50%)
  &__text
    position absolute    
    left 50%
    top 50%
    transform translateX(-50%) translateY(-50%)
    color white
    font-size 24px
</style>
