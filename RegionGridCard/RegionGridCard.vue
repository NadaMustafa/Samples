<template lang="pug">
  .nr-region-grid-card
    div
      img.nr-region-grid-card__img(src="/img/regions/egyptMap.jpg")
    .nr-region-grid-card__info
      .nr-region-grid-card__actions
        p.nr-region-card__name {{ region.name }}
        el-dropdown(trigger="click", @command="onRegionCommand")
            i.icon.ion-ios-arrow-down.nr-region-card__region-actions-trigger
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(command="edit") Edit
              el-dropdown-item(command="delete") Delete
      p.nr-region-grid-card__parent(v-if="region.parentRegion") {{this.parentsTree}}
      p.nr-region-grid-card__parent(v-else) Root Region
      .nr-region-grid-card__subregions
        i.icon.ion-ios-compass.nr-region-grid-card__subregions-icon
        p Sub-regions
        p.nr-region-grid-card__subregions-number {{region.subRegions.length}}
      .nr-region-grid-card__members
        i.icon.ion-ios-people.nr-region-grid-card__members-icon
        p Members
        p.nr-region-grid-card__members-number {{region.regionMembers.length}}
      .nr-region-grid-card__tags
        template(v-for="tag in tags.slice(0, 2)")
          p.nr-region-grid-card__tag {{tag}}
        template(v-if="tags.length > 2")
          p.nr-region-grid-card__tags-more & {{tags.length - 2}} more..
    el-dialog(
      @click.native.stop="",
      v-if="isInteractable",
      :title="`Pending requests on ${region.name}`",
      :visible.sync="isPendingRequestsDialogVisible",
      center)
        .nr-region-grid-card__pending-requests-dialog-body
          nr-region-request-card(
            v-for="request in region.pendingRequests",
            :key="request.id",
            :request="request")
            el-button(circle, type="action", @click.stop="onCancelRequestClicked(request)")
              i.fas.fa-ban
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Region from '@/store/models/Region';
import IFilterationOptions, {
  isIFilterationOptions
} from '@/views/common/collection/IFilterationOptions';
import IFilterable, { isIFilterable } from '@/store/models/helpers/IFilterable';
import RegionRequest, { RegionRequestType } from '@/store/models/RegionRequest';
import { RegionRequestActions } from '@/store/actionTypes';
import NrRegionRequestCard from '../../RegionRequestsView/RegionRequestCard/RegionRequestCard.vue';
@Component({
  components: { NrRegionRequestCard }
})
export default class RegionGridCard extends Vue {
  private isPendingRequestsDialogVisible = false;
  private isTooltipLoading = false;
  @Prop({ type: Boolean, default: true })
  private isInteractable: boolean;
  @Prop({ type: Region, required: true })
  private region: Region;

  private onRegionCommand(command: string) {
    if (command === 'edit') {
      this.$router.push({
        name: 'Admin-Region-Edit',
        params: { regionId: this.region.id }
      });
    }
  }

  get tags() {
    return this.region.tag.split(',');
  }

  get parentsTree(): string {
    const parents: string[] = [];
    let child: Region = this.region;
    let hasParent: boolean = true;
    if (this.region.parentRegion) {
      while (hasParent) {
        parents.push(child.parentRegion.name);
        if (child.parentRegion.parentRegion) {
          child = child.parentRegion;
          hasParent = true;
        } else {
          hasParent = false;
        }
      }
    }
    return parents.reverse().join('/');
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../../theme/variables.styl'
.nr-region-grid-card
  width 280px
  height 130px
  background-color var(--background-color)
  border-radius 5px 
  font-size $font-size-small
  display flex
  z-index 2000
  &--selected
    padding 0px
    border 1px solid var(--primary-color)
  &__img
    height 130px
    width 80px
    border-top-left-radius 5px
    border-bottom-left-radius 5px
    object-fit cover
  &__info
    margin $margin
    text-align start
    width 200px
  &__name
    font-size $font-size-small
  &__actions
    display flex
    justify-content space-between
  &__members, &__subregions
    font-size $font-size-smaller
    margin-top $margin
    display flex
  &__members-icon, &__subregions-icon
    font-size $font-size-small
    margin-right 5px
  &__members-number, &__subregions-number
    color var(--primary-color)
    margin-left auto
  &__parent
    color var(--light-middleground-color)
    font-size $font-size-smaller
    text-decoration-line underline
    margin-top 2px
  &__tags
    display flex
    align-items baseline
    margin-top 8px
    font-size $font-size-smaller
    flex-wrap wrap
  &__tag
    background-color var(--light-middleground-color)
    border-radius 8px
    margin-right 5px
    max-width 80px
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    padding 3px
  &__tags-more
      color var(--dimmer-foreground-color)
      margin 5px 0 0 auto
  &__pending-requests-dialog-body
    max-height 50vh
    overflow auto
    nr-grid(0px, 100%)
</style>
