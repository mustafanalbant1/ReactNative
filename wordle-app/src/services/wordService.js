const API_URL = "YOUR_API_URL"; // API URL'inizi buraya ekleyin

export const fetchRandomWord = async (category = null) => {
  try {
    // API'den kelime çekme denemesi
    const response = await fetch(`${API_URL}/words/random`);
    if (response.ok) {
      const data = await response.json();
      return data.word;
    }

    // API başarısız olursa yerel verileri kullan
    throw new Error("API unavailable");
  } catch (error) {
    // Yedek olarak local words.json dosyasını kullan
    const words = require("../data/words.json").words;
    let filteredWords = words;

    // Eğer kategori seçilmişse, o kategorideki kelimeleri filtrele
    if (category) {
      filteredWords = words.filter((word) => word.category === category);
    }

    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex].word;
  }
};

// Kategorileri getir
export const getCategories = () => {
  const words = require("../data/words.json").words;
  const categories = [...new Set(words.map((word) => word.category))];
  return categories;
};

// Geçici olarak local storage yerine memory storage kullanıyoruz
let highScore = 0;

export const saveHighScore = async (score) => {
  try {
    highScore = score;
  } catch (error) {
    console.error("Error saving high score:", error);
  }
};

export const getHighScore = async () => {
  try {
    return highScore;
  } catch (error) {
    console.error("Error getting high score:", error);
    return 0;
  }
};
