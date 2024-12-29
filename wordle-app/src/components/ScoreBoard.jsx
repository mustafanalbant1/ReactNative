import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const ScoreBoard = ({ score, bestScore, onReset }) => {
  return (
    <View className="mb-4 p-4 bg-gray-100 rounded-lg">
      <View className="flex-row justify-between mb-2">
        <View>
          <Text className="text-gray-600">Mevcut Puan</Text>
          <Text className="text-2xl font-bold">{score}</Text>
        </View>
        <View>
          <Text className="text-gray-600">En Yüksek Puan</Text>
          <Text className="text-2xl font-bold">{bestScore}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onReset}
        className="bg-red-500 p-2 rounded-lg mt-2"
      >
        <Text className="text-white text-center font-bold">Yeni Oyun</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScoreBoard;
