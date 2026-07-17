
// January 01, 2026 17:05
const ConvertTimestampToDateTime = (timestamp: string) => {
    const dateObject = new Date(timestamp);

    const convertedDateTime = new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(dateObject);

    return convertedDateTime;
}

export default ConvertTimestampToDateTime;