import { Privacy } from '@archive/server/src/apollo/types.js';
import { SelectOption } from '../../components/Select/index.js';

export const accessOptions: SelectOption[] = [
  '',
  {
    value: 0,
    name: Privacy.ALL,
  },
  {
    value: 1,
    name: Privacy.FAMILY,
  },
  {
    value: 2,
    name: Privacy.FRIENDS,
  },
  {
    value: 3,
    name: Privacy.CLOSE_FRIENDS,
  },
  {
    value: 4,
    name: Privacy.TSVETTA,
  },
];

export const monthsOptions: SelectOption[] = [
  'Месяц',
  {
    value: 1,
    name: 'Январь',
  },
  {
    value: 2,
    name: 'Февраль',
  },
  {
    value: 3,
    name: 'Март',
  },
  {
    value: 4,
    name: 'Апрель',
  },
  {
    value: 5,
    name: 'Май',
  },
  {
    value: 6,
    name: 'Июнь',
  },
  {
    value: 7,
    name: 'Июль',
  },
  {
    value: 8,
    name: 'Август',
  },
  {
    value: 9,
    name: 'Сентябрь',
  },
  {
    value: 10,
    name: 'Октябрь',
  },
  {
    value: 11,
    name: 'Ноябрь',
  },
  {
    value: 12,
    name: 'Декабрь',
  },
];

export const seasonsOptions: SelectOption[] = [
  'Сезон',
  {
    value: 1,
    name: 'Весна',
  },
  {
    value: 2,
    name: 'Лето',
  },
  {
    value: 3,
    name: 'Осень',
  },
  {
    value: 4,
    name: 'Зима',
  },
];
