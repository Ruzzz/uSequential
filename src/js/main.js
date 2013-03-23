(function () {

    function setHandler(element, name, handler) {
        if (element.addEventListener)
            element.addEventListener(name, handler, false); // IE 10
        else
            element.attachEvent("on" + name, handler); // IE 9
    }

    function init() {
        var PEACE_OPTION = "bt.sequential_download",
            FILES_OPTION = "bt.sequential_files",
            chbPeace = document.getElementById("sequential-download"),
            chbFiles = document.getElementById("sequential-files");

        chbPeace.checked = btapp.settings.get(PEACE_OPTION);
        chbFiles.checked = btapp.settings.get(FILES_OPTION);

        setHandler(chbPeace, "click", function () {
            btapp.settings.set(PEACE_OPTION, chbPeace.checked);
        });
        setHandler(chbFiles, "click", function () {
            btapp.settings.set(FILES_OPTION, chbFiles.checked);
        });
    }

    if (window.addEventListener)
        window.addEventListener('DOMContentLoaded', init, false); // IE 10
    else
        window.attachEvent('onload', init); // IE 9

}());
