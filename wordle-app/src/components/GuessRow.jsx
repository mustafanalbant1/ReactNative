import React from "react";
import { View } from "react-native";
import GuessBox from "./GuessBox";

const GuessRow = ({ guess, wordLength }) => {
  const boxes = [];

  for (let i = 0; i < wordLength; i++) {
    const currentGuess = guess?.[i] || { letter: "", status: "empty" };
    boxes.push(
      <GuessBox
        key={i}
        letter={currentGuess.letter}
        status={currentGuess.status}
      />
    );
  }

  return <View className="flex-row justify-center">{boxes}</View>;
};

export default GuessRow;
