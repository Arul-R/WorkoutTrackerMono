import React, { useState } from "react";
import { Alert, ScrollView, View, Dimensions, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Surface, Title } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import AutoCompleteInput from "../components/AutoCompleteInput";
import { useWorkout } from "../context/WorkoutContext";
import  theme  from "../theme"; // Make sure you export theme from your theme file

type ExerciseDataType = {
  date: string;
  weight: number;
  dateObj: Date;
};

const AnalyticsScreen = () => {
  const { workouts, getAllExerciseNames } = useWorkout();
  const [exerciseName, setExerciseName] = useState("");
  const [startDate, setStartDate] = useState(new Date("2025-09-01"));
  const [endDate, setEndDate] = useState(new Date("2025-09-30"));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [progressionData, setProgressionData] = useState<ExerciseDataType[]>([]);

  const parseDate = (dateStr: string) => {
    const [month, day, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateForChart = (dateStr: string) => {
    const [month, day] = dateStr.split("/");
    return `${month}/${day}`;
  };

  const generateChart = () => {
    if (!exerciseName.trim()) {
      Alert.alert("Error", "Please enter an exercise name");
      return;
    }

    const filteredWorkouts = workouts.filter((workout) => {
      const workoutDate = parseDate(workout.date);
      return workoutDate >= startDate && workoutDate <= endDate;
    });

    const exerciseData: ExerciseDataType[] = [];

    filteredWorkouts.forEach((workout) => {
      const matchingExercises = workout.exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(exerciseName.toLowerCase())
      );

      matchingExercises.forEach((exercise) => {
        const weights = exercise.sets
          .map((set) => parseFloat(set.weight))
          .filter((weight) => !isNaN(weight));

        if (weights.length > 0) {
          const maxWeight = Math.max(...weights);
          exerciseData.push({
            date: workout.date,
            weight: maxWeight,
            dateObj: parseDate(workout.date),
          });
        }
      });
    });

    exerciseData.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    if (exerciseData.length === 0) {
      Alert.alert("No Data", "No data found for the selected exercise and date range");
      setChartData(null);
      setProgressionData([]);
      return;
    }

    const labels = exerciseData.map((item) => formatDateForChart(item.date));
    const weights = exerciseData.map((item) => item.weight);

    setProgressionData(exerciseData);
    setChartData({
      labels: labels,
      datasets: [
        {
          data: weights,
          color: (opacity = 1) => `rgba(81, 149, 72, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    });
  };

  const onStartDateChange = (_event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (_event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
      keyboardShouldPersistTaps="handled"
    >
      <Title style={{ fontSize: 24, marginBottom: 24, textAlign: "center", fontWeight: "700" }}>
        Exercise Progress Analytics
      </Title>

      {/* Exercise Name Input */}
      <Surface style={{ padding: 16, marginBottom: 16, borderRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>Exercise Name:</Text>
        <AutoCompleteInput
          placeholder="Enter exercise name (e.g., bench press)"
          value={exerciseName}
          onChangeText={setExerciseName}
          suggestions={getAllExerciseNames()}
          style={{ position: "relative", zIndex: 1000 }}
        />
      </Surface>

      {/* Date Range Selection */}
      <Surface style={{ padding: 16, marginBottom: 16, borderRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>Date Range:</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ marginBottom: 8, fontWeight: "500" }}>From:</Text>
            <Button mode="outlined" onPress={() => setShowStartPicker(true)} icon="calendar">
              {startDate.toLocaleDateString()}
            </Button>
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={{ marginBottom: 8, fontWeight: "500" }}>To:</Text>
            <Button mode="outlined" onPress={() => setShowEndPicker(true)} icon="calendar">
              {endDate.toLocaleDateString()}
            </Button>
          </View>
        </View>
      </Surface>

      {showStartPicker && <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />}
      {showEndPicker && <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} />}

      <Button mode="contained" onPress={generateChart} style={{ marginVertical: 16 }} icon="chart-line">
        Generate Progress Chart
      </Button>

      {/* Chart */}
      {chartData && (
        <Surface style={{ padding: 16, marginBottom: 16, borderRadius: 8, elevation: 2, alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>Weight Progress Over Time</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 64}
            height={250}
            yAxisSuffix=" kg"
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#f8f9fa",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(81, 149, 72, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "6", strokeWidth: "2", stroke: "#519548" },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </Surface>
      )}

      {/* Progress Summary */}
      {progressionData.length > 0 && (
        <Surface style={{ padding: 16, marginBottom: 16, borderRadius: 8, elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>Progress Summary</Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Exercise: <Text style={{ fontWeight: "600" }}>{exerciseName}</Text></Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Workouts found: <Text style={{ fontWeight: "600" }}>{progressionData.length}</Text></Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Starting weight: <Text style={{ fontWeight: "600" }}>{progressionData[0].weight} kg</Text></Text>
          <Text style={{ fontSize: 16, marginBottom: 4 }}>Latest weight: <Text style={{ fontWeight: "600" }}>{progressionData[progressionData.length - 1].weight} kg</Text></Text>
          <Text style={{ fontSize: 16 }}>Total progress: <Text style={{ fontWeight: "600", color: theme.colors.primary }}>
            {(progressionData[progressionData.length - 1].weight - progressionData[0].weight).toFixed(1)} kg
          </Text></Text>
        </Surface>
      )}

      {exerciseName && chartData === null && (
        <Surface style={{ padding: 20, borderRadius: 8, alignItems: "center", elevation: 1 }}>
          <Text style={{ fontSize: 16, color: "#666", textAlign: "center" }}>
            No data found for "{exerciseName}" in the selected date range.
          </Text>
        </Surface>
      )}
    </ScrollView>
  );
};

export default AnalyticsScreen;
