(function() {
    var takePhotoBtn = document.getElementById('btnTakePhoto');
    var oWebViewInterface = window.nsWebViewInterface;

    takePhotoBtn.onclick = function() {
        oWebViewInterface.emit('action', 'takePhoto');
    }

    /**
     * Registers handlers for native events.
     */
    function addNativeMsgListener() {
        oWebViewInterface.on('photo', function (photoBase64String) {
            console.log('received photo');
            let srcValue = 'data:image/jpeg;base64, ' + photoBase64String;
            document.getElementById('selfieImage').setAttribute('src', srcValue);
        });
    }

    function init() {
        addNativeMsgListener();
    }

    init();
})();