import { API_CONFIG, buildApiUrl } from "@/config/api";
import { Quiz, QuizType } from "@/models/api";
import { ApiResponse, PaginatedResponse } from "@/models/api";
import { QuizAnswer, QuizAttempt, QuizUserStatistics } from "@/models/quiz";

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
      // Include query parameters to ensure we get questions with options
      const queryParams = new URLSearchParams({
        includeQuestions: 'true',
        includeOptions: 'true'
      });
      
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.QUIZZES)}/${id}?${queryParams.toString()}`;
      console.log('Fetching quiz from:', url);
      
      const response = await fetch(url, {
        // Add caching for quiz data (can be cached longer as it's less likely to change)
        next: { 
          revalidate: 300, // Cache for 5 minutes
          tags: [`quiz-${id}`] 
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Quiz not found');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch quiz (${response.status})`);
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
        quizId: apiResponse.data?.id,
        questionsCount: apiResponse.data?.questions?.length,
        firstQuestionOptions: apiResponse.data?.questions?.[0]?.options?.length
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
      let url = `${buildApiUrl(API_CONFIG.ENDPOINTS.QUIZZES)}`;
      if (chapterId) {
        url = `${buildApiUrl(API_CONFIG.ENDPOINTS.QUIZZES)}/chapter/${chapterId}`;
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
      
      return data.data || { 
        data: [], 
        meta: { page, limit, total: 0, totalPages: 0 },
        success: true
      };
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  },
  getQuizAttemptById: async (id: string): Promise<QuizAttempt> => {
    try {
      // Enhanced query parameters to include all necessary data
      const queryParams = new URLSearchParams({
        includeAnswers: 'true',
        includeQuiz: 'true',
        includeQuestions: 'true',
        includeOptions: 'true',
        includeRelations: 'true'
      });
      
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.QUIZ_ATTEMPT)}/${id}?${queryParams.toString()}`;
      console.log('Fetching quiz attempt from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add caching for server-side requests
        next: { 
          revalidate: 0, // Don't cache user-specific data
          tags: [`quiz-attempt-${id}`] 
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Quiz attempt not found');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch quiz attempt (${response.status})`);
      }
      
      const apiResponse: ApiResponse<QuizAttempt> = await response.json();
      console.log('Quiz attempt API response:', apiResponse);
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.message || 'Failed to load quiz attempt');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error fetching quiz attempt:', error);
      throw error;
    }
  },

  getQuizAttemptsByQuizId: async (quizId: string, includeQuizData = false): Promise<QuizAttempt[]> => {
    try {
      const queryParams = new URLSearchParams({
        quizId: quizId
      });
      
      if (includeQuizData) {
        queryParams.append('includeAnswers', 'true');
        queryParams.append('includeQuiz', 'true');
        queryParams.append('includeQuestions', 'true');
        queryParams.append('includeOptions', 'true');
      }
      
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.QUIZ_ATTEMPT)}?${queryParams.toString()}`;
      console.log('Fetching quiz attempts by quiz ID from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch quiz attempts');
      }
      
      const apiResponse: ApiResponse<QuizAttempt[]> = await response.json();
      console.log('Quiz attempts by quiz ID API response:', apiResponse);
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.message || 'Failed to load quiz attempts');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error fetching quiz attempts by quiz ID:', error);
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
  getQuizAttempt: async (id: string, userId: string): Promise<QuizAttempt> => {
    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.QUIZ_ATTEMPT)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: id,
          userId,
        }), 
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch quiz');
      }
      
      const apiResponse: ApiResponse<QuizAttempt> = await response.json();
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.message || 'Failed to attenpt quiz');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },
  submitQuizAttempt: async (id: string, quizAnswers: QuizAnswer[]): Promise<Quiz> => { 
    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.QUIZ_ATTEMPT)}/${id}/submit-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({answers: quizAnswers}), 
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit quiz');
      }
      
      const apiResponse: ApiResponse<Quiz> = await response.json();
      console.log('getQuizById response:', apiResponse);
      if (!apiResponse.success || !apiResponse.data) {
        console.log('getQuizById response:', apiResponse);
        throw new Error(apiResponse.message || 'Failed to attenpt quiz');
      }
      
      console.log('getQuizById response:', {
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

  quizComplete: async (id: string): Promise<Quiz> => { 
    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.QUIZ_ATTEMPT)}/${id}/auto-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to complete quiz');
      }
      
      const apiResponse: ApiResponse<Quiz> = await response.json();
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.message || 'Failed to complete quiz');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },
  quizStatistics: async (userId: string): Promise<QuizUserStatistics> => { 
    try {
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.QUIZ_ATTEMPT)}/statistics?userId=${userId}`;
      console.log('Fetching quiz statistics from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', 
        },
      });
      
      console.log('Quiz statistics response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Quiz statistics API error:', errorData);
        throw new Error(errorData.message || 'Failed to get quiz statistics');
      }
      
      const apiResponse: ApiResponse<QuizUserStatistics> = await response.json();
      console.log('Quiz statistics API response:', apiResponse);
      
      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.message || 'Failed to get quiz statistics');
      }
      
      return apiResponse.data;
    } catch (error) {
      console.error('Error fetching quiz statistics:', error);
      throw error;
    }
  },
};
