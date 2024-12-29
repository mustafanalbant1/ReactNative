import React from "react";
import { View, ScrollView } from "react-native";
import GuessRow from "./GuessRow";

const GameBoard = ({ guesses, maxGuesses, wordLength }) => {
  const rows = [];

  for (let i = 0; i < maxGuesses; i++) {
    rows.push(<GuessRow key={i} guess={guesses[i]} wordLength={wordLength} />);
  }

  return (
    <ScrollView className="flex-1">
      <View className="space-y-1">{rows}</View>
    </ScrollView>
  );
};

export default GameBoard;
