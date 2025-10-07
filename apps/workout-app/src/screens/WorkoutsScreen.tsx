import React, { useState } from "react";
import {
  View,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  Text,
} from "react-native";
import {
  FAB,
  Button,
  Surface,
  Title,
  Card,
  IconButton,
  TextInput,
} from "react-native-paper";
import { useWorkout } from "../context/WorkoutContext";
import AutoCompleteInput from "../components/AutoCompleteInput";
import  theme  from "../theme";

type SetType = {
  reps: string;
  weight: string;
  rir: string;
};

type ExerciseType = {
  name: string;
  sets: SetType[];
};

const WorkoutsScreen = () => {
  const { workouts, addWorkout, getAllExerciseNames } = useWorkout();
  const [modalVisible, setModalVisible] = useState(false);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);

  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      { name: "", sets: [{ reps: "", rir: "", weight: "" }] },
    ]);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ reps: "", rir: "", weight: "" });
    setExercises(newExercises);
  };

  const handleChangeExerciseName = (index: number, text: string) => {
    const newExercises = [...exercises];
    newExercises[index].name = text;
    setExercises(newExercises);
  };

  const handleChangeSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof SetType,
    value: string
  ) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleSaveWorkout = () => {
    const cleanedExercises = exercises
      .map((exercise) => ({
        ...exercise,
        sets: exercise.sets.filter((set) => set.reps && set.weight),
      }))
      .filter((exercise) => exercise.name && exercise.sets.length > 0);

    if (cleanedExercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise with valid sets");
      return;
    }

    const newWorkout = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      exercises: cleanedExercises,
    };

    addWorkout(newWorkout);
    setExercises([]);
    setModalVisible(false);
    Alert.alert("Success", "Workout saved successfully!");
  };

  const renderWorkoutCard = ({ item }: { item: any }) => (
    <Card style={{ margin: 8, marginBottom: 12 }}>
      <Card.Title
        title={item.date}
        titleStyle={{ fontSize: 18, fontWeight: "bold" }}
        left={(props) => <IconButton {...props} icon="dumbbell" />}
      />
      <Card.Content>
        {item.exercises.map((exercise: ExerciseType, i: number) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
              {exercise.name}
            </Text>
            {exercise.sets.map((set, j) => (
              <Text
                key={j}
                style={{ fontSize: 14, marginLeft: 16, color: "#666" }}
              >
                Set {j + 1}: {set.reps} reps @ {set.weight}kg
                {set.rir ? ` (RIR ${set.rir})` : ""}
              </Text>
            ))}
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutCard}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }}
        showsVerticalScrollIndicator={true}
      />

      <FAB
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          {/* Header */}
          <Surface
            style={{
              padding: 16,
              paddingTop: 50,
              elevation: 4,
              backgroundColor: theme.colors.surface,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Title style={{ fontSize: 24, fontWeight: "700" }}>Add Workout</Title>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </Surface>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
            {exercises.map((exercise, exerciseIndex) => (
              <Surface
                key={exerciseIndex}
                style={{ padding: 16, marginBottom: 16, borderRadius: 8, elevation: 2 }}
              >
                <AutoCompleteInput
                  placeholder="Exercise name"
                  value={exercise.name}
                  onChangeText={(text) => handleChangeExerciseName(exerciseIndex, text)}
                  suggestions={getAllExerciseNames()}
                  style={{ position: "relative", zIndex: 1000, marginBottom: 16 }}
                />

                {exercise.sets.map((set, setIndex) => (
                  <View
                    key={setIndex}
                    style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}
                  >
                    <TextInput
                      mode="outlined"
                      label="Reps"
                      value={set.reps}
                      keyboardType="numeric"
                      onChangeText={(text) => handleChangeSet(exerciseIndex, setIndex, "reps", text)}
                      style={{ flex: 1, marginRight: 8 }}
                      dense
                    />
                    <TextInput
                      mode="outlined"
                      label="Weight (kg)"
                      value={set.weight}
                      keyboardType="numeric"
                      onChangeText={(text) => handleChangeSet(exerciseIndex, setIndex, "weight", text)}
                      style={{ flex: 1, marginRight: 8 }}
                      dense
                    />
                    <TextInput
                      mode="outlined"
                      label="RIR"
                      value={set.rir}
                      keyboardType="numeric"
                      onChangeText={(text) => handleChangeSet(exerciseIndex, setIndex, "rir", text)}
                      style={{ flex: 1 }}
                      dense
                    />
                  </View>
                ))}
                <Button
                  mode="outlined"
                  onPress={() => handleAddSet(exerciseIndex)}
                  style={{ marginTop: 8 }}
                  icon="plus"
                >
                  Add Set
                </Button>
              </Surface>
            ))}

            <View style={{ marginTop: 20 }}>
              <Button mode="outlined" onPress={handleAddExercise} icon="plus" style={{ marginBottom: 12 }}>
                Add Exercise
              </Button>
              <Button mode="contained" onPress={handleSaveWorkout} icon="content-save" style={{ marginBottom: 12 }}>
                Save Workout
              </Button>
              <Button
                mode="text"
                onPress={() => {
                  setExercises([]);
                  setModalVisible(false);
                }}
                textColor={theme.colors.error}
              >
                Cancel
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default WorkoutsScreen;
