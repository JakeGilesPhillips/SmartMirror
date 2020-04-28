function showCamera(camera)
{
    if ($(`#${camera}`))
    {
        $(".webcam").removeClass('show');
        $(`#${camera}`).addClass("show");
        setTimeout(() => hideCamera(camera), 15000);
    }
}
function hideCamera(camera)
{
    if ($(`#${camera}`))
    {
        $(`#${camera}`).removeClass("show");
    }
}