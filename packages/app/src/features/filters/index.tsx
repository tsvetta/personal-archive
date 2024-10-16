import { ChangeEventHandler, useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import { getTags } from '@archive/app/src/apollo/queries.js';
import Select, {
  SelectOption,
} from '@archive/app/src/components/Select/index.js';
import InputTagsSuggest from '@archive/app/src/components/InputTagsSuggest/index.js';
import { TagData } from '@archive/app/src/components/Tags/index.js';

import styles from './index.module.css';

const dateFilterOptions: SelectOption[] = [
  {
    value: 'desc',
    name: 'Сначала новые',
  },
  {
    value: 'asc',
    name: 'Сначала старые',
  },
  {
    value: 'creation-date-desc',
    name: 'По дате создания: сначала новые',
  },
  {
    value: 'creation-date-asc',
    name: 'По дате создания: сначала старые',
  },
];

export type FiltersData = {
  date: 'asc' | 'desc' | 'creation-date-desc' | 'creation-date-asc';
  tags: TagData[] | [];
};

type FiltersProps = {
  filters: FiltersData;
  onChange: (name: string, value: any) => void;
};

export const Filters = (props: FiltersProps) => {
  const [loadTagsData, { data: tagsData }] = useLazyQuery(getTags);

  useEffect(() => {
    loadTagsData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { tags } = props.filters;
  const { onChange } = props;

  const handleTagsChange = useCallback(
    (clickedTag: TagData) => {
      const isNewTag = tags.find((t) => t._id === clickedTag._id) === undefined;

      const updatedTags = isNewTag
        ? [...tags, clickedTag]
        : tags.filter((t) => t._id !== clickedTag._id);

      onChange('tags', updatedTags);
    },
    [tags, onChange]
  );

  const handleDateSelectChange: ChangeEventHandler = useCallback(
    (e: any) => {
      onChange('date', e.target.value);
    },
    [onChange]
  );

  return (
    <form id='main-filters' className={styles.filtersWrapper}>
      <div className={styles.filterBox}>
        <label htmlFor='filter-date'>Дата:</label>
        <Select
          name='filter-date'
          options={dateFilterOptions}
          value={props.filters.date}
          className={styles.filterSelect}
          onChange={handleDateSelectChange}
          testId='filters-date'
        />
      </div>
      <div className={styles.filterBox}>
        <label htmlFor='filter-tag'>Теги:</label>
        <InputTagsSuggest
          name='filter-tags'
          placeholder='Введите тег'
          data={tagsData?.tags || []}
          value={props.filters.tags}
          onChange={handleTagsChange}
        />
      </div>
    </form>
  );
};

Filters.defaultProps = {
  filters: {
    date: 'desc',
    tags: [],
  },
};
