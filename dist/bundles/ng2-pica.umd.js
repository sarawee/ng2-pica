(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('pica/dist/pica'), require('exifr')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs', 'pica/dist/pica', 'exifr'], factory) :
	(factory((global['ng2-pica'] = global['ng2-pica'] || {}),global.ng.core,global.Rx,global.pica,global.exifr));
}(this, (function (exports,_angular_core,rxjs,pica,exifr) { 'use strict';

pica = 'default' in pica ? pica['default'] : pica;

var ImgExifService = /** @class */ (function () {
    function ImgExifService() {
    }
    ImgExifService.prototype.getOrientedImage = function (image) {
        return new Promise(function (resolve) {
            var img;
            exifr.orientation(image).then(function (orientation$$1) {
                if (orientation$$1 != 1) {
                    var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d"), cw = image.width, ch = image.height, cx = 0, cy = 0, deg = 0;
                    switch (orientation$$1) {
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
                    if ([2, 4, 5, 7].indexOf(orientation$$1) > -1) {
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
        { type: _angular_core.Injectable },
    ];
    return ImgExifService;
}());

var Ng2PicaService = /** @class */ (function () {
    function Ng2PicaService(imageExifService) {
        this.imageExifService = imageExifService;
    }
    Ng2PicaService.prototype.resize = function (files, width, height, keepAspectRatio) {
        if (keepAspectRatio === void 0) { keepAspectRatio = false; }
        var resizedFile = new rxjs.Subject();
        for (var i = 0; i < files.length; i++) {
            this.resizeFile(files[i], width, height, keepAspectRatio).then(function (returnedFile) {
                resizedFile.next(returnedFile);
            }).catch(function (error) {
                resizedFile.error(error);
            });
        }
        return resizedFile.asObservable();
    };
    Ng2PicaService.prototype.resizeCanvas = function (from, to, options) {
        var result = new Promise(function (resolve, reject) {
            var curPica = new pica();
            if (!curPica || !curPica.resize) {
                curPica = new window.pica();
            }
            curPica.resize(from, to, options)
                .then(function (response) {
                resolve(response);
            }, function (error) {
                reject(error);
            });
        });
        return result;
    };
    Ng2PicaService.prototype.resizeBuffer = function (options) {
        var result = new Promise(function (resolve, reject) {
            var curPica = new pica();
            if (!curPica || !curPica.resizeBuffer) {
                curPica = new window.pica();
            }
            curPica.resizeBuffer(options)
                .then(function (response) {
                resolve(response);
            }, function (error) {
                reject(error);
            });
        });
        return result;
    };
    Ng2PicaService.prototype.resizeFile = function (file, width, height, keepAspectRatio) {
        var _this = this;
        if (keepAspectRatio === void 0) { keepAspectRatio = false; }
        var result = new Promise(function (resolve, reject) {
            var fromCanvas = document.createElement('canvas');
            var ctx = fromCanvas.getContext('2d');
            var img = new Image();
            img.onload = function () {
                _this.imageExifService.getOrientedImage(img).then(function (orientedImg) {
                    window.URL.revokeObjectURL(img.src);
                    fromCanvas.width = orientedImg.width;
                    fromCanvas.height = orientedImg.height;
                    ctx.drawImage(orientedImg, 0, 0);
                    var imageData = ctx.getImageData(0, 0, orientedImg.width, orientedImg.height);
                    if (keepAspectRatio) {
                        var ratio = Math.min(width / imageData.width, height / imageData.height);
                        width = Math.round(imageData.width * ratio);
                        height = Math.round(imageData.height * ratio);
                    }
                    var useAlpha = true;
                    if (file.type === "image/jpeg" || (file.type === "image/png" && !_this.isImgUsingAlpha(imageData))) {
                        //image without alpha
                        useAlpha = false;
                        ctx = fromCanvas.getContext('2d', { 'alpha': false });
                        ctx.drawImage(orientedImg, 0, 0);
                    }
                    var toCanvas = document.createElement('canvas');
                    toCanvas.width = width;
                    toCanvas.height = height;
                    _this.resizeCanvas(fromCanvas, toCanvas, { 'alpha': useAlpha })
                        .then(function (resizedCanvas) {
                        resizedCanvas.toBlob(function (blob) {
                            var newFile = _this.generateResultFile(blob, file.name, file.type, new Date().getTime());
                            resolve(newFile);
                        }, file.type);
                    })
                        .catch(function (error) {
                        reject(error);
                    });
                });
            };
            img.src = window.URL.createObjectURL(file);
        });
        return result;
    };
    Ng2PicaService.prototype.isImgUsingAlpha = function (imageData) {
        for (var i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] !== 255) {
                return true;
            }
        }
        return false;
    };
    Ng2PicaService.prototype.generateResultFile = function (blob, name, type, lastModified) {
        var resultFile = new Blob([blob], { type: type });
        return this.blobToFile(resultFile, name, lastModified);
    };
    Ng2PicaService.prototype.blobToFile = function (blob, name, lastModified) {
        var file = blob;
        file.name = name;
        file.lastModified = lastModified;
        //Cast to a File() type
        return file;
    };
    Ng2PicaService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    Ng2PicaService.ctorParameters = function () { return [
        { type: ImgExifService, decorators: [{ type: _angular_core.Inject, args: [_angular_core.forwardRef(function () { return ImgExifService; }),] }] }
    ]; };
    return Ng2PicaService;
}());

var Ng2PicaModule = /** @class */ (function () {
    function Ng2PicaModule() {
    }
    Ng2PicaModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [
                        { provide: Ng2PicaService, useClass: Ng2PicaService },
                        { provide: ImgExifService, useClass: ImgExifService }
                    ]
                },] },
    ];
    return Ng2PicaModule;
}());

exports.Ng2PicaService = Ng2PicaService;
exports.Ng2PicaModule = Ng2PicaModule;
exports.ImgExifService = ImgExifService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
