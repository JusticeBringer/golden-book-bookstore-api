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

export const isDatePastoneDayAgo = (givenDate: Date) => {
  if (!givenDate) {
    return false;
  }

  const toDateGivenDate = new Date(givenDate);
  const dateNow = new Date(Date.now());

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Discard the time and time-zone information.
  const utc1 = Date.UTC(
    toDateGivenDate.getFullYear(),
    toDateGivenDate.getMonth(),
    toDateGivenDate.getDate()
  );
  const utc2 = Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());

  if (Math.floor((utc2 - utc1) / _MS_PER_DAY) >= 1) {
    return true;
  }
  return false;
};
