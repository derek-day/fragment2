"use client";

import React, { useState } from 'react';
import { migratePages } from '../../../scripts/migratePages';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

export default function MigratePagesPage() {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count?: number; error?: any } | null>(null);

  const handleMigrate = async () => {
    if (!confirm('This will upload all pages to Firestore. Continue?')) return;
    
    setMigrating(true);
    setResult(null);
    
    const res = await migratePages();
    setResult(res);
    setMigrating(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Migrate Pages to Firestore</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-4">⚠️ Important</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• This will upload all pages from your code to Firestore</li>
            <li>• Existing pages with the same ID will be overwritten</li>
            <li>• Make sure your Firebase config is set up correctly</li>
            <li>• Run this only once, or when you have new pages to add</li>
          </ul>
        </div>

        <button
          onClick={handleMigrate}
          disabled={migrating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-4 rounded-lg flex items-center justify-center gap-3 text-lg font-bold"
        >
          {migrating ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Migrating...
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              Start Migration
            </>
          )}
        </button>

        {result && (
          <div className={`mt-6 p-6 rounded-lg ${result.success ? 'bg-green-900' : 'bg-red-900'}`}>
            <div className="flex items-center gap-3 mb-2">
              {result.success ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Migration Successful!</h3>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Migration Failed</h3>
                </>
              )}
            </div>
            
            {result.success && result.count && (
              <p className="text-gray-200">Migrated {result.count} pages to Firestore</p>
            )}
            
            {!result.success && result.error && (
              <p className="text-gray-200">Error: {result.error.message || 'Unknown error'}</p>
            )}
          </div>
        )}

        <div className="mt-8 p-6 bg-gray-800 rounded-lg border-2 border-gray-700">
          <h2 className="text-xl font-bold mb-4">Next Steps</h2>
          <ol className="space-y-2 text-gray-300 list-decimal list-inside">
            <li>After migration, go to the Page Editor to manage pages</li>
            <li>You can add new pages directly in the editor</li>
            <li>Or add them programmatically using the addPageToFirestore function</li>
          </ol>
        </div>
      </div>
    </div>
  );
}