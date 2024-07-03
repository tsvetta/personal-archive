import { RefObject, useEffect } from 'react';

export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  onClickOutside: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClickOutside();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref]);
};
