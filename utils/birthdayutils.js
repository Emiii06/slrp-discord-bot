function getNextBirthday(day, month) {

    const today = new Date();

    const next = new Date(
        today.getFullYear(),
        month - 1,
        day
    );

    next.setHours(0, 0, 0, 0);

    if (next < today) {
        next.setFullYear(today.getFullYear() + 1);
    }

    return next;

}

function getDaysUntil(day, month) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const next = getNextBirthday(day, month);

    return Math.round(
        (next - today) / 86400000
    );

}

module.exports = {
    getNextBirthday,
    getDaysUntil
};