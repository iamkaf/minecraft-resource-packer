import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from 'unique-names-generator';

export const generateProjectName = (): string =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: ' ',
    style: 'capital',
  });
