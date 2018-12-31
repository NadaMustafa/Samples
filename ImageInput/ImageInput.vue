<template lang="pug">
  .nr-image-input(:class="{'nr-image-input--round': round}" v-loading="isLoadingPreview")
    .nr-image-input__container(
      :class="{'nr-image-input__container--success': file, 'nr-image-input__container--round':round}")
      //- .nr-image-input__text {{text}}
      i.el-icon-plus.nr-image-input__icon.nr-image-input__add(v-if="showAddButton")
      img.nr-image-input__img(
        :class="{'nr-image-input--round': round}"
        :src="fileBase64" v-if="fileBase64")
      img.nr-image-input__img(
        :class="{'nr-image-input--round': round}"
        :src="placeholder" v-else-if="placeholder")
      nr-progress(v-if="uploadProgress !== 0" :uploadProgress="uploadProgress")
      input.nr-image-input__input(
        type="file",
        @change="onFileChanged",
        accept="image/*"
        ref="fileInput")
      .nr-image-input__actions(v-if="file")
        i.el-icon-plus.nr-image-input__icon.nr-image-input__add(@click="editFile")
        i.el-icon-delete.nr-image-input__icon.nr-image-input__delete(@click="deleteFile")
      .nr-image-input__actions(v-else-if="placeholder")
        i.el-icon-plus.nr-image-input__icon.nr-image-input__add(@click="editFile")
    .nr-image-input__text {{text || 'Select or Drag & Drop File'}}
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import { toKebabCase } from '../../../utils/string-utils';
import NrProgress from './Progress/Progress.vue';
import ImageFile from './ImageFile';
import AWS from 'aws-sdk';

@Component({
  components: { NrProgress }
})
export default class ImageInput extends Vue {
  @Prop({ default: false, type: Boolean })
  private round: boolean;
  @Prop({ default: Infinity, type: Number })
  private maxSize: number;
  @Prop({ default: null, type: Number, validator: value => value !== Infinity })
  private aspectRatio: number;
  @Model('fileChanged', { default: '', type: String })
  private fileKey: string = '';
  // private isSet: boolean;
  @Prop({ type: String })
  private placeholder: any;
  private fileBase64: any = null;
  private file: any = null;
  private text: string = '';
  private isLoadingPreview = false;
  private uploadProgress: number = 0;
  private fileName: string = '';

  public upload(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.file === null) {
        reject('no file chosen to upload');
      }
      const albumBucketName = 'album-bucket-name';
      const bucketRegion = 'us-east-1';
      AWS.config.update({
        region: bucketRegion,
        credentials: new AWS.Credentials({
          accessKeyId: 'ACESSKEYID',
          secretAccessKey: 'SECRETACESSKEY'
        })
      });
      const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        region: bucketRegion,
        params: { Bucket: albumBucketName }
      });
      const photoKey: string = this.fileName;
      let file: any;
      if (this.file) {
        file = this.file;
      } else if (this.placeholder) {
        file = this.placeholder;
      }
      const params = {
        Bucket: albumBucketName,
        Key: photoKey,
        Body: file
      };
      const vm = this;
      s3
        .upload(params, (err: any, data: any) => {
          if (err) {
            vm.$data.fileKey = '';
            reject('something went wrong');
          } else {
            vm.$data.fileKey = photoKey;
            resolve(photoKey);
          }
        })
        .on('httpUploadProgress', (evt: any) => {
          vm.$data.uploadProgress = Number(evt.loaded * 100 / evt.total);
        });
    });
  }
  private get showAddButton() {
    if (!this.file && !this.placeholder) {
      return true;
    } else {
      return false;
    }
  }
  private onFileChanged(event: any) {
    const inputFile = event.target.files[0];
    if (inputFile) {
      this.file = null;
      this.fileBase64 = null;
      this.text = '';
      this.isLoadingPreview = true;
      if (inputFile.type.match('image.*')) {
        ImageFile.create(inputFile).then(imageFile => {
          this.isLoadingPreview = false;
          const isValidSize: boolean = imageFile.isValidSize(this.maxSize);
          const isValidAspectRatio: boolean = imageFile.isValidAspectRatio(
            this.aspectRatio
          );
          if (isValidSize) {
            if (isValidAspectRatio) {
              this.file = imageFile.file;
              this.fileBase64 = imageFile.image.src;
              this.text = imageFile.file.name;
            } else {
              this.text = `image does not match required aspect ratio of ${this.aspectRatio.toPrecision(
                4
              )}`;
            }
          } else {
            this.text = `Size larger than ${this.maxSize} MB`;
          }
          if (this.file) {
            this.fileName = toKebabCase(Date.now() + '-' + this.file.name);
            this.$emit('fileChanged', this.fileName);
          } else {
            this.$emit('fileChanged', '');
          }
        });
      } else {
        this.isLoadingPreview = false;
        this.text = 'Invalid file type';
        this.$emit('fileChanged', '');
      }
    }
  }
  private deleteFile() {
    this.fileBase64 = null;
    this.file = null;
    this.text = '';
    this.uploadProgress = 0;
    this.$emit('fileChanged', '');
  }
  private editFile() {
    const inputElem: any = this.$refs.fileInput;
    inputElem.click();
  }
}
</script>

<style lang="stylus" scoped>
.nr-image-input
  min-height 45px
  width 100%
  margin-bottom 40px
  display flex
  flex-wrap wrap
  &__container
    height 100%
    width 100%
    display flex
    position relative
    cursor pointer
    overflow hidden
    background var(--background-color)
    border 2px dashed var(--dimmer-foreground-color)
    border-radius 4px
    &:hover, &:focus-within
      border-color var(--primary-color)
      border-style dashed
      .nr-image-input__add
        color var(--primary-color)
    &--success
      border-color var(--primary-color)
      border-style solid
    &--round
      border-radius 50%
  &--round
    border-radius 50%
  &__input
    opacity 0
    width 100%
    height 100%
    position absolute
    cursor pointer
    z-index 1
  &__actions
    // z-index 2000
    display none
    width 100%
    height 100%
    position absolute
  &:hover &__actions
    display flex
    flex-wrap wrap
  &__icon
    font-weight bold
    font-size 1rem
    // color var(--dimmer-foreground-color)
  &__add
    margin auto
    z-index 1
    &:hover
      color var(--primary-color)
  &__delete
    position absolute
    right 10px
    top 10px
    z-index 2
    &:hover
      color red
  &__img
    // position absolute
    width 100%
    height 100%
    object-fit cover
    &--round
      border-radius 50%
  &:hover &__img
    opacity 0.5
  &__text
    width 100%
    color white
    line-height normal
    text-align center
    padding 8px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
  &__placeholder
    position absolute
    object-fit cover
    width 100%
</style>
