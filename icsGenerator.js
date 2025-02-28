class ICSGenerator {
    constructor(courses, semesterEndDate) {
        this.courses = courses;
        this.semesterEndDate = new Date(semesterEndDate);
        this.dayMap = {
            'E Hënë': 'MO',
            'E Martë': 'TU',
            'E Mërkurë': 'WE',
            'E Enjte': 'TH',
            'E Premte': 'FR',
            'E Shtunë': 'SA',
            'E Diel': 'SU'
        };
        this.dayNumbers = {
            'E Hënë': 1,
            'E Martë': 2,
            'E Mërkurë': 3,
            'E Enjte': 4,
            'E Premte': 5,
            'E Shtunë': 6,
            'E Diel': 0
        };
    }

    // Format date to iCalendar format (YYYYMMDDTHHmmssZ)
    formatDate(date) {
        const pad = (num) => (num < 10 ? '0' : '') + num;
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        
        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    }

    // Get the first occurrence of a weekday from today
    getFirstOccurrence(dayName) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part
        
        const targetDay = this.dayNumbers[dayName];
        const currentDay = today.getDay();
        
        let daysUntilFirst = targetDay - currentDay;
        if (daysUntilFirst <= 0) {
            daysUntilFirst += 7;
        }

        const firstDate = new Date(today);
        firstDate.setDate(today.getDate() + daysUntilFirst);
        return firstDate;
    }

    // Clean text for iCalendar format
    cleanText(text) {
        return text.replace(/[,;\\]/g, (match) => '\\' + match)
                  .replace(/\n/g, '\\n');
    }

    // Generate a single event string in ICS format
    generateEventString(course, startDate) {
        // Create event start time
        const eventStart = new Date(startDate);
        const [startHours, startMinutes] = course.startTime.split(':');
        eventStart.setHours(parseInt(startHours), parseInt(startMinutes), 0);

        // Create event end time
        const eventEnd = new Date(startDate);
        const [endHours, endMinutes] = course.endTime.split(':');
        eventEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0);

        // Format the until date (end of semester)
        const untilDate = new Date(this.semesterEndDate);
        untilDate.setHours(23, 59, 59);

        // Clean up text fields
        const summary = this.cleanText(course.courseName);
        const location = this.cleanText(course.room);
        const description = course.professor ? this.cleanText(`Profesor: ${course.professor}`) : '';

        // Generate unique identifier
        const uid = crypto.randomUUID();
        const now = this.formatDate(new Date());

        // Build the event string with proper line folding
        return [
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${now}`,
            `DTSTART;TZID=Europe/Tirane:${this.formatDate(eventStart)}`,
            `DTEND;TZID=Europe/Tirane:${this.formatDate(eventEnd)}`,
            `RRULE:FREQ=WEEKLY;UNTIL=${this.formatDate(untilDate)};BYDAY=${this.dayMap[course.day]}`,
            `SUMMARY:${summary}`,
            `LOCATION:${location}`,
            description ? `DESCRIPTION:${description}` : '',
            'END:VEVENT'
        ].filter(Boolean).join('\r\n');
    }

    // Generate the complete ICS file content
    generateICS() {
        const events = this.courses.map(course => {
            const firstOccurrence = this.getFirstOccurrence(course.day);
            return this.generateEventString(course, firstOccurrence);
        }).join('\r\n');

        return [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Calendar Events//AL',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VTIMEZONE',
            'TZID:Europe/Tirane',
            'BEGIN:STANDARD',
            'DTSTART:19701025T020000',
            'RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10',
            'TZOFFSETFROM:+0200',
            'TZOFFSETTO:+0100',
            'END:STANDARD',
            'BEGIN:DAYLIGHT',
            'DTSTART:19700329T020000',
            'RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3',
            'TZOFFSETFROM:+0100',
            'TZOFFSETTO:+0200',
            'END:DAYLIGHT',
            'END:VTIMEZONE',
            events,
            'END:VCALENDAR'
        ].join('\r\n');
    }

    // Download the ICS file
    downloadICS(filename = 'schedule.ics') {
        const icsContent = this.generateICS();
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default ICSGenerator; 