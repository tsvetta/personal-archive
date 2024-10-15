import { CustomDate, Season } from '@archive/server/src/apollo/types.js';

const parseSeason = (season?: Season) => {
  if (!season) {
    return '';
  }

  switch (season) {
    case 1:
      return 'Весна';
    case 2:
      return 'Лето';
    case 3:
      return 'Осень';
    case 4:
      return 'Зима';
  }
};

const parseMonth = (month?: number) => {
  if (!month) {
    return '';
  }

  switch (month) {
    case 1:
      return 'Январь';
    case 2:
      return 'Февраль';
    case 3:
      return 'Март';
    case 4:
      return 'Апрель';
    case 5:
      return 'Май';
    case 6:
      return 'Июнь';
    case 7:
      return 'Июль';
    case 8:
      return 'Август';
    case 9:
      return 'Сентябрь';
    case 10:
      return 'Октябрь';
    case 11:
      return 'Ноябрь';
    case 12:
      return 'Декабрь';
  }
};

const parsePostDate = (date?: Date | CustomDate) => {
  if (date === null) {
    return '';
  }

  let dateString;

  if (date instanceof Date || typeof date === 'number') {
    dateString = new Date(date).toLocaleDateString('ru-RU');
  } else if (typeof date === 'object') {
    dateString = `
        ${date?.month ? '' : parseSeason(date?.season)} 
        ${parseMonth(date?.month)} 
        ${date.year}
    `.trim();
  }

  return dateString;
};

export { parseMonth, parseSeason, parsePostDate };
