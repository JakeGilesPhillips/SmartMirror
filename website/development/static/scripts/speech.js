$(document).ready(() =>
{
    if (annyang) initialiseAnnyang();
});

var enabled = 0;
var cooldown = 0;

var voices = window.speechSynthesis.getVoices().filter(a => a.lang.includes("en"));
var speech = new SpeechSynthesisUtterance();

function initialiseAnnyang()
{
    annyang.addCommands({
        "hey mirror": () => enableAnnyang(),
        "mirror (mirror)": () => enableAnnyang(),
        "oi cunt": () => enableAnnyang(),

        "what is *question": what,
        "whats *question": what,
        "what's *question": what,

        "cancel": ok,
        "cancel that": ok,
        "ignore me": ok,
        "ignore": ok,
        "ignore that": ok,
        "ignore this": ok,
        "as you were": ok,
        "never mind": ok,
        "don't worry": ok,
        "dont worry": ok,
        
        "thanks": thanks,
        "thank you": thanks,
        "cheers": thanks,
        "merci": thanks,
        "ta": thanks,

        ":command Spotify": sendToSpotify,
        "Spotify :command": sendToSpotify,
        "Tell Spotify :command": sendToSpotify,
        "Tell Spotify to :command": sendToSpotify,
        ":command music": sendToSpotify,
        ":command song": sendToSpotify,

        ":command camera": toggleCamera,
        ":command webcam": toggleCamera,

        "(mirror mirror) who's at the door": forceWebcam,
        "(mirror mirror) show me who's at the door": forceWebcam,

        "(mirror mirror on the wall), who is the fairest of them all": 
    });
    
    annyang.start({ continuous: false });
    annyang.addCallback('result', (result) => console.log(result));

    setInterval(doCooldown, 100);
}

function enableAnnyang(override)
{
    enabled = true;
    cooldown = override | 10000;
    $("#speech-recognition #listening").addClass('show');
}

function disableAnnyang()
{
    enabled = false;
    cooldown = 0;
    $("#speech-recognition #listening").removeClass('show');
}

function doCooldown()
{
    console.log(cooldown = Math.max(0, cooldown - 100));
    if (cooldown <= 0) { disableAnnyang(); };
}

function what(question) 
{
    enableAnnyang(12000);

    if (question.includes("time")) speak(getVerbalTime());
    if (question.includes("date")) speak(getVerbalDate());
}

function getVerbalTime()
{
    const date = new Date();
    return `The time is ${date.toTimeString().slice(0, 5)} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
}

function getVerbalDate()
{
    const date = new Date();
    return `It is ${date.toLocaleDateString('en-GB', { weekday: 'long' })} ${date.toLocaleDateString()}`;
}

function ok()
{
    speak("Ok.");
    disableAnnyang();
}

function thanks()
{
    speak("You're welcome!");
    disableAnnyang();
}

function speak(msg)
{
    if (enabled)
    {
        var speech = new SpeechSynthesisUtterance(msg);
        speech.voice = window.speechSynthesis.getVoices().filter(a => a.lang.includes("en"))[12];
        window.speechSynthesis.speak(speech);
    }
}

function sendToSpotify(command)
{
    if (enabled)
    {
        updatePlaystate(command);
        disableAnnyang();
    }
}

function forceWebcam(command)
{
    enableAnnyang();
    toggleCamera("show");
}

function fairestOfThemAll()
{
    switch (Math.floor(Math.random() * 10))
    {
        case 0: return speak("Fuck off you ugly cunt.")
        case 1: return speak("You, you are. You are so fit.")
        case 2: return speak("You are the fairest of them all, daddy!")
        case 3: return speak("Definitely not you mate.")
        case 4: return speak("Ummmmmmm, not you.")
        case 5: return speak("Oh get over yourself.")
        case 6: return speak("The answer to that question is definitely Jake.")
        case 7: return speak("Your. Mum.")
        case 8: return speak("Yeah not you mate, jog on.")
        case 9: return speak("You sexy cunt you.")
    }
}

function toggleCamera(command) 
{
    if (enabled)
    {
        
        switch (command)
        {
            case "show":
            case "enable":
                {
                    $("#webcam").addClass("show");
                    setTimeout(() => toggleCamera("hide"), 20000);
                    return disableAnnyang();
                }
            case "hide":
            case "close":
            case "disable":
                {
                    $("#webcam").removeClass("show");
                    return disableAnnyang();
                }
        }
    }
}