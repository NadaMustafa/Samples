<template lang="pug">
  .nr-region-card
    .nr-region-card__card
      div
        img.nr-region-card__img(src="/img/regions/egyptMap.jpg")
      .nr-region-card__info
        .nr-region-card__actions
          p.nr-region-card__name {{ region.name }}
          el-dropdown(trigger="click", @command="onRegionCommand")
              i.icon.ion-ios-arrow-down.nr-region-card__region-actions-trigger
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item(command="edit") Edit
                el-dropdown-item(command="delete") Delete
        .nr-region-card__members
          i.icon.ion-ios-people.nr-region-card__members-icon
          p Members
          p.nr-region-card__members-number {{region.regionMembers.length}}
        .nr-region-card__tags
          template(v-for="tag in tags.slice(0, 2)")
            p.nr-region-card__tag {{tag}}
          template(v-if="tags.length > 2")
            p.nr-region-card__tags-more & {{tags.length - 2}} more..
    .nr-region-card__subsections-container
      svg.nr-region-card__sideLine(width="0", height="0", ref="subsectionsSideLine")
      .nr-region-card__subsection(v-for="subregion in filteredSubRegions", ref="subsection", :key="subregion.id")
        region-card(
          :region="subregion",
          :filteration-options-data="filterationOptionsData")
    el-dialog(
      @click.native.stop="",
      v-if="isInteractable",
      :title="`Pending requests on ${region.name}`",
      :visible.sync="isPendingRequestsDialogVisible",
      center)
        .nr-region-card__pending-requests-dialog-body
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
import { anyTypeAnnotation } from 'babel-types';
@Component({
  components: { RegionCard, NrRegionRequestCard }
})
export default class RegionCard extends Vue {
  private isPendingRequestsDialogVisible = false;
  private isTooltipLoading = false;
  @Prop({ type: Boolean, default: true })
  private isInteractable: boolean;
  @Prop({ type: Region, required: true })
  private region: Region;
  @Prop({ required: true })
  private filterationOptionsData: IFilterationOptions;

  private mounted() {
    this.$nextTick(() => {
      if (this.filteredSubRegions.length > 0) {
        const svgElement = this.$refs.subsectionsSideLine as any;
        const sideLine = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );
        const subsectionElements = this.$refs.subsection as any;
        const lastPos: any =
          subsectionElements[subsectionElements.length - 1].offsetTop - 50;
        svgElement.setAttribute('width', '100');
        svgElement.setAttribute('height', lastPos);
        sideLine.setAttribute('id', 'side-line');
        sideLine.setAttribute('x1', '80');
        sideLine.setAttribute('y1', '0');
        sideLine.setAttribute('x2', '80');
        sideLine.setAttribute('y2', lastPos);
        sideLine.setAttribute('stroke', 'white');
        sideLine.setAttribute('stroke-width', '2px');
        svgElement.append(sideLine);
      }
    });
  }

  private updated() {
    this.$nextTick(() => {
      if (this.filteredSubRegions.length > 0) {
        const svgElement = this.$refs.subsectionsSideLine as any;
        const sideLine = this.$el.querySelector('#side-line') as any;
        const subsectionElements = this.$refs.subsection as any;
        const lastPos: any =
          subsectionElements[subsectionElements.length - 1].offsetTop - 50;
        svgElement.setAttribute('width', '100');
        svgElement.setAttribute('height', lastPos);
        if (sideLine) {
          sideLine.setAttribute('x1', '80');
          sideLine.setAttribute('y1', '0');
          sideLine.setAttribute('x2', '80');
          sideLine.setAttribute('y2', lastPos);
          sideLine.setAttribute('stroke', 'white');
          sideLine.setAttribute('stroke-width', '2px');
          svgElement.append(sideLine);
        }
      } else {
        const svgElement = this.$refs.subsectionsSideLine as any;
        const sideLine = this.$el.querySelector('#side-line');
        svgElement.setAttribute('width', '0');
        svgElement.setAttribute('height', '0');
        if (sideLine) {
          sideLine.setAttribute('x1', '0');
          sideLine.setAttribute('y1', '0');
          sideLine.setAttribute('x2', '0');
          sideLine.setAttribute('y2', '0');
        }
      }
    });
  }
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

  get filteredSubRegions() {
    const entities = this.region.subRegions as IFilterable[];
    const filteredEntities = entities.filter(entity =>
      entity.includes(this.filterationOptionsData.filter)
    );
    if (this.filterationOptionsData.sortingOption) {
      return filteredEntities.sort(
        this.filterationOptionsData.sortingOption.method
      );
    }
    return filteredEntities;
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../../theme/variables.styl'
.nr-region-card
  position relative
  &__card
    width 280px
    height 97px
    margin 10px 10px 0px 40px
    background-color var(--background-color)
    border-radius 5px 
    font-size $font-size-small
    display flex
    z-index 2000
    &--selected
      padding 0px
      border 1px solid var(--primary-color)
  &__img
    height 97px
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
  &__members
    font-size $font-size-smaller
    margin-top $margin
    display flex
  &__members-icon
    font-size $font-size-small
    margin-right 5px
  &__members-number
    color var(--primary-color)
    margin-left auto
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
  &__subsections-container
    display block
    overflow hidden
  &__sideLine
    position absolute
  &__subsection
    padding-left 75px
    position relative
    &:before
      content ''
      position absolute
      top 45px
      left 80px
      float left
      border-bottom 2px solid white
      width 35px
  &__pending-requests-dialog-body
    max-height 50vh
    overflow auto
    nr-grid(0px, 100%)
</style>
