function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit', // Use '2-digit' to ensure leading zeros
    };

    const formattedDay = day + getOrdinalSuffix(day);
    return date.toLocaleDateString('en-US', options).replace(/\d+/, formattedDay); // Replace the day part with formatted day
}
