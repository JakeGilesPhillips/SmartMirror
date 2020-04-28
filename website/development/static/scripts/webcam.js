var webcams =
{
    "door":
    {
        "path": "http://192.168.0.17:8085?action=stream",
        "rotation": 180
    },
    "lounge":
    {
        "path": "http://192.168.0.17:8086?action=stream",
        "rotation": 0
    }
}   

var webcamtimeout = null;
var switchtimeout = null;

function showCamera(camera)
{
    if (webcams[camera])
    {
        var delay = 0;
        if ($("#webcam").hasClass('show'))
        {
            $("#webcam").removeClass('show');
            delay = 400;
        }
        setTimeout(() =>
        {
            $("#webcam #stream").attr("src", webcams[camera].path);
            $("#webcam #stream").removeClass().addClass(`rotate-${webcams[camera].rotation}`);
            clearTimeout(switchtimeout);
            switchtimeout = setTimeout(() => $("#webcam").addClass('show'), delay);
        }, 400)
        clearTimeout(webcamtimeout);
        webcamtimeout = setTimeout(() => hideCamera(camera), 15000);
    }
}
function hideCamera(camera)
{
    if (webcams[camera])
    {
        $("#webcam").removeClass('show');
        setTimeout(() => { $("#webcam .stream").attr("src", ""); }, 400)
        setTimeout(() => hideCamera(camera), 15000);
    }
}