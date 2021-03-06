import { NgModule } from "@angular/core";
import { Ng2PicaService } from "./ng2-pica.service";
import { ImgExifService } from "./img-exif.service";
var Ng2PicaModule = /** @class */ (function () {
    function Ng2PicaModule() {
    }
    Ng2PicaModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        { provide: Ng2PicaService, useClass: Ng2PicaService },
                        { provide: ImgExifService, useClass: ImgExifService }
                    ]
                },] },
    ];
    return Ng2PicaModule;
}());
export { Ng2PicaModule };
//# sourceMappingURL=ng2-pica.module.js.map