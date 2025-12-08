// ============================================
// FILE: app/admin/page-editor/page.tsx
// ============================================
"use client";

import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

interface Enemy {
  name: string;
  maxHP: number;
  ac: number;
  attack: number;
  magic: number;
}

interface PageData {
  id: string;
  title: string;
  type: 'battle' | 'choice' | 'input' | 'text' | 'roll';
  text: string;
  enemy?: Enemy;
  next?: string;
  fail?: string;
  flee?: string;
  choices?: Array<{
    text: string;
    next: string;
  }>;
}

export default function PageEditorAdmin() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const pagesCollection = collection(db, 'pages');
      const snapshot = await getDocs(pagesCollection);
      const pagesData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as PageData));
      setPages(pagesData);
    } catch (error) {
      console.error('Error loading pages:', error);
      alert('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const savePage = async (pageData: PageData) => {
    try {
      const pageRef = doc(db, 'pages', pageData.id);
      const dataToSave: Record<string, any> = {
        title: pageData.title,
        type: pageData.type,
        text: pageData.text,
      };

      if (pageData.enemy) dataToSave.enemy = pageData.enemy;
      if (pageData.next) dataToSave.next = pageData.next;
      if (pageData.fail) dataToSave.fail = pageData.fail;
      if (pageData.flee) dataToSave.flee = pageData.flee;
      if (pageData.choices) dataToSave.choices = pageData.choices;

      await setDoc(pageRef, dataToSave);
      
      await loadPages();
      setEditingPage(null);
      setIsCreating(false);
      alert('Page saved successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page');
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm(`Are you sure you want to delete page "${pageId}"?`)) return;
    
    try {
      await deleteDoc(doc(db, 'pages', pageId));
      await loadPages();
      alert('Page deleted successfully!');
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  const createNewPage = () => {
    setEditingPage({
      id: '',
      title: '',
      type: 'text',
      text: '',
    });
    setIsCreating(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading pages...</div>
      </div>
    );
  }

  if (editingPage) {
    return <PageEditor 
      page={editingPage} 
      isCreating={isCreating}
      onSave={savePage} 
      onCancel={() => {
        setEditingPage(null);
        setIsCreating(false);
      }} 
    />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Page Editor</h1>
          <button
            onClick={createNewPage}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Page
          </button>
        </div>

        <div className="grid gap-4">
          {pages.map(page => (
            <div key={page.id} className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">{page.title}</h2>
                    <span className={`px-2 py-1 rounded text-xs ${
                      page.type === 'battle' ? 'bg-red-600' :
                      page.type === 'choice' ? 'bg-blue-600' :
                      'bg-gray-600'
                    }`}>
                      {page.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">ID: {page.id}</p>
                  <p className="text-gray-300 line-clamp-2">{page.text}</p>
                  
                  {page.enemy && (
                    <div className="mt-2 text-sm text-gray-400">
                      Enemy: {page.enemy.name} (HP: {page.enemy.maxHP}, AC: {page.enemy.ac})
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPage(page)}
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deletePage(page.id)}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No pages yet. Create your first page!
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// PAGE EDITOR COMPONENT
// ============================================
function PageEditor({ 
  page, 
  isCreating,
  onSave, 
  onCancel 
}: { 
  page: PageData; 
  isCreating: boolean;
  onSave: (page: PageData) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<PageData>(page);

  const updateField = (field: keyof PageData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateEnemyField = (field: keyof Enemy, value: any) => {
    setFormData(prev => ({
      ...prev,
      enemy: {
        name: prev.enemy?.name || '',
        maxHP: prev.enemy?.maxHP || 100,
        ac: prev.enemy?.ac || 15,
        attack: prev.enemy?.attack || 10,
        magic: prev.enemy?.magic || 10,
        [field]: value
      }
    }));
  };

  const addEnemy = () => {
    setFormData(prev => ({
      ...prev,
      enemy: {
        name: 'New Enemy',
        maxHP: 100,
        ac: 15,
        attack: 10,
        magic: 10
      }
    }));
  };

  const removeEnemy = () => {
    const newData = { ...formData };
    delete newData.enemy;
    setFormData(newData);
  };

  const handleSave = () => {
    if (!formData.id.trim()) {
      alert('Page ID is required');
      return;
    }
    if (!formData.title.trim()) {
      alert('Page title is required');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {isCreating ? 'Create New Page' : 'Edit Page'}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-6 bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-bold mb-2">Page ID (unique identifier)</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => updateField('id', e.target.value)}
              disabled={!isCreating}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 disabled:opacity-50"
              placeholder="portal_encounter"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Page Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              placeholder="First Battle"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Page Type</label>
            <select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value as PageData['type'])}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            >
              <option value="story">Story</option>
              <option value="battle">Battle</option>
              <option value="choice">Choice</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Story Text</label>
            <textarea
              value={formData.text}
              onChange={(e) => updateField('text', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 min-h-32"
              placeholder="Enter the story text that players will see..."
            />
          </div>

          {/* Battle-specific fields */}
          {formData.type === 'battle' && (
            <div className="border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Enemy Configuration</h3>
                {!formData.enemy ? (
                  <button
                    onClick={addEnemy}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                  >
                    Add Enemy
                  </button>
                ) : (
                  <button
                    onClick={removeEnemy}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Remove Enemy
                  </button>
                )}
              </div>

              {formData.enemy && (
                <div className="space-y-4 bg-gray-900 p-4 rounded">
                  <div>
                    <label className="block text-sm font-bold mb-2">Enemy Name</label>
                    <input
                      type="text"
                      value={formData.enemy.name}
                      onChange={(e) => updateEnemyField('name', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Max HP</label>
                      <input
                        type="number"
                        value={formData.enemy.maxHP}
                        onChange={(e) => updateEnemyField('maxHP', parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Armor Class (AC)</label>
                      <input
                        type="number"
                        value={formData.enemy.ac}
                        onChange={(e) => updateEnemyField('ac', parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Attack Bonus</label>
                      <input
                        type="number"
                        value={formData.enemy.attack}
                        onChange={(e) => updateEnemyField('attack', parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Magic Bonus</label>
                      <input
                        type="number"
                        value={formData.enemy.magic}
                        onChange={(e) => updateEnemyField('magic', parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-bold mb-4">Navigation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Next Page (success/continue)
                </label>
                <input
                  type="text"
                  value={formData.next || ''}
                  onChange={(e) => updateField('next', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  placeholder="portal_victory"
                />
              </div>

              {formData.type === 'battle' && (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Fail Page (defeat)
                    </label>
                    <input
                      type="text"
                      value={formData.fail || ''}
                      onChange={(e) => updateField('fail', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      placeholder="death"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Flee Page (escape)
                    </label>
                    <input
                      type="text"
                      value={formData.flee || ''}
                      onChange={(e) => updateField('flee', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      placeholder="escaped"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================
// FILE: app/adventure/[pageId]/page.tsx
// Example of using the page data in your game
// ============================================

// import { getPageData } from '@/lib/pageService';
// import BattleSystem from '@/components/BattleSystem';
// import { getUserStats } from '@/lib/userService';

// export default async function AdventurePage({ params }: { params: { pageId: string } }) {
//   const pageData = await getPageData(params.pageId);
//   const userStats = await getUserStats(); // Your existing function
  
//   if (!pageData) {
//     return <div>Page not found</div>;
//   }

//   if (pageData.type === 'battle') {
//     return <BattleSystem userStats={userStats} page={pageData} />;
//   }

//   // Handle other page types (story, choice, etc.)
//   return <div>{pageData.text}</div>;
// }