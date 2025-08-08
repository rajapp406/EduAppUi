import { Board } from "./api";

export interface Subject {
    id: string;
    name: string;
    grade: number;
    board: Board;
    iconUrl?: string;
}

  
  export interface SubjectState {
    availableSubjects: Subject[];
    currentSubject: Subject | null;
    error: string | null;
    isLoading: boolean;
  }