//app/view1/services/loaderSvc.js
myServices.service('imageLoader', function () {
    var manifest = [
            //{src: "image1.png", id: "image1"},
            //{src: "image2.png", id: "image2"},
        ],
        loader = new createjs.LoadQueue(true);

    this.getResult = function (asset) {
        return loader.getResult(asset);
    };
    this.getLoader = function () {
        return loader;
    };
    this.loadAssets = function () {
        loader.loadManifest(manifest, true, "/app/assets/");
    };
});