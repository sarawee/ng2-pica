import { Observable } from 'rxjs';
import { ImgExifService } from './img-exif.service';
export interface ResizeCanvasOptions {
    quality?: number;
    alpha?: boolean;
    unsharpAmount?: number;
    unsharpRadius?: number;
    unsharpThreshold?: number;
}
export interface ResizeBufferOptions {
    src: Uint8Array;
    width: number;
    height: number;
    toWidth: number;
    toHeight: number;
    quality?: number;
    alpha?: boolean;
    unsharpAmount?: number;
    unsharpRadius?: number;
    unsharpThreshold?: number;
}
export declare class Ng2PicaService {
    private imageExifService;
    constructor(imageExifService: ImgExifService);
    resize(files: File[], width: number, height: number, keepAspectRatio?: boolean): Observable<any>;
    resizeCanvas(from: HTMLCanvasElement, to: HTMLCanvasElement, options: ResizeCanvasOptions): Promise<HTMLCanvasElement>;
    resizeBuffer(options: ResizeBufferOptions): Promise<Uint8Array>;
    private resizeFile(file, width, height, keepAspectRatio?);
    private isImgUsingAlpha(imageData);
    private generateResultFile(blob, name, type, lastModified);
    private blobToFile(blob, name, lastModified);
}
