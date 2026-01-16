"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { isValidPage, validatePageReferences } from '../lib/pageValidation';

/**
 * Debug Panel - Shows current state and validates page navigation
 * Set SHOW_DEBUG to false in production
 */
const SHOW_DEBUG = true; // Set to false to hide

export default function DebugPanel({ pageId, page }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pageValidation, setPageValidation] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    loadUserData();

    // Validate current page
    if (page) {
      setPageValidation(validatePageReferences(page));
    }
  }, [page]);

  if (!SHOW_DEBUG) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg font-bold"
      >
        {isOpen ? '🐛 Hide Debug' : '🐛 Debug'}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-900 border-2 border-purple-500 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto text-white text-xs">
          <h3 className="text-lg font-bold mb-3 text-purple-400">Debug Panel</h3>

          {/* Current Page Info */}
          <div className="mb-4">
            <h4 className="font-bold text-purple-300 mb-2">Current Page</h4>
            <div className="bg-gray-800 p-2 rounded">
              <div><strong>ID:</strong> {pageId}</div>
              <div><strong>Title:</strong> {page?.title || 'N/A'}</div>
              <div><strong>Type:</strong> {page?.type || 'N/A'}</div>
              <div>
                <strong>Valid:</strong> 
                <span className={isValidPage(pageId) ? 'text-green-400' : 'text-red-400'}>
                  {isValidPage(pageId) ? ' ✓ Yes' : ' ✗ No'}
                </span>
              </div>
            </div>
          </div>

          {/* Page Navigation */}
          <div className="mb-4">
            <h4 className="font-bold text-purple-300 mb-2">Navigation</h4>
            <div className="bg-gray-800 p-2 rounded space-y-1">
              {page?.next && (
                <div>
                  <strong>Next:</strong> {page.next}
                  <span className={isValidPage(page.next) ? 'text-green-400' : 'text-red-400'}>
                    {isValidPage(page.next) ? ' ✓' : ' ✗'}
                  </span>
                </div>
              )}
              {page?.choices && (
                <div>
                  <strong>Choices:</strong> {page.choices.length}
                  {page.choices.map((choice, i) => (
                    <div key={i} className="ml-4 text-gray-400">
                      {i + 1}. → {choice.next}
                      <span className={isValidPage(choice.next) ? 'text-green-400' : 'text-red-400'}>
                        {isValidPage(choice.next) ? ' ✓' : ' ✗'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {page?.input?.next && (
                <div>
                  <strong>Input Next:</strong> {page.input.next}
                  <span className={isValidPage(page.input.next) ? 'text-green-400' : 'text-red-400'}>
                    {isValidPage(page.input.next) ? ' ✓' : ' ✗'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Validation Errors */}
          {pageValidation && !pageValidation.valid && (
            <div className="mb-4">
              <h4 className="font-bold text-red-400 mb-2">⚠️ Validation Errors</h4>
              <div className="bg-red-900 bg-opacity-30 p-2 rounded space-y-1">
                {pageValidation.errors.map((error, i) => (
                  <div key={i} className="text-red-300">• {error}</div>
                ))}
              </div>
            </div>
          )}

          {/* User Data */}
          {userData && (
            <div className="mb-4">
              <h4 className="font-bold text-purple-300 mb-2">User Data</h4>
              <div className="bg-gray-800 p-2 rounded space-y-1">
                <div><strong>Name:</strong> {userData.characterName || 'Not set'}</div>
                <div><strong>Class:</strong> {userData.className || 'Not set'}</div>
                <div><strong>Route:</strong> {userData.route || 'Not set'}</div>
                <div><strong>Saved Page:</strong> {userData.currentPage || 'Not set'}</div>
                <div><strong>Deaths:</strong> {userData.deaths || 0}</div>
                <div><strong>Revivals:</strong> {userData.revivals || 0}</div>
              </div>
            </div>
          )}

          {/* User Stats */}
          {userData?.stats && (
            <div>
              <h4 className="font-bold text-purple-300 mb-2">Stats</h4>
              <div className="bg-gray-800 p-2 rounded grid grid-cols-2 gap-1">
                <div>FEL: {userData.stats.Fellowship}</div>
                <div>ATH: {userData.stats.Athletics}</div>
                <div>THO: {userData.stats.Thought}</div>
                <div>ESS: {userData.stats.Essence}</div>
                <div>HP: {userData.stats.HP}/{userData.stats.MaxHP}</div>
                <div>Level: {userData.stats.Level}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}