export function generateDates() {
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0')
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')

        return `${year}-${month}-${day}`
    }
    const millisecondsPerDay = 86400000

    let currentDate = Date.now() // in ms
    const dates = [new Date(currentDate)]

    for (let i = 1; i <= 6; i++) {
        currentDate = currentDate - millisecondsPerDay
        dates.push(new Date(currentDate))
    }

    const datesFormatted = dates.reverse().map((date) => String(date))
    const fromDate = formatDate(dates[0])
    const toDate = formatDate(dates[dates.length - 1])

    // console.log(dates.reverse().map(date => String(date)))

    return { dates: datesFormatted, fromDate, toDate }
}
