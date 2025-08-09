import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { ChapterState } from "@/models/chapter";
import { extraReducersFetchChapter } from "./fetchChapterThunk";
import { extraReducersLoadChaptersBySubjectIdAsync } from "./loadChaptersBySubjectIdthunk";

export const extraReducersChapter = (builder: ActionReducerMapBuilder<ChapterState>) => {
    extraReducersFetchChapter(builder);
    extraReducersLoadChaptersBySubjectIdAsync(builder);
};

export {loadChaptersBySubjectIdAsync} from './loadChaptersBySubjectIdthunk';
export {fetchChapter} from './fetchChapterThunk';
