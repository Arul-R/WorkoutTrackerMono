import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkoutType } from '../types';

type WorkoutContextType = {
  workouts: WorkoutType[];
  addWorkout: (workout: Omit<WorkoutType, 'id'>) => void;
  getAllExerciseNames: () => string[];
};

const initialWorkouts: WorkoutType[] = [
  // Paste all 7 initial workouts from your Expo code here
];

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<WorkoutType[]>(initialWorkouts);

  const addWorkout = (workout: Omit<WorkoutType, 'id'>) => {
    setWorkouts(prev => [{ ...workout, id: Date.now().toString() }, ...prev]);
  };

  const getAllExerciseNames = () => {
    const names = new Set<string>();
    workouts.forEach(w => w.exercises.forEach(e => names.add(e.name.toLowerCase())));
    return Array.from(names);
  };

  return (
    <WorkoutContext.Provider value={{ workouts, addWorkout, getAllExerciseNames }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used inside WorkoutProvider');
  return context;
};
