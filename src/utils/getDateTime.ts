
export function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`
    return currentTime;
}

export function getCurrentDate() {
    const date = new Intl.DateTimeFormat('en-US').format(new Date());
    return date;
}