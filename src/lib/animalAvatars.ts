
// Collection of animated animal avatars
const animalAvatars = [
  "/animals/fox.gif",
  "/animals/panda.gif",
  "/animals/penguin.gif",
  "/animals/cat.gif",
  "/animals/dog.gif",
  "/animals/koala.gif",
  "/animals/lion.gif",
  "/animals/tiger.gif",
  "/animals/bear.gif",
  "/animals/rabbit.gif",
  "/animals/elephant.gif",
  "/animals/monkey.gif",
  "/animals/owl.gif",
  "/animals/wolf.gif",
  "/animals/raccoon.gif",
];

// Get a random animal avatar
export const getRandomAnimalAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * animalAvatars.length);
  return animalAvatars[randomIndex];
};

// Get a consistent animal avatar based on user ID
export const getAnimalAvatarForUser = (userId: string): string => {
  // Use the userId to deterministically select an animal
  const charSum = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const index = charSum % animalAvatars.length;
  return animalAvatars[index];
};
