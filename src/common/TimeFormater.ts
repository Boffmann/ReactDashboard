
// Timestamps are managed in this application as unix timestamps

function getCurrentDate(): Date {
    return new Date();
}

export function getCurrentTimestamp(): number {
    return getCurrentDate().valueOf();
}

export function getTimestampForDate(date: string): number {
    return Date.parse(date);
}

export function getLastMidnightTimestamp(): number {
    const currentDate = getCurrentDate();
    const dateString = currentDate.toLocaleDateString();
    return Date.parse(dateString);
}

export function getMidnightTimestampForXDaysBack(days: number): number {
    var date = new Date();
    var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    return getTimestampForDate(last.toLocaleDateString())
}

export function timestampToDate(timestamp: number): Date {
    return new Date(timestamp);
}

export function germanDateFormatToTimestamp(dateFormat: string): number | null {

    const germanDateMatch = dateFormat.match(/(\d){2}.(\d){2}.(\d){4}/);

    if (germanDateMatch !== null && germanDateMatch !== undefined) {
        const germanDateString = germanDateMatch[0];
        console.log(germanDateString);
        if (germanDateString.length === 10) {
            const day = germanDateString.substr(0, 2);
            const month = germanDateString.substr(3, 2);
            const year = germanDateString.substr(6, 4);
            return Date.parse(month + "/" + day + "/" + year);
        } 
    }

    return null;
}