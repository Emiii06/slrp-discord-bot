const messages = [
    "We hope you have an amazing day! 🎂",
    "The entire SLRP team wishes you a fantastic birthday! 🎉",
    "Have an awesome birthday filled with happiness and great memories! 🎈",
    "Enjoy your special day and celebrate it to the fullest! 🎂",
    "Another year older, another year wiser. Happy Birthday! 🎉",
    "Wishing you lots of happiness, success, and an unforgettable birthday! ❤️",
    "Have a wonderful day surrounded by friends, fun, and cake! 🍰",
    "May your birthday be as amazing as you are. Enjoy every moment! 🎂"
];

function getRandomBirthdayMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = {
    getRandomBirthdayMessage
};