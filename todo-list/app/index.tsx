import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");

  const addTodo = () => {
    if (inputText.trim().length === 0) {
      Alert.alert("Hata", "Boş todo eklenemez!");
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputText("");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const renderTodo = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoTextContainer}
        onPress={() => toggleTodo(item.id)}
      >
        <Ionicons
          name={item.completed ? "checkbox" : "square-outline"}
          size={24}
          color={item.completed ? "#4CAF50" : "#666"}
        />
        <Text
          style={[styles.todoText, item.completed && styles.completedTodoText]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteTodo(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color="#FF0000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Yeni görev ekle..."
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Ionicons name="add-circle" size={44} color="#f4511e" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    padding: 5,
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  todoTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  todoText: {
    fontSize: 16,
    marginLeft: 10,
  },
  completedTodoText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  deleteButton: {
    padding: 5,
  },
});
