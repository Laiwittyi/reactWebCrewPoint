import dayjs from 'dayjs';
const currentMonth = dayjs().month();
const currentYear = dayjs().year();
export const shouldDisabledDate = (date) => {
    return date.month() !== currentMonth || date.year() !== currentYear;
}