export const checkGuess = (guess, targetWord) => {
  const result = [];
  const targetLetters = targetWord.split("");
  const guessLetters = guess.split("");

  // İlk geçişte doğru pozisyondaki harfleri işaretle
  guessLetters.forEach((letter, index) => {
    if (letter === targetLetters[index]) {
      result[index] = { letter, status: "correct" };
      targetLetters[index] = null;
    }
  });

  // İkinci geçişte yanlış pozisyondaki harfleri işaretle
  guessLetters.forEach((letter, index) => {
    if (!result[index]) {
      const targetIndex = targetLetters.indexOf(letter);
      if (targetIndex !== -1) {
        result[index] = { letter, status: "present" };
        targetLetters[targetIndex] = null;
      } else {
        result[index] = { letter, status: "absent" };
      }
    }
  });

  return result;
};

export const isValidGuess = (guess, wordLength) => {
  return guess.length === wordLength;
};
