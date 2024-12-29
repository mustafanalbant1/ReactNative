import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import GameBoard from "../components/GameBoard";
import ScoreBoard from "../components/ScoreBoard";
import { checkGuess, isValidGuess } from "../utils/gameLogic";
import {
  fetchRandomWord,
  saveHighScore,
  getHighScore,
  getCategories,
} from "../services/wordService";

const Home = () => {
  const WORD_LENGTH = 5;
  const MAX_GUESSES = 7;

  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [targetWord, setTargetWord] = useState("");
  const [gameStatus, setGameStatus] = useState("playing");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories] = useState(getCategories());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [level, setLevel] = useState(1);
  const [totalLevels, setTotalLevels] = useState(10);

  // Yüksek skoru yükle
  useEffect(() => {
    const loadHighScore = async () => {
      const highScore = await getHighScore();
      setBestScore(highScore);
      setLoading(false);
    };
    loadHighScore();
  }, []);

  // Yeni kelime seç
  const getNewWord = async () => {
    try {
      const word = await fetchRandomWord(selectedCategory);
      setTargetWord(word);
    } catch (error) {
      Alert.alert("Hata", "Kelime yüklenirken bir hata oluştu!");
    }
  };

  // Oyunu sıfırla
  const resetGame = async () => {
    setCurrentGuess("");
    setGuesses([]);
    await getNewWord();
    setGameStatus("playing");
    setLevel(1);
    setScore(0);
  };

  // Sonraki seviyeye geç
  const nextLevel = async () => {
    setCurrentGuess("");
    setGuesses([]);
    await getNewWord();
    setGameStatus("playing");
    setLevel((prev) => prev + 1);
  };

  // Puan hesaplama
  const calculateScore = (guessCount) => {
    const levelBonus = level * 5;
    const guessBonus = (MAX_GUESSES - guessCount) * 10;
    return guessBonus + levelBonus;
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      Alert.alert("Hata", `Lütfen ${WORD_LENGTH} harfli bir kelime girin!`);
      setCurrentGuess("");
      setGameStatus("lost");
      return;
    }

    const newGuess = checkGuess(currentGuess.toUpperCase(), targetWord);
    setGuesses([...guesses, newGuess]);
    setCurrentGuess("");

    if (currentGuess.toUpperCase() === targetWord) {
      const newScore = calculateScore(guesses.length + 1);
      const updatedScore = score + newScore;
      setScore(updatedScore);

      if (updatedScore > bestScore) {
        setBestScore(updatedScore);
        saveHighScore(updatedScore);
      }

      if (level >= totalLevels) {
        setGameStatus("completed");
      } else {
        setGameStatus("won");
        setTimeout(nextLevel, 2000);
      }
    } else if (guesses.length + 1 >= MAX_GUESSES) {
      setGameStatus("lost");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 py-8 bg-white">
      <Text className="text-2xl font-bold text-center mb-4">
        Kelime Tahmin Oyunu
      </Text>

      <View className="mb-4 flex-row justify-between items-center">
        <Text className="text-lg font-bold text-blue-600">
          Seviye: {level}/{totalLevels}
        </Text>
        <Text className="text-lg font-bold text-green-600">Puan: {score}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 mb-2">Kategori Seç:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === null ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                selectedCategory === null ? "text-white" : "text-gray-700"
              }`}
            >
              Tümü
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={`${
                  selectedCategory === category ? "text-white" : "text-gray-700"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScoreBoard
        score={score}
        bestScore={bestScore}
        onReset={() => {
          if (gameStatus !== "playing") {
            resetGame();
          } else {
            Alert.alert(
              "Oyunu Sıfırla",
              "Mevcut oyunu sonlandırıp yeni bir oyun başlatmak istiyor musunuz?",
              [
                { text: "İptal", style: "cancel" },
                { text: "Evet", onPress: resetGame },
              ]
            );
          }
        }}
      />

      <GameBoard
        guesses={guesses}
        maxGuesses={MAX_GUESSES}
        wordLength={WORD_LENGTH}
      />

      <View className="mt-4">
        <TextInput
          value={currentGuess}
          onChangeText={(text) => setCurrentGuess(text.toUpperCase())}
          maxLength={WORD_LENGTH}
          className="w-full p-2 border rounded border-gray-300"
          editable={gameStatus === "playing"}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          onPress={handleSubmitGuess}
          disabled={gameStatus !== "playing"}
          className={`mt-2 p-2 rounded ${
            gameStatus === "playing" ? "bg-blue-500" : "bg-gray-400"
          }`}
        >
          <Text className="text-white text-center font-bold">Tahmin Et</Text>
        </TouchableOpacity>
      </View>

      {gameStatus === "won" && (
        <Text className="mt-4 text-center text-green-600 font-bold">
          Tebrikler! {guesses.length} denemede buldunuz! (+
          {calculateScore(guesses.length)} puan){"\n"}
          {level < totalLevels
            ? "Sonraki seviyeye geçiliyor..."
            : "Tüm seviyeleri tamamladınız!"}
        </Text>
      )}
      {gameStatus === "lost" && (
        <Text className="mt-4 text-center text-red-600 font-bold">
          Oyun bitti! {"\n"}
          Doğru kelime: {targetWord} {"\n"}
          Toplam Puan: {score}
        </Text>
      )}
      {gameStatus === "completed" && (
        <Text className="mt-4 text-center text-green-600 font-bold">
          Tebrikler! Tüm seviyeleri tamamladınız! {"\n"}
          Toplam Puan: {score}
        </Text>
      )}
    </View>
  );
};

export default Home;
