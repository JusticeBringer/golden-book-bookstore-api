import { MAX_TITLE_CHARACTERS } from './constants/constants.other';

// Trim the title of an article when it's too long
export const trimTitle = (title: string): string => {
  let newTitle = '';

  for (let i = 0; i < title.length && i < MAX_TITLE_CHARACTERS; i++) {
    newTitle += title[i];
  }

  if (title.length > MAX_TITLE_CHARACTERS) {
    newTitle += '...';
  }

  return newTitle;
};

const OneDay = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;

export const isDatePastoneDayAgo = (givenDate: number) => {
  if (Date.now() - givenDate > OneDay) {
    return true;
  }
  return false;
};
