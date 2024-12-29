import React from "react";
import { View, Text } from "react-native";

const GuessBox = ({ letter, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "correct":
        return "bg-green-500";
      case "present":
        return "bg-yellow-500";
      case "empty":
        return "bg-gray-200";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <View
      className={`w-12 h-12 items-center justify-center rounded m-1 border border-gray-300 ${getStatusColor(
        status
      )}`}
    >
      <Text className="text-white font-bold text-xl">{letter}</Text>
    </View>
  );
};

export default GuessBox;
