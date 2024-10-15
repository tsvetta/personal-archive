import { CustomDate, Season } from '@archive/server/src/apollo/types.js';

export const normalizePostDate = (baseDate: Date | CustomDate) => {
  let normalizedDate;

  if (typeof baseDate === 'number' || baseDate instanceof Date) {
    normalizedDate = new Date(baseDate);
  }

  // Если дата — это объект (с годом, месяцем, сезоном)
  else if (typeof baseDate === 'object') {
    const year = baseDate.year;
    let month = 0; // по умолчанию 0
    const day = 1; // в неточной дате никогда не будет указано дня, поэтому 1

    switch (baseDate.season) {
      case Season.SPRING:
        month = 2;
        break;
      case Season.SUMMER:
        month = 5;
        break;
      case Season.AUTUMN:
        month = 8;
        break;
      case Season.WINTER:
        month = 11;
        break;
    }

    month = baseDate.month ? baseDate.month - 1 : month;
    normalizedDate = new Date(year, month, day);
  }

  return normalizedDate;
};
