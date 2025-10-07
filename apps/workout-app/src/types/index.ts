export type SetType = {
  reps: string;
  rir?: string;
  weight: string;
};

export type ExerciseType = {
  name: string;
  sets: SetType[];
};

export type WorkoutType = {
  id: string;
  date: string;
  exercises: ExerciseType[];
};
