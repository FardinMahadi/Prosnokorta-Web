import type { Result } from '@/types';

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ResultsTableProps {
    results: Result[];
}

export function ResultsTable({ results }: ResultsTableProps) {
    if (results.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-12 text-center text-muted-foreground">
                    No results found matching your search.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="border rounded-lg bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Quiz Title</TableHead>
                        <TableHead className="text-center">Score</TableHead>
                        <TableHead className="text-center">Percentage</TableHead>
                        <TableHead className="text-right">Submitted At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map((result) => (
                        <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.studentName}</TableCell>
                            <TableCell>{result.quizTitle}</TableCell>
                            <TableCell className="text-center">
                                {result.score} / {result.totalMarks}
                            </TableCell>
                            <TableCell className="text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${(result.score / result.totalMarks) >= 0.8 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    (result.score / result.totalMarks) >= 0.5 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {Math.round((result.score / result.totalMarks) * 100)}%
                                </span>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {new Date(result.submittedAt).toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}