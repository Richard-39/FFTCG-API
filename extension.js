const dateFormat = (date) => {
    var parts = new Intl.DateTimeFormat('en-GB',
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: '2-digit',
            hourCycle: "h23",
            timeZone: 'America/Santiago'
        })
        .formatToParts(date);

    var formatedDate = `${parts.find(p => p.type == "year").value}-${parts.find(p => p.type == "month").value}-${parts.find(p => p.type == "day").value} ${parts.find(p => p.type == "hour").value}:${parts.find(p => p.type == "minute").value}:${parts.find(p => p.type == "second").value}`;
    return formatedDate;
};

//Returns a number whose value is limited to the given range.
const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

const getOperator = (string) => {
    switch (string){
        case ">":
            return '>';
        case "<":
            return '<';
        case "=":
            return '=';
        case ">=":
            return '>=';
        case "<=":
            return '<=';
        default:
            return '=';
    }
};

// maybe this method is not necesary
const stringToCapitalize = (val) => {
    const string = String(val).toLowerCase();
    return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}

module.exports = { dateFormat, clamp, getOperator, stringToCapitalize }