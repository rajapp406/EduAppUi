import { Board } from "./api";
import { Subject } from "./subject";

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  subject: Subject;
  iconUrl?: string;
  content?: string;  // Add this line
}

  
  export interface ChapterState {
    availableChapters: Chapter[];
    currentChapter: Chapter | null;
    error: string | null;
    isLoading: boolean;
  }