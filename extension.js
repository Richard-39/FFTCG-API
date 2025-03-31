const dateFormat = (date)=>
{
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

    var formatedDate = `${parts.find(p=> p.type == "year").value}-${parts.find(p=> p.type == "month").value}-${parts.find(p=> p.type == "day").value} ${parts.find(p=> p.type == "hour").value}:${parts.find(p=> p.type == "minute").value}:${parts.find(p=> p.type == "second").value}`;
    return formatedDate;
};

module.exports = { dateFormat }