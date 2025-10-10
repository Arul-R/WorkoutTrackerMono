import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkoutType } from '../types';

type WorkoutContextType = {
  workouts: WorkoutType[];
  addWorkout: (workout: Omit<WorkoutType, 'id'>) => void;
  getAllExerciseNames: () => string[];
};

const initialWorkouts: WorkoutType[] = [
  {
    id: 'day1',
    date: '9/12/2025',
    exercises: [
      {
        name: 'bench press',
        sets: [{ reps: '10', rir: '2', weight: '40' }],
      },
      {
        name: 'squat',
        sets: [{ reps: '12', rir: '2', weight: '60' }],
      },
    ],
  },
  {
    id: 'day2',
    date: '9/13/2025',
    exercises: [
      {
        name: 'bench press',
        sets: [{ reps: '10', rir: '2', weight: '42.5' }],
      },
      {
        name: 'lat pulldown',
        sets: [{ reps: '12', rir: '2', weight: '40' }],
      },
    ],
  },
  {
    id: 'day3',
    date: '9/14/2025',
    exercises: [
      {
        name: 'bench press',
        sets: [{ reps: '10', rir: '2', weight: '45' }],
      },
      {
        name: 'shoulder press',
        sets: [{ reps: '12', rir: '2', weight: '25' }],
      },
    ],
  },
  {
    id: 'day4',
    date: '9/15/2025',
    exercises: [
      {
        name: 'bench press',
        sets: [{ reps: '10', rir: '2', weight: '47.5' }],
      },
      {
        name: 'bicep curl',
        sets: [{ reps: '12', rir: '2', weight: '15' }],
      },
    ],
  },
  {
    id: 'day5',
    date: '9/16/2025',
    exercises: [
      {
        name: 'bench press',
        sets: [{ reps: '10', rir: '2', weight: '50' }],
      },
      {
        name: 'tricep pushdown',
        sets: [{ reps: '15', rir: '2', weight: '25' }],
      },
    ],
  },
  {
    id: 'day6',
    date: '9/17/2025',
    exercises: [
      {
        name: 'bench press',
        sets: [{ reps: '10', rir: '2', weight: '52.5' }],
      },
      {
        name: 'romanian deadlift',
        sets: [{ reps: '12', rir: '2', weight: '70' }],
      },
    ],
  },
  {
    id: 'day7',
    date: '9/18/2025',
    exercises: [
      {
        name: 'bench press',
        sets: [{ reps: '10', rir: '2', weight: '55' }],
      },
      {
        name: 'pull ups',
        sets: [{ reps: '8', rir: '1', weight: 'bodyweight' }],
      },
    ],
  },
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
