import { Chapter } from "@/models/chapter";

const API_BASE_URL = 'http://localhost:3100/chapters';

export const chapterService = {
  // Create
  async createChapter(chapterData: Omit<Chapter, 'id'>): Promise<Chapter> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chapterData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create chapter');
    }
    
    const data = await response.json();
    console.log('Chapter created successfully:', data);
    return data;
  },

  // Read (Single)
  async getChapterById(id: string): Promise<Chapter> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chapter');
    }
    
    const data = await response.json();
    console.log('Chapter fetched successfully:', data);
    return data;
  },

  // Read (All for Subject)
  async getChaptersBySubject(subjectId: string): Promise<Chapter[]> {
    const response = await fetch(`${API_BASE_URL}/subject/${subjectId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chapters');
    }
    
    const data = await response.json();
    console.log('Chapters fetched successfully:', data);
    return data;
  },

  // Read (All)
  async getAllChapters(): Promise<Chapter[]> {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chapters');
    }
    
    const data = await response.json();
    console.log('All chapters fetched successfully:', data);
    return data;
  },

  // Update
  async updateChapter(id: string, chapterData: Partial<Chapter>): Promise<Chapter> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chapterData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update chapter');
    }
    
    const data = await response.json();
    console.log('Chapter updated successfully:', data);
    return data;
  },

  // Delete
  async deleteChapter(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete chapter');
    }
    
    console.log('Chapter deleted successfully');
  },

  // Get Quizzes for Chapter
  async getChapterQuizzes(chapterId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/${chapterId}/quizzes`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch chapter quizzes');
    }
    
    const data = await response.json();
    console.log('Chapter quizzes fetched successfully:', data);
    return data;
  }
};
