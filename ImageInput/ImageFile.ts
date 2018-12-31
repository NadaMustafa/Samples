export default class ImageFile {
  public static create(file: File): Promise<ImageFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        const image = new Image();
        image.onload = () => {
          resolve(new ImageFile(file, image));
        };
        image.src = reader.result;
      };
    });
  }

  // tslint:disable:variable-name
  private _image: HTMLImageElement;
  private _file: File;

  public get file(): File {
    return this._file;
  }

  public get image(): HTMLImageElement {
    return this._image;
  }

  public get width(): number {
    return this._image.width;
  }

  public get height(): number {
    return this._image.height;
  }

  public get inputSize(): number {
    return this._file.size;
  }

  private constructor(file: File, image: HTMLImageElement) {
    this._file = file;
    this._image = image;
  }

  public isValidSize(maxSize: number): boolean {
    if (this.inputSize > maxSize * 1000000) {
      return false;
    }
    return true;
  }

  public isValidAspectRatio(aspectRatio: number): boolean {
    if (aspectRatio === null) {
      return true;
    }
    const maxAspectRatio: number = aspectRatio * 100 + 5;
    const minAspectRatio: number = aspectRatio * 100 - 5;
    const imageAspectRatio: number = this.width / this.height * 100;
    if (
      imageAspectRatio >= minAspectRatio &&
      imageAspectRatio <= maxAspectRatio
    ) {
      return true;
    }
    return false;
  }
}
