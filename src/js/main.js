(function ()
{
    function init()
    {
        var PEACE_OPTION = "bt.sequential_download";
        var FILES_OPTION = "bt.sequential_files";

        var chbPeace = document.getElementById("sequential-download");
        var chbFiles = document.getElementById("sequential-files");

        // update ui
        chbPeace.checked = btapp.settings.get(PEACE_OPTION);
        chbFiles.checked = btapp.settings.get(FILES_OPTION);

        function setHandler(element, name, handler)
        {
            if (element.addEventListener)
                element.addEventListener(name, handler, false);
            else
                element.attachEvent(name, handler);
        }

        setHandler(chbPeace, "onclick", function ()
        {
            btapp.settings.set(PEACE_OPTION, chbPeace.checked);
        });

        setHandler(chbFiles, "onclick", function ()
        {
            btapp.settings.set(FILES_OPTION, chbFiles.checked);
        });
    }

    if (window.addEventListener)
        window.addEventListener('DOMContentLoaded', init, false);
    else
        window.attachEvent('onload', init);
} ());