import { QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { extraReducersFetchQuiz } from "./fetchQuizThunk";
import { extraReducersLoadQuizzesAsync } from "./loadQuizzesAsyncThunk";
import { extraReducersLoadQuizzesBySubject } from "./loadQuizzesBySubjectThunk";
import { extraReducersLoadQuizzesByChapter } from "./loadQuizzesByChapterThunk";
import { extraReducersStartQuizAttempt } from "./startQuizAttemptThunk";
import { extraReducersQuizStatistics } from "./quizStatistics";
import { extraReducersSubmitQuizAttempt } from "./submitQuizThunk";
import { extraReducersCompleteQuizAttempt } from "./completeQuizThunk";
import { extraReducersGetQuizAttemptById } from "./startQuizAttemptThunk";

export const extraReducersQuiz = (builder: ActionReducerMapBuilder<QuizState>) => {
    extraReducersFetchQuiz(builder);
    extraReducersLoadQuizzesAsync(builder);
    extraReducersLoadQuizzesBySubject(builder);
    extraReducersLoadQuizzesByChapter(builder);
    extraReducersStartQuizAttempt(builder);
    extraReducersQuizStatistics(builder);
    extraReducersSubmitQuizAttempt(builder);
    extraReducersGetQuizAttemptById(builder);
    //extraReducersCompleteQuizAttempt(builder);
};

export {fetchQuizById}  from './fetchQuizThunk';
export {startQuizAttempt}  from './startQuizAttemptThunk';
export {loadQuizzesAsync}  from './loadQuizzesAsyncThunk';
export {loadQuizzesBySubject}  from './loadQuizzesBySubjectThunk';
export {loadQuizzesByChapter}  from './loadQuizzesByChapterThunk';
export {submitQuizAttempt}  from './submitQuizThunk';
export {completeQuizAttempt}  from './completeQuizThunk';
export {quizStatistics}  from './quizStatistics';
export {getQuizAttemptById}  from './startQuizAttemptThunk';

