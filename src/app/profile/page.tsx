'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MainLayout } from '@/components/Layout/MainLayout';
import { 
  ArrowLeft, 
  Camera, 
  Edit3, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone,
  Award,
  BookOpen,
  Brain,
  Trophy,
  TrendingUp,
  Settings
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  // Mock user data - replace with actual data from your store
  const profileData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: 'January 2024',
    bio: 'Passionate learner exploring various subjects and preparing for academic excellence.',
    avatar: user?.avatar || null,
    
    // Stats
    stats: {
      totalQuizzes: 45,
      averageScore: 87,
      studyHours: 120,
      rank: 1247,
      badges: 8,
      streak: 15
    },
    
    // Recent Activity
    recentActivity: [
      { type: 'quiz', subject: 'Mathematics', score: 92, date: '2 hours ago' },
      { type: 'lesson', subject: 'Physics', progress: 75, date: '1 day ago' },
      { type: 'achievement', title: 'Quiz Master', date: '3 days ago' },
      { type: 'quiz', subject: 'Chemistry', score: 88, date: '5 days ago' }
    ],
    
    // Achievements
    achievements: [
      { id: 1, title: 'First Quiz', description: 'Completed your first quiz', icon: '🎯', earned: true },
      { id: 2, title: 'Study Streak', description: '7 days in a row', icon: '🔥', earned: true },
      { id: 3, title: 'High Scorer', description: 'Scored above 90%', icon: '⭐', earned: true },
      { id: 4, title: 'Subject Master', description: 'Completed all lessons in a subject', icon: '🏆', earned: false },
      { id: 5, title: 'Quiz Champion', description: 'Top 10% in monthly rankings', icon: '👑', earned: false },
      { id: 6, title: 'Olympiad Ready', description: 'Completed olympiad preparation', icon: '🥇', earned: false }
    ],
    
    // Subject Progress
    subjectProgress: [
      { subject: 'Mathematics', progress: 85, level: 'Advanced' },
      { subject: 'Physics', progress: 72, level: 'Intermediate' },
      { subject: 'Chemistry', progress: 68, level: 'Intermediate' },
      { subject: 'Biology', progress: 45, level: 'Beginner' }
    ]
  };

  const getUserInitials = () => {
    return profileData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="mr-4 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                <p className="text-muted-foreground">Manage your profile and view your progress</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleSettings} className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button variant="primary" onClick={handleEditProfile} className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Save' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Basic Info Card */}
              <Card className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="w-24 h-24 rounded-full border-4 border-border object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold border-4 border-border">
                        {getUserInitials()}
                      </div>
                    )}
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={profileData.name}
                      className="text-xl font-bold text-center bg-transparent border-b border-border focus:border-primary outline-none mb-2"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-foreground mb-2">{profileData.name}</h2>
                  )}
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profileData.joinDate}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    {isEditing ? (
                      <textarea
                        defaultValue={profileData.bio}
                        className="w-full p-2 text-sm bg-transparent border border-border rounded-lg focus:border-primary outline-none resize-none"
                        rows={3}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profileData.stats.totalQuizzes}</div>
                    <div className="text-xs text-muted-foreground">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{profileData.stats.averageScore}%</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{profileData.stats.studyHours}h</div>
                    <div className="text-xs text-muted-foreground">Study Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">#{profileData.stats.rank}</div>
                    <div className="text-xs text-muted-foreground">Rank</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subject Progress */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Subject Progress
                </h3>
                <div className="space-y-4">
                  {profileData.subjectProgress.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{subject.subject}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" size="sm">{subject.level}</Badge>
                          <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                        </div>
                      </div>
                      <ProgressBar progress={subject.progress} color="blue" size="sm" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {profileData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {activity.type === 'quiz' && <Brain className="w-5 h-5 text-primary" />}
                        {activity.type === 'lesson' && <BookOpen className="w-5 h-5 text-primary" />}
                        {activity.type === 'achievement' && <Award className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">
                          {activity.type === 'quiz' && `Quiz: ${activity.subject}`}
                          {activity.type === 'lesson' && `Lesson: ${activity.subject}`}
                          {activity.type === 'achievement' && `Achievement: ${activity.title}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.type === 'quiz' && `Score: ${activity.score}%`}
                          {activity.type === 'lesson' && `Progress: ${activity.progress}%`}
                          {activity.type === 'achievement' && 'New badge earned'}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.date}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Achievements */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        achievement.earned
                          ? 'border-primary/20 bg-primary/5'
                          : 'border-border bg-muted/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`text-2xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${
                            achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {achievement.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.description}
                          </div>
                        </div>
                        {achievement.earned && (
                          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}