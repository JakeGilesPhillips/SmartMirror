$(document).ready(() => {
    getWelcomeMessage();
});

var morningMessages = [
    'Good Morning!',
    'Good Morning Baby Cakes.',
    'Wakey Wakey Baby.'
];
var afternoonMessages = [
    'Good Afternoon Hot Stuff.',
    'Good Afternoon You Spicy Thing.'
];
var eveningMessages = [
    'Good Evening, You Look Fit Tonight!',
    'Hello There, Good Evening, Grrr.',
];

function getWelcomeMessage() {
    let hour = new Date().getHours();
    if(hour >= 0 && hour < 12) {
        newMessage(morningMessages[getRandomInt(morningMessages.length)]);
    }
    if(hour >= 12 && hour < 17) {
        newMessage(afternoonMessages[getRandomInt(morningMessages.length)]);
    }
    if(hour >= 17 && hour < 24) {
        newMessage(eveningMessages[getRandomInt(morningMessages.length)]);
    }

    setTimeout(getWelcomeMessage, 1800000)
}

function newMessage(message) {
    typer("#welcome-message #message")
        .pause(1500)
        .back('all')
        .line(message, { speed: 50 });
}

function showMessage(message) {
    typer($("#welcome-message #message")).line(message);
}

function eraseMessage() {
    typer($("#welcome-message #message")).back('all');
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }