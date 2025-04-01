"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  SortAsc,
  SortDesc,
  BarChart
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ProtectedPage } from '@/components/auth/protected-page';
import { useAuth } from '@/components/auth/auth-provider';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

interface Response {
  id: string;
  created_at: string;
  data: { [key: string]: any };
}

interface Form {
  id: string;
  title: string;
  description?: string;
  responseCount?: number;
}

export const runtime = 'edge';

const ResponsesPage = () => {
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const router = useRouter();
  const { session } = useAuth();
  const formId = params.id as string;

  // Fetch form details using SWR
  const { data: formData, error: formError, isLoading: formLoading } = useSWR(
    session?.access_token ? 
      [`/api/forms?id=${formId}`, session?.access_token] : 
      null, 
    ([url, token]) => fetcher<{ form: Form }>(url, token)
  );

  // Fetch form responses using SWR
  const { data: responsesData, error: responsesError, isLoading: responsesLoading } = useSWR(
    session?.access_token ? 
      [`/api/responses?id=${formId}`, session?.access_token] : 
      null, 
    ([url, token]) => fetcher<{ responses: Response[] }>(url, token)
  );

  // Handle any errors
  if (formError) {
    toast.error("Failed to load form details");
  }
  
  if (responsesError) {
    toast.error("Failed to load form responses");
  }

  // Determine overall loading state
  const isLoading = formLoading || responsesLoading;
  
  // Get data from SWR responses
  const form = formData?.form || null;
  const responses = responsesData?.responses || [];

  // Get unique columns from all responses
  const columns = useMemo(() => {
    if (!responses.length) return [];

    // Extract all unique fields from responses
    const allFields = new Set<string>();
    responses.forEach(response => {
      if (response.data && typeof response.data === 'object') {
        Object.keys(response.data).forEach(key => allFields.add(key));
      }
    });

    // Always include submission timestamp
    allFields.add('created_at');

    return Array.from(allFields);
  }, [responses]);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const filteredAndSortedResponses = useMemo(() => {
    let result = [...responses];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(response => {
        if (!response.data) return false;
        return columns.some(column => {
          const value = column === 'created_at'
            ? new Date(response.created_at).toLocaleString()
            : response.data[column];

          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(lowerSearchTerm);
        });
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === 'created_at') {
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
        } else {
          aValue = a.data?.[sortConfig.key];
          bValue = b.data?.[sortConfig.key];
        }

        // Handle undefined values in sorting
        if (aValue === undefined) aValue = '';
        if (bValue === undefined) bValue = '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [responses, searchTerm, sortConfig, columns]);

  // Export to CSV
  const exportToCSV = () => {
    try {
      // Skip export if no data
      if (!responses.length) {
        toast.error("No data to export");
        return;
      }

      // Create CSV header row
      const csvHeader = columns.join(',');

      // Create CSV rows from responses
      const csvRows = filteredAndSortedResponses.map(response => {
        return columns.map(column => {
          const value = column === 'created_at'
            ? response.created_at
            : response.data?.[column];

          // Handle CSV formatting for different data types
          if (value === undefined || value === null) {
            return '';
          } else if (typeof value === 'string') {
            // Escape quotes and wrap in quotes if needed
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          } else if (typeof value === 'object') {
            // Stringify objects
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }

          return String(value);
        }).join(',');
      }).join('\n');

      // Combine header and rows
      const csv = csvHeader + '\n' + csvRows;

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${form?.title || 'form'}-responses-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export completed");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export data");
    }
  };

  // Format cell value for display
  const formatCellValue = (column: string, value: any) => {
    if (value === undefined || value === null) return "—";

    if (column === 'created_at') {
      return new Date(value).toLocaleString();
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-12 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-40" />
            </div>

            <div className="border rounded-md">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state or form not found
  if (formError || !form) {
    return (
      <div className="container py-12 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Form Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The form you are looking for could not be found.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" asChild className="mr-4" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">{form.title}</h1>
            <p className="text-muted-foreground">
              Form Responses ({filteredAndSortedResponses.length})
            </p>
          </div>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Response Data</CardTitle>
              <CardDescription>
                View and analyze submissions from your form
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={!responses.length}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              {/* Future AI analysis button - placeholder for now */}
              <Button
                variant="outline"
                size="sm"
                disabled
                title="Coming soon: AI powered analysis"
              >
                <BarChart className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search responses..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <button
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded-sm"
                  onClick={() => setSearchTerm("")}
                >
                  Clear filters
                </button>
                {/* Add more advanced filters here in the future */}
              </PopoverContent>
            </Popover>
          </div>

          <div className="border rounded-md">
            {responses.length === 0 ? (
              <div className="py-16 text-center">
                <h3 className="font-medium text-xl mb-2">No responses yet</h3>
                <p className="text-muted-foreground">
                  Your form hasn&apos;t received any submissions.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column} className="whitespace-nowrap">
                          <button
                            className="flex items-center gap-1 hover:text-primary"
                            onClick={() => handleSort(column)}
                          >
                            {column === 'created_at' ? 'Submission Date' : column}
                            {sortConfig?.key === column && (
                              sortConfig.direction === 'asc' ?
                                <SortAsc className="w-3 h-3" /> :
                                <SortDesc className="w-3 h-3" />
                            )}
                          </button>
                        </TableHead>
                      ))}
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedResponses.map((response) => (
                      <TableRow key={response.id}>
                        {columns.map((column) => {
                          const value = column === 'created_at'
                            ? response.created_at
                            : response.data?.[column];

                          return (
                            <TableCell key={`${response.id}-${column}`} className="whitespace-nowrap">
                              {formatCellValue(column, value)}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-56">
                              <button
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded-sm"
                                onClick={() => {/* View details */ }}
                              >
                                View details
                              </button>
                              <button
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded-sm text-destructive"
                                onClick={() => {/* Delete response */ }}
                              >
                                Delete response
                              </button>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="py-4 border-t flex justify-between text-sm text-muted-foreground">
          <div>
            Showing {filteredAndSortedResponses.length} of {responses.length} responses
          </div>
          <div>
            Last updated: {new Date().toLocaleString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ProtectedPage(ResponsesPage);
