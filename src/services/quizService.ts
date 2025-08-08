import { Quiz, QuizType } from "@/models/api";
import { ApiResponse, PaginatedResponse } from "@/models/api";

interface GetQuizzesParams {
  subjectId?: string;
  chapterId?: string;
  type?: QuizType;
  page?: number;
  limit?: number;
}

export const quizService = {
  getQuizById: async (id: string): Promise<Quiz> => {
    try {
      const response = await fetch(`http://localhost:3100/quizzes/${id}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch quiz');
      }
      
      const apiResponse: ApiResponse<Quiz> = await response.json();
      console.log('getQuizById response:', apiResponse);
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.message || 'Failed to load quiz');
      }
      
      console.log('getQuizById response:', {
        id,
        response: apiResponse,
        hasData: !!apiResponse.data,
        quizId: apiResponse.data?.id
      });
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },

  getQuizzes: async (params: GetQuizzesParams = {}): Promise<PaginatedResponse<Quiz>> => {
    try {
      const { subjectId, chapterId, type, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams();
      
      // Build query parameters
      if (subjectId) queryParams.append('subjectId', subjectId);
      if (type) queryParams.append('type', type);
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      // Build URL
      let url = `http://localhost:3100/quizzes`;
      if (chapterId) {
        url = `http://localhost:3100/quizzes/chapter/${chapterId}`;
      } else {
        url = `${url}?${queryParams.toString()}`;
      }
      
      console.log('Fetching quizzes from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch quizzes');
      }
      
      const data: ApiResponse<PaginatedResponse<Quiz>> = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to load quizzes');
      }
      
      return data.data || { data: [], meta: { page, limit, total: 0, totalPages: 0 }, success: true };
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },

  getQuizzesBySubject: async (subjectId: string, page = 1, limit = 10): Promise<PaginatedResponse<Quiz>> => {
    return quizService.getQuizzes({ subjectId, page, limit });
  },

  getQuizzesByChapter: async (chapterId: string, page = 1, limit = 10): Promise<PaginatedResponse<Quiz>> => {
    return quizService.getQuizzes({ chapterId, page, limit });
  },

  // Kept for backward compatibility
  getAllQuizzes: async (): Promise<Quiz[]> => {
    const response = await quizService.getQuizzes({});
    return response.data || [];
  },
};
