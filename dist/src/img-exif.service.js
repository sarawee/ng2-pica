import { Injectable } from '@angular/core';
import * as exifr from 'exifr';
var ImgExifService = /** @class */ (function () {
    function ImgExifService() {
    }
    ImgExifService.prototype.getOrientedImage = function (image) {
        return new Promise(function (resolve) {
            var img;
            exifr.orientation(image).then(function (orientation) {
                if (orientation != 1) {
                    var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), cw = image.width, ch = image.height, cx = 0, cy = 0, deg = 0;
                    switch (orientation) {
                        case 3:
                        case 4:
                            cx = -image.width;
                            cy = -image.height;
                            deg = 180;
                            break;
                        case 5:
                        case 6:
                            cw = image.height;
                            ch = image.width;
                            cy = -image.height;
                            deg = 90;
                            break;
                        case 7:
                        case 8:
                            cw = image.height;
                            ch = image.width;
                            cx = -image.width;
                            deg = 270;
                            break;
                        default:
                            break;
                    }
                    canvas.width = cw;
                    canvas.height = ch;
                    if ([2, 4, 5, 7].indexOf(orientation) > -1) {
                        //flip image
                        ctx.translate(cw, 0);
                        ctx.scale(-1, 1);
                    }
                    ctx.rotate(deg * Math.PI / 180);
                    ctx.drawImage(image, cx, cy);
                    img = document.createElement("img");
                    img.width = cw;
                    img.height = ch;
                    img.addEventListener('load', function () {
                        resolve(img);
                    });
                    img.src = canvas.toDataURL("image/png");
                }
                else {
                    resolve(image);
                }
            });
        });
    };
    ImgExifService.decorators = [
        { type: Injectable },
    ];
    return ImgExifService;
}());
export { ImgExifService };
//# sourceMappingURL=img-exif.service.js.map