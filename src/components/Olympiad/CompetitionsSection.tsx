'use client';

import { useState, useEffect } from 'react';
import { Medal } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

interface Competition {
  id: string;
  name: string;
  date: string;
  registrationDeadline: string;
  category: string;
  level: string;
  prize: string;
  participants: number;
}

interface CompetitionsSectionProps {
  competitions: Competition[];
}

export function CompetitionsSection({ competitions }: CompetitionsSectionProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getDaysUntilExam = (examDate: string) => {
    if (!isClient) return 30; // Default for SSR
    
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const formatDate = (dateString: string) => {
    if (!isClient) return dateString; // Return raw string for SSR
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Upcoming Competitions
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <Card
            key={competition.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Medal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Badge variant="primary" size="sm">
                    {competition.level}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {competition.prize}
                </div>
                <div className="text-xs text-gray-500">Prize Pool</div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {competition.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {competition.category}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Exam Date:</span>
                <span className="font-medium">
                  {formatDate(competition.date)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Registration:</span>
                <span className="font-medium">
                  {formatDate(competition.registrationDeadline)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Participants:</span>
                <span className="font-medium">
                  {competition.participants.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Days Remaining</span>
                <span className="font-bold text-orange-600">
                  {getDaysUntilExam(competition.date)} days
                </span>
              </div>
              <ProgressBar
                progress={Math.max(
                  0,
                  100 - (getDaysUntilExam(competition.date) / 30) * 100
                )}
                color="yellow"
                size="sm"
              />
            </div>

            <Button variant="primary" className="w-full">
              Register Now
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CompetitionsSection;