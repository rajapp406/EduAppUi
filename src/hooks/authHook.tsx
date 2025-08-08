'use client'
import { RootState } from "@/store/store";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useAuthentication = () => {
    const [isClient, setIsClient] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        setIsClient(true);
        setIsCheckingAuth(false);
    }, []);

    // Handle client-side redirection
    useEffect(() => {
        if (isClient && !isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isClient, isAuthenticated, isLoading, router]);

    return {
        isAuthenticated,
        isLoading: isLoading || isCheckingAuth,
        isClient
    };
};