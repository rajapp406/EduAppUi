import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Subject } from '../models/subject';

export const subjectApi = createApi({
  reducerPath: 'subjectApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3100',
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Add any required headers here
      headers.set('Content-Type', 'application/json');
      // If you're using authentication, you can add the token here
      // const token = getState().auth.token;
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  }),
  tagTypes: ['Subject'],
  endpoints: (builder) => ({
    getSubject: builder.query<Subject, string>({
      query: (id) => `subjects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subject', id }],
      // Transform the response to return the first item if it's an array
      transformResponse: (response: Subject | Subject[]) => {
        return Array.isArray(response) ? response[0] : response;
      },
    }),
    getSubjects: builder.query<Subject[], void>({
      query: () => 'subjects',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Subject' as const, id })),
              { type: 'Subject', id: 'LIST' },
            ]
          : [{ type: 'Subject', id: 'LIST' }],
    }),
    createSubject: builder.mutation<Subject, Omit<Subject, 'id'>>({
      query: (subject) => ({
        url: 'subjects',
        method: 'POST',
        body: subject,
      }),
      invalidatesTags: [{ type: 'Subject', id: 'LIST' }],
    }),
    updateSubject: builder.mutation<Subject, Partial<Subject> & { id: string }>({
      query: ({ id, ...updates }) => ({
        url: `subjects/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Subject', id }],
    }),
    deleteSubject: builder.mutation<void, string>({
      query: (id) => ({
        url: `subjects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Subject', id },
        { type: 'Subject', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetSubjectQuery,
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;
