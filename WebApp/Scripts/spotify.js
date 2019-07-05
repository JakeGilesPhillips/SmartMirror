$(document).ready(() => {
    pollSpotify();
});

var spotify = {
    refresh: 'http://92.238.31.112:50501/spotify/refresh',
    playing: 'http://92.238.31.112:50501/spotify/user/playing'
};
var currentID = null;

function pollSpotify()
{
    $.ajax({
        method: 'GET',
        url: spotify.playing, 
        success: (resp) => 
        {
            if(resp !== null && resp.is_playing)
            {
                if(resp.item.id !== currentID) {
                    updateSpotify(resp);
                }
                else {
                    updatePlaytime(resp);
                }
            }
            else {
                hideSpotify();
            }
            setTimeout(pollSpotify, 800);
        },
        error: (err) => {
            // If timeout, then try refresh the token
            refreshSpotifyLogin();
        },
        timeout: 3000
    });
}

function refreshSpotifyLogin() {
    $.ajax({
        method: 'GET',
        url: spotify.refresh, 
        success: (resp) => {
            if(resp === 'OK') {
                // If token refreshed then continue polling spotify endpoint
                pollSpotify();
            }
            else {
                // Else Refresh page to reinstate login
                window.location.href = 'http://92.238.31.112:50501/';
            }
        }
    });
}

function updateSpotify(data) {
    $("#spotify-information").addClass("show");
    $("#spotify-information #album-art").attr('src', data.item.album.images[1].url);
    $("#spotify-information #artist").html(data.item.artists[0].name);
    $("#spotify-information #track").html(data.item.name);

    updatePlaytime(data);
    currentID = data.item.id;
}

function updatePlaytime(data) {
    $("#spotify-information #progress #elapsed").html(millisToMinutesAndSeconds(data.progress_ms));
    $("#spotify-information #progress #total").html(millisToMinutesAndSeconds(data.item.duration_ms));
}

function hideSpotify() {
    $("#spotify-information").removeClass("show");
    currentID = null;
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }