
// Timestamps are managed in this application as unix timestamps

function getCurrentDate(): Date {
    return new Date();
}

export function getCurrentTimestamp(): string {
    return getCurrentDate().valueOf().toString();
}

export function getTimestampForDate(date: string): string {
    return Date.parse(date).toString();
}

export function getLastMidnightTimestamp(): string {
    const currentDate = getCurrentDate();
    const dateString = currentDate.toLocaleDateString();
    return Date.parse(dateString).toString();
}

export function germanDateFormatToTimestamp(dateFormat: string): string {

    const germanDateMatch = dateFormat.match(/(\d){2}.(\d){2}.(\d){4}/);

    if (germanDateMatch !== null && germanDateMatch !== undefined) {
        const germanDateString = germanDateMatch[0];
        console.log(germanDateString);
        if (germanDateString.length === 10) {
            const day = germanDateString.substr(0, 2);
            const month = germanDateString.substr(3, 2);
            const year = germanDateString.substr(6, 4);
            console.log("Day: " + day + " Month: " + month + " Year: " + year);
            return Date.parse(month + "/" + day + "/" + year).toString();
        } 
    }

    return "undefined";
}