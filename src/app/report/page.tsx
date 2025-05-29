'use client';
import React, { useEffect, useState } from 'react';

interface Report {
  id: string;
  conversationId: string;
  summary: string;
  transcript: string;
  createdAt: string;
}

const ReportPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/report');
        if (!res.ok) throw new Error('Failed to fetch reports');
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-indigo-400">Conversation Reports</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-6">
        {reports.map((report) => (
          <div key={report.id} className="p-4 bg-neutral-800 rounded border border-indigo-700">
            <div className="text-sm text-gray-400 mb-2">Conversation ID: {report.conversationId}</div>
            <div className="mb-2">
              <span className="font-semibold text-indigo-300">Summary:</span>
              <pre className="whitespace-pre-wrap text-sm mt-1">{report.summary}</pre>
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer text-indigo-400">Show Full Transcript</summary>
              <pre className="whitespace-pre-wrap text-xs mt-2 bg-neutral-900 p-2 rounded border border-gray-700">{report.transcript}</pre>
            </details>
            <div className="text-xs text-gray-500 mt-2">Created: {new Date(report.createdAt).toLocaleString()}</div>
          </div>
        ))}
        {(!loading && reports.length === 0) && <div>No reports found.</div>}
      </div>
    </div>
  );
};

export default ReportPage; 