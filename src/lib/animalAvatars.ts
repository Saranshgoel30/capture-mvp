
const animalEmojis: Record<string, string> = {
  fox: '🦊',
  panda: '🐼',
  penguin: '🐧',
  cat: '🐱',
  dog: '🐶',
  koala: '🐨',
  lion: '🦁',
  tiger: '🐯',
  bear: '🐻',
  rabbit: '🐰',
  elephant: '🐘',
  monkey: '🐵',
  owl: '🦉',
  wolf: '🐺',
  raccoon: '🦝',
};

// List of animal names
const animalNames = Object.keys(animalEmojis);

// Function to get a deterministic animal for a user based on their user ID
export const getAnimalAvatarForUser = (userId: string): string => {
  if (!userId) return '/placeholder.svg';
  
  // Get a number from the user ID to use as a seed
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Select an animal based on the seed
  const animalIndex = seed % animalNames.length;
  const animalName = animalNames[animalIndex];
  
  // Return the emoji as a fallback
  return animalEmojis[animalName] || '👤';
};

// Get a consistent emoji for a user based on their ID
export const getAnimalEmojiForUser = (userId: string): string => {
  if (!userId) return '👤';
  
  // Get a number from the user ID to use as a seed
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Select an animal based on the seed
  const animalIndex = seed % animalNames.length;
  const animalName = animalNames[animalIndex];
  
  return animalEmojis[animalName] || '👤';
};
