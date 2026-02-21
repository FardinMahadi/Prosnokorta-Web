import { FileCheck, BarChart3, User as UserIcon } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AnalyticsSummaryProps {
    totalSubmissions: number;
    averagePercentage: number;
    activeStudents: number;
}

export function AnalyticsSummary({ totalSubmissions, averagePercentage, activeStudents }: AnalyticsSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalSubmissions}</div>
                    <p className="text-xs text-muted-foreground">Across all subjects</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averagePercentage}%</div>
                    <p className="text-xs text-muted-foreground">System-wide average</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeStudents}</div>
                    <p className="text-xs text-muted-foreground">Unique participants</p>
                </CardContent>
            </Card>
        </div>
    );
}
