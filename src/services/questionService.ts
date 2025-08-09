import { QuestionResponse } from "@/models/api";

export const questionService = {
  async getQuestionById(questionId: string): Promise<QuestionResponse> {
    // Simulate network latency
    const response = await fetch(`http://localhost:3100/question/${questionId}`)
    .then(response => response.json())
    .then(data => {
      console.log('Questions fetched successfully:', data);
      return data;
    })  
    .catch(error => {
      console.error('Error fetching Questions:', error);
      throw error;
    });
    return response.data;
  },
  async getAllQuestions(subjectId: string, chapterId: string): Promise<QuestionResponse[]> {
    const response = await fetch(`http://localhost:3100/question?subjectId=${subjectId}&chapterId=${chapterId}`)
    .then(response => response.json())
    .then(data => {
      console.log('Questions fetched successfully:', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching Questions:', error);
      throw error;
    });
    return response.data;
  }
};
