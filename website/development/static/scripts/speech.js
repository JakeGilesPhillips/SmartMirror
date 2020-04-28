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
        "jarvis": enableAnnyang,
        "hey mirror": enableAnnyang,
        "mirror mirror": enableAnnyang,
        "oi cunt": enableAnnyang,

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

        "volume :command": adjustVolume,
        "music :command": adjustVolume,
        "turn music :command": adjustVolume,
        "turn volume :command": adjustVolume,
        "turn the volume :command": adjustVolume,
        "turn the music :command": adjustVolume,
        "set (the) volume to :command": adjustVolume,
        "volume to :command": adjustVolume,

        "show camera": () => showWebcam("door"),
        "show webcam": () => showWebcam("door"),
        "show door (camera)": () => showWebcam("door"),
        "show (me) door": () => showWebcam("door"),
        "show (me the) door": () => showWebcam("door"),
        "show lounge (camera)": () => showWebcam("lounge"),
        "show (me) lounge": () => showWebcam("lounge"),
        "show (me the) lounge": () => showWebcam("lounge"),

        "(mirror mirror) who's at the door": () => showWebcam("door"),
        "(mirror mirror) who is at the door": () => showWebcam("door"),
        "(mirror mirror) show me who's at the door": () => showWebcam("door"),

        "(mirror mirror on the wall) who is the fairest of them all": fairestOfThemAll,
        "(mirror mirror on the wall) who's the fairest of them all": fairestOfThemAll
    });
    
    annyang.start({ continuous: true });
    annyang.addCallback('result', (result) => console.log(result));

    setInterval(doCooldown, 100);
}

function enableAnnyang(override)
{
    enabled = true;
    cooldown = override | 10000;
    $("#speech-recognition").addClass('show');
}

function disableAnnyang()
{
    enabled = false;
    cooldown = 0;
    $("#speech-recognition").removeClass('show');
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
        if (command == "stop") { command = "pause"; }
        updatePlaystate(command);
        disableAnnyang();
    }
}

function adjustVolume(command)
{
    // Set word to number 
    command = mapNumbers(command);

    // Force commands to be one key word
    if (["up", "higher", "loud", "louder"].includes(command)) { command = "up"; }
    if (["down", "lower", "quiet", "quieter"].includes(command)) { command = "down"; }

    // Check for key word or number 
    if (enabled && (["up", "down"].includes(command) || !isNaN(parseInt(command))))
    {
        updateVolume(command);
    }
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

function showWebcam(camera)
{
    showCamera(camera);
    return disableAnnyang();
}
function hideWebcam(camera)
{
    hideCamera(camera);
    return disableAnnyang();
}

function mapNumbers(word)
{
    switch (word)
    {
        case "ten": return "10"
        case "nine": return "9"
        case "eight": return "8"
        case "seven": return "7"
        case "six": return "6"
        case "five": return "5"
        case "four": return "4"
        case "three": return "3"
        case "two": return "2"
        case "one": return "1"
        case "zero": return "0"
    }
    return word;
}