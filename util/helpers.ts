import dotEnvConfig from '../dotenv/config';
import { MAX_TITLE_CHARACTERS } from './constants/constants.other';

const API_KEY = dotEnvConfig.API_KEY as string;

const isValidApiKey = (givenKey: string) => API_KEY === givenKey;

export const isValidApiCall = (givenUrl: string) => {
  // TODO strengthen validation

  /*
    Assume that givenUrl = 'api/catalog/books?key=cheiesigura'
    Then: keyAndApiKey = 'key=cheiesigura'
    And: onlyApiKey= 'cheiesigura'
  */

  const keyAndApiKey = givenUrl.split('?')[1];
  const onlyApiKey = keyAndApiKey.split('=')[1];

  return isValidApiKey(onlyApiKey);
};

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
