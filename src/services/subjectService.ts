import { Subject } from "@/models/subject";
import { Chapter } from "@/models/chapter";

const API_BASE_URL = 'http://localhost:3100/subjects';

export const subjectService = {
  // Create
  async createSubject(subjectData: Omit<Subject, 'id'>): Promise<Subject> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subjectData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create subject');
    }
    
    return response.json();
  },

  // Read (Single)
  async getSubjectById(id: string): Promise<Subject> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch subject');
    }
    
    const data = await response.json();
    console.log('Subject fetched successfully:', data);
    return data;
  },

  // Read (All)
  async getAllSubjects(): Promise<Subject[]> {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }
    
    const data = await response.json();
    console.log('Subjects fetched successfully:', data);
    return data;
  },

  // Update
  async updateSubject(id: string, subjectData: Partial<Subject>): Promise<Subject> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subjectData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update subject');
    }
    
    const data = await response.json();
    console.log('Subject updated successfully:', data);
    return data;
  },

  // Delete
  async deleteSubject(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete subject');
    }
    
    console.log('Subject deleted successfully');
  },
  
  // Get Chapters for Subject
  async getSubjectChapters(subjectId: string): Promise<Chapter[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/${subjectId}/chapters`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subject chapters');
      }
      
      const data = await response.json();
      console.log('Subject chapters fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching subject chapters:', error);
      throw error;
    }
  }
};
