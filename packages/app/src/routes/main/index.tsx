import { useState } from 'react';
import { useQuery } from '@apollo/client';

import { getPosts } from '@archive/app/src/apollo/queries.js';
import {
  Filters,
  FiltersData,
} from '@archive/app/src/features/filters/index.js';
import Post, { PostData } from '@archive/app/src/components/Post/index.js';

const mapFiltersStateToQuery = (filtersState: FiltersData) => {
  const dateFilter =
    filtersState.date === 'asc' || filtersState.date === 'desc'
      ? filtersState.date
      : undefined;

  const createdAtFilter =
    filtersState.date === 'creation-date-asc' ||
    filtersState.date === 'creation-date-desc'
      ? filtersState.date.replace('creation-date-', '')
      : undefined;

  return {
    date: dateFilter,
    createdAt: createdAtFilter,
    tags: filtersState.tags.map((t) => t._id),
  };
};

const MainPage = () => {
  const initialFiltersState: FiltersData = {
    date: 'desc',
    tags: [],
  };

  const [filtersState, setFiltersState] =
    useState<FiltersData>(initialFiltersState);

  const { loading, error, data } = useQuery(getPosts, {
    variables: {
      filter: mapFiltersStateToQuery(filtersState),
    },
  });

  if (error) {
    console.error('\n Main page error:', error);
  }

  const handleFiltersChange = (name: string, value: any) => {
    setFiltersState((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Filters filters={filtersState} onChange={handleFiltersChange} />

      <article className='article'>
        {loading && 'Loading...'}
        {error && error.message}
        {data?.posts?.map((post: PostData) => {
          return <Post key={post._id} data={post} />;
        })}
      </article>
    </>
  );
};

export default MainPage;
