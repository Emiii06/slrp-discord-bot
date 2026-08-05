const MONTHS = {
    january: 1,
    jan: 1,

    february: 2,
    feb: 2,

    march: 3,
    mar: 3,

    april: 4,
    apr: 4,

    may: 5,

    june: 6,
    jun: 6,

    july: 7,
    jul: 7,

    august: 8,
    aug: 8,

    september: 9,
    sept: 9,
    sep: 9,

    october: 10,
    oct: 10,

    november: 11,
    nov: 11,

    december: 12,
    dec: 12
};

function validDate(day, month, year) {

    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );

}

function parseBirthday(input) {

    input = input.trim();

    // 01.10.2006
    let match = input.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);

    if (match) {

        const day = Number(match[1]);
        const month = Number(match[2]);
        const year = Number(match[3]);

        if (!validDate(day, month, year)) {
            return {
                success: false,
                error: "invalid"
            };
        }

        return {
            success: true,
            day,
            month,
            year,
            format: "EU"
        };

    }

    // 1 October 2006
    match = input.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);

    if (match) {

        const day = Number(match[1]);
        const month = MONTHS[match[2].toLowerCase()];
        const year = Number(match[3]);

        if (!month || !validDate(day, month, year)) {
            return {
                success: false,
                error: "invalid"
            };
        }

        return {
            success: true,
            day,
            month,
            year,
            format: "EU"
        };

    }

    // October 1 2006
    match = input.match(/^([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})$/);

    if (match) {

        const month = MONTHS[match[1].toLowerCase()];
        const day = Number(match[2]);
        const year = Number(match[3]);

        if (!month || !validDate(day, month, year)) {
            return {
                success: false,
                error: "invalid"
            };
        }

        return {
            success: true,
            day,
            month,
            year,
            format: "US"
        };

    }

    // 01/10/2006
    match = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (match) {

        const first = Number(match[1]);
        const second = Number(match[2]);
        const year = Number(match[3]);

        return {
            success: false,
            ambiguous: true,
            eu: {
                day: first,
                month: second,
                year,
                format: "EU"
            },
            us: {
                day: second,
                month: first,
                year,
                format: "US"
            }
        };

    }

    return {
        success: false,
        error: "unknown"
    };

}

module.exports = {
    parseBirthday
};