import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Task from "./components/Task";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import InputTask from "./components/inputTask";

export default function App() {
  const [todos, setTodos] = useState([]);

  async function fetchData() {
    const response = await fetch("http://192.168.0.17:8080/todos/1");
    const data = await response.json();
    setTodos(data);
  }
  useEffect(() => {
    fetchData();
  }, []);

  function clearTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }
  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: todo.completed === 1 ? 0 : 1 }
          : todo
      )
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={todos}
            keyExtractor={(todos) => todos.id}
            renderItem={({ item }) => (
              <Task {...item} toggleTodo={toggleTodo} clearTodo={clearTodo} />
            )}
            ListHeaderComponent={() => <Text style={styles.title}>Today</Text>}
            contentContainerStyle={styles.contentContainerStyle}
          />
          <InputTask todos={todos} setTodos={setTodos} />
        </SafeAreaView>
        <StatusBar style="auto" />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E9EF",
  },
  contentContainerStyle: {
    padding: 15,
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 15,
  },
});
