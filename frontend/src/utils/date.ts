function base10Padding(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
}

export const MONTH_NUM_TO_STR = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Avg',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
export function millisToDateString(millis: number, includeTime?: boolean) {
    const date = new Date(millis);
    return `${MONTH_NUM_TO_STR[date.getMonth()]} ${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()}${
        includeTime
            ? ` ${base10Padding(date.getHours())}:${base10Padding(
                  date.getMinutes(),
              )}`
            : ''
    }`;
}
