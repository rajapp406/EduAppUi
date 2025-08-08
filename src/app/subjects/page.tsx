'use client';
import { loadSubjectsAsync } from "@/store/slices/subjectSlice";
import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { useAuthentication } from "@/hooks/authHook";
import LoginModal from "@/components/Auth/LoginModal";
import { Loader2, ArrowLeft, BookOpen } from 'lucide-react';
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Subject } from "@/models/subject";
import { MainLayout } from "@/components/Layout/MainLayout";
import { SubjectCard } from "@/components/SubjectCard/SubjectCard";

export default function Subjects() {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuthentication();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { availableSubjects, isLoading, error } = useAppSelector((state: RootState) => state.subjects);

    const goToSub = (id: string) => {
        router.push(`/subjects/${id}/chapter`);
    }
    
    const goToQuiz = (id: string) => {
        router.push(`/subjects/${id}/quizzes`);
    }
    
    const handleBack = () => {
        router.push('/dashboard');
    };

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(loadSubjectsAsync());
        }
    }, [dispatch, isAuthenticated]);

    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginModal isOpen={true} onClose={() => {}} />;
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="flex items-center mb-8">
                        <Button 
                            variant="outline" 
                            onClick={handleBack}
                            className="mr-4 flex items-center gap-2 hover:bg-gray-50"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
                                <p className="text-gray-600">Choose a subject to start learning</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
                                <p className="text-gray-600">Loading subjects...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                                <div className="text-red-600 mb-2">
                                    <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Subjects</h3>
                                <p className="text-red-600">{error}</p>
                            </div>
                        </div>
                    ) : availableSubjects && availableSubjects.length > 0 ? (
                        <>
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    {availableSubjects.length} subject{availableSubjects.length !== 1 ? 's' : ''} available
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {availableSubjects.map((subject: Subject) => (
                                    <SubjectCard
                                        key={subject.id}
                                        subject={subject}
                                        onStart={goToSub}
                                        onQuiz={goToQuiz}
                                        showProgress={false}
                                        progress={0}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                                <div className="text-gray-400 mb-4">
                                    <BookOpen className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Subjects Available</h3>
                                <p className="text-gray-600">There are no subjects available at the moment. Please check back later.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
