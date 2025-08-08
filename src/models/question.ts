import { AnswerOption, QuestionResponse } from "./api";

export interface Question extends QuestionResponse {
      options: AnswerOption[];
}
    
export interface QuestionState {
    availableQuestions: Question[];
    currentQuestion: Question | null;
    error: string | null;
    isLoading: boolean;
}