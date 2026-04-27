export const PRESETS = [
  ['🦁', 'Lion'],
  ['🐉', 'Dragon'],
  ['🧚', 'Fairy'],
  ['🤖', 'Robot'],
  ['🧙', 'Wizard'],
  ['🐸', 'Frog'],
  ['🦄', 'Unicorn'],
  ['🐧', 'Penguin'],
  ['🦊', 'Fox'],
  ['🐨', 'Koala'],
  ['🦋', 'Butterfly'],
  ['🐬', 'Dolphin'],
];

export const EXAMPLE_CHARACTERS = [
  'Mickey Mouse',
  'Peppa Pig',
  'Sonic',
  'SpongeBob',
  'Moana',
  'Elsa',
  'Batman',
  'Pikachu',
];

export const THEMES = [
  { em: '🗺️', name: 'Adventure', desc: 'Bold quests and discoveries' },
  { em: '🔭', name: 'Exploration', desc: 'Journeys into new worlds' },
  { em: '💡', name: 'Problem-solving', desc: 'Clever solutions and ideas' },
  { em: '🤝', name: 'Friendship', desc: 'Making friends, belonging' },
  { em: '🦸', name: 'Courage', desc: 'Facing fears, doing right' },
  { em: '🌿', name: 'Wonder', desc: 'Marvelling at nature and science' },
  { em: '🔮', name: 'Mystery', desc: 'Puzzles and secrets' },
  { em: '💌', name: 'Kindness', desc: 'Small acts, big impact' },
];

export const AGES = ['3–5', '6–8', '9–12'];

export const LENGTHS = {
  short: { label: 'Short', desc: '~300 words', words: 300 },
  medium: { label: 'Medium', desc: '~600 words', words: 600 },
  long: { label: 'Long', desc: '~900 words', words: 900 },
};

export const THEME_DECOS = {
  Adventure: '🗺️',
  Exploration: '🔭',
  'Problem-solving': '💡',
  Friendship: '🤝',
  Courage: '🦸',
  Wonder: '🌿',
  Mystery: '🔮',
  Kindness: '💌',
};

export const DEFAULT_STATE = {
  charMode: 'preset',
  presetType: '',
  presetEmoji: '',
  customChar: '',
  theme: '',
  ageGroup: '6–8',
  length: 'medium',
  storyMode: 'read',
  nightMode: false,
  isPreReaderMode: false,
};
