'use client';
import { loadSubjectsAsync } from "@/store/slices/subjectSlice";
import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { useAuthentication } from "@/hooks/authHook";
import LoginModal from "@/components/Auth/LoginModal";
import { Loader2 } from 'lucide-react';
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Subject } from "@/models/subject";
import { MainLayout } from "@/components/Layout/MainLayout";

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
        console.log('subjecttttt')
        if (isAuthenticated) {
            dispatch(loadSubjectsAsync());
        }
    }, [dispatch, isAuthenticated]);

    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginModal isOpen={true} onClose={() => {}} />;
    }

    return (
        <MainLayout>
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-6">
<Button 
          variant="outline" 
          onClick={handleBack}
          className="mr-4"
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-bold mb-4 mr-4">Subjects</h1>

            </div>
                {isLoading ? (
                <div className="flex justify-center">
                    <Loader2 className="animate-spin h-8 w-8" />
                </div>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 
                    {availableSubjects?.map((subject: Subject) => (
                        <div key={subject.id} className="border p-4 rounded-lg shadow flex basic-2">
                            <h2 className="text-xl font-semibold">{subject.name}</h2>
                            
                            <Button className="ml-auto" onClick={()=>goToQuiz(subject.id)}>Go To Quiz</Button>
                            <Button className="ml-auto" onClick={()=>goToSub(subject.id)}>Start</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </MainLayout>
    );
}
