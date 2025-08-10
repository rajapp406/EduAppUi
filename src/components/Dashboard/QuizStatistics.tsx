"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { quizStatistics } from "@/store/slices/quiz/thunks";
import {
  TrendingUp,
  Target,
  Clock,
  Award,
  BarChart3,
  CheckCircle,
  Activity,
} from "lucide-react";
import Card from "../ui/Card";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "orange" | "purple" | "red";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  const iconBgClasses = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    orange: "bg-orange-100",
    purple: "bg-purple-100",
    red: "bg-red-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={`p-6 border-l-4 ${colorClasses[color]} hover:shadow-lg transition-shadow duration-200`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${iconBgClasses[color]}`}>
                {icon}
              </div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            </div>

            <div className="mb-1">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
            </div>

            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}

            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp
                  className={`w-4 h-4 mr-1 ${
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs last month
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const QuizStatistics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { quizUserStatistics, isLoading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log("QuizStatistics useEffect - User:", user);
    console.log(
      "QuizStatistics useEffect - Current statistics:",
      quizUserStatistics
    );
    console.log("QuizStatistics useEffect - Loading:", isLoading);
    console.log("QuizStatistics useEffect - Error:", error);

    // Always try to fetch statistics, even with fallback user ID
    const userId = user?.id || "0016e789-b406-46a5-bf04-0cca30fea38e";
    console.log("Dispatching quiz statistics for user:", userId);
    dispatch(quizStatistics(userId) as any);
  }, [dispatch, user?.id]);

  // Add effect to log state changes
  useEffect(() => {
    console.log("Quiz statistics state changed:", {
      isLoading,
      error,
      statistics: quizUserStatistics,
    });
  }, [isLoading, error, quizUserStatistics]);

  // Helper function to format time
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  // Helper function to get performance level
  const getPerformanceLevel = (
    score: number
  ): { level: string; color: "green" | "orange" | "red" } => {
    if (score >= 80) return { level: "Excellent", color: "green" };
    if (score >= 60) return { level: "Good", color: "orange" };
    return { level: "Needs Improvement", color: "red" };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-l-4 border-red-200 bg-red-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-red-800">
              Unable to load statistics
            </h3>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => {
                console.log("Retry fetch triggered");
                dispatch(quizStatistics(user?.id) as any);
              }}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Card>
    );
  }

  const performance = getPerformanceLevel(quizUserStatistics.averageScore);

  return (
    <div className="space-y-6">
      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === "production" && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">Debug Info:</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <div>User ID: {user?.id || "Not available"}</div>
            <div>Loading: {isLoading ? "Yes" : "No"}</div>
            <div>Error: {error || "None"}</div>
            <div>Statistics: {JSON.stringify(quizUserStatistics)}</div>
            <button
              onClick={() => {
                console.log("Manual fetch triggered");
                dispatch(quizStatistics(user?.id) as any);
              }}
              className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-xs"
            >
              Fetch Statistics
            </button>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Statistics</h2>
          <p className="text-gray-600">
            Track your learning progress and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">Last updated: Just now</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Attempts"
          value={quizUserStatistics.totalAttempts}
          subtitle="Quizzes attempted"
          icon={<Target className="w-5 h-5" />}
          color="blue"
        />

        <StatCard
          title="Completed"
          value={quizUserStatistics.completedAttempts}
          subtitle={`${quizUserStatistics.completionRate.toFixed(
            1
          )}% completion rate`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />

        <StatCard
          title="Average Score"
          value={`${quizUserStatistics.averageScore.toFixed(1)}%`}
          subtitle={performance.level}
          icon={<Award className="w-5 h-5" />}
          color={performance.color}
        />

        <StatCard
          title="Avg. Time"
          value={formatTime(quizUserStatistics.averageTimeSpent)}
          subtitle="Per quiz attempt"
          icon={<Clock className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Performance Insights */}
      {quizUserStatistics.totalAttempts > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Insights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Completion Rate */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg
                  className="w-20 h-20 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-green-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${quizUserStatistics.completionRate}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {quizUserStatistics.completionRate.toFixed(0)}%
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">
                Completion Rate
              </p>
              <p className="text-xs text-gray-500">
                {quizUserStatistics.completedAttempts} of{" "}
                {quizUserStatistics.totalAttempts} completed
              </p>
            </div>

            {/* Performance Level */}
            <div className="text-center">
              <div
                className={`w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  performance.color === "green"
                    ? "bg-green-100"
                    : performance.color === "orange"
                    ? "bg-orange-100"
                    : "bg-red-100"
                }`}
              >
                <Award
                  className={`w-8 h-8 ${
                    performance.color === "green"
                      ? "text-green-600"
                      : performance.color === "orange"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {performance.level}
              </p>
              <p className="text-xs text-gray-500">
                Average: {quizUserStatistics.averageScore.toFixed(1)}%
              </p>
            </div>

            {/* Time Efficiency */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                Time Efficiency
              </p>
              <p className="text-xs text-gray-500">
                {formatTime(quizUserStatistics.averageTimeSpent)} avg
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {quizUserStatistics.totalAttempts === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Quiz Data Yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start taking quizzes to see your performance statistics here.
          </p>
          <button
            onClick={() => (window.location.href = "/quiz")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Target className="w-4 h-4 mr-2" />
            Take Your First Quiz
          </button>
        </Card>
      )}
    </div>
  );
};
