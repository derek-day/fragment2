// "use client";

// import React, { useState, useEffect } from 'react';
// import { db } from '../../../lib/firebase';
// import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
// import { Edit, Trash2, Plus, Save, X, Filter } from 'lucide-react';

// interface Enemy {
//   name: string;
//   maxHP: number;
//   ac: number;
//   attack: number;
//   magic: number;
//   points: number;
//   item: string;
// }

// interface PageData {
//   id: string;
//   title: string;
//   type: 'battle' | 'choice' | 'input' | 'text' | 'roll' | 'route' | 'stats' | 'equipment' | 'death';
//   text: string;
//   chapter?: string;
//   section?: string; // NEW: Section organization within chapters
//   enemy?: Enemy;
//   next?: string;
//   fail?: string;
//   flee?: string;
//   choices?: Array<{
//     label: string;
//     next: string;
//   }>;
// }

// export default function PageEditorAdmin() {
//   const [pages, setPages] = useState<PageData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingPage, setEditingPage] = useState<PageData | null>(null);
//   const [isCreating, setIsCreating] = useState(false);
//   const [selectedChapter, setSelectedChapter] = useState<string>('all');
//   const [selectedSection, setSelectedSection] = useState<string>('all');
//   const [chapters, setChapters] = useState<string[]>([]);
//   const [sections, setSections] = useState<string[]>([]);

//   useEffect(() => {
//     loadPages();
//   }, []);

//   const loadPages = async () => {
//     try {
//       setLoading(true);
//       const pagesCollection = collection(db, 'pages');
//       const snapshot = await getDocs(pagesCollection);
//       const pagesData = snapshot.docs.map(docSnap => ({
//         id: docSnap.id,
//         ...docSnap.data()
//       } as PageData));
      
//       setPages(pagesData);
      
//       // Extract unique chapters and sections
//       const uniqueChapters = Array.from(new Set(pagesData.map(p => p.chapter || 'uncategorized')));
//       setChapters(uniqueChapters.sort());
      
//       const uniqueSections = Array.from(new Set(pagesData.map(p => p.section || 'main')));
//       setSections(uniqueSections.sort());
//     } catch (error) {
//       console.error('Error loading pages:', error);
//       alert('Failed to load pages');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const savePage = async (pageData: PageData) => {
//     try {
//       const pageRef = doc(db, 'pages', pageData.id);
//       const dataToSave: Record<string, any> = {
//         title: pageData.title,
//         type: pageData.type,
//         text: pageData.text,
//         chapter: pageData.chapter || 'uncategorized',
//         section: pageData.section || 'main',
//       };

//       if (pageData.enemy) dataToSave.enemy = pageData.enemy;
//       if (pageData.next) dataToSave.next = pageData.next;
//       if (pageData.fail) dataToSave.fail = pageData.fail;
//       if (pageData.flee) dataToSave.flee = pageData.flee;
//       if (pageData.choices) dataToSave.choices = pageData.choices;

//       await setDoc(pageRef, dataToSave);
      
//       await loadPages();
//       setEditingPage(null);
//       setIsCreating(false);
//       alert('Page saved successfully!');
//     } catch (error) {
//       console.error('Error saving page:', error);
//       alert('Failed to save page');
//     }
//   };

//   const deletePage = async (pageId: string) => {
//     if (!confirm(`Are you sure you want to delete page "${pageId}"?`)) return;
    
//     try {
//       await deleteDoc(doc(db, 'pages', pageId));
//       await loadPages();
//       alert('Page deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting page:', error);
//       alert('Failed to delete page');
//     }
//   };

//   const createNewPage = () => {
//     setEditingPage({
//       id: '',
//       title: '',
//       type: 'text',
//       text: '',
//       chapter: selectedChapter !== 'all' ? selectedChapter : 'chapter1',
//       section: selectedSection !== 'all' ? selectedSection : 'main',
//     });
//     setIsCreating(true);
//   };

//   const filteredPages = pages.filter(p => {
//     const matchesChapter = selectedChapter === 'all' || (p.chapter || 'uncategorized') === selectedChapter;
//     const matchesSection = selectedSection === 'all' || (p.section || 'main') === selectedSection;
//     return matchesChapter && matchesSection;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="text-xl">Loading pages...</div>
//       </div>
//     );
//   }

//   if (editingPage) {
//     return <PageEditor 
//       page={editingPage} 
//       isCreating={isCreating}
//       onSave={savePage} 
//       onCancel={() => {
//         setEditingPage(null);
//         setIsCreating(false);
//       }} 
//     />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Page Editor</h1>
//           <button
//             onClick={createNewPage}
//             className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
//           >
//             <Plus className="w-5 h-5" />
//             New Page
//           </button>
//         </div>

//         {/* Chapter and Section Filters */}
//         <div className="mb-6 bg-gray-800 p-4 rounded-lg border-2 border-gray-700">
//           <div className="flex items-center gap-2 mb-3">
//             <Filter className="w-5 h-5 text-gray-400" />
//             <h3 className="text-lg font-bold">Filters</h3>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-bold text-gray-400 mb-2">Chapter</label>
//               <select
//                 value={selectedChapter}
//                 onChange={(e) => setSelectedChapter(e.target.value)}
//                 className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
//               >
//                 <option value="all">All Chapters ({pages.length})</option>
//                 {chapters.map(chapter => (
//                   <option key={chapter} value={chapter}>
//                     {chapter} ({pages.filter(p => (p.chapter || 'uncategorized') === chapter).length})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-bold text-gray-400 mb-2">Section</label>
//               <select
//                 value={selectedSection}
//                 onChange={(e) => setSelectedSection(e.target.value)}
//                 className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
//               >
//                 <option value="all">All Sections ({pages.length})</option>
//                 {sections.map(section => (
//                   <option key={section} value={section}>
//                     {section} ({pages.filter(p => (p.section || 'main') === section).length})
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <div className="mt-3 text-sm text-gray-400">
//             Showing {filteredPages.length} of {pages.length} pages
//           </div>
//         </div>

//         <div className="grid gap-4">
//           {filteredPages.map(page => (
//             <div key={page.id} className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h2 className="text-xl font-bold">{page.title}</h2>
//                     <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                       page.type === 'battle' ? 'bg-red-600' :
//                       page.type === 'choice' ? 'bg-blue-600' :
//                       page.type === 'text' ? 'bg-gray-600' :
//                       page.type === 'input' ? 'bg-cyan-600' :
//                       page.type === 'roll' ? 'bg-purple-600' :
//                       page.type === 'route' ? 'bg-yellow-600' :
//                       page.type === 'stats' ? 'bg-green-600' :
//                       page.type === 'equipment' ? 'bg-orange-600' :
//                       page.type === 'death' ? 'bg-black' :
//                       'bg-gray-600'
//                     }`}>
//                       {page.type}
//                     </span>
//                     <span className="px-2 py-1 rounded text-xs bg-purple-600">
//                       {page.chapter || 'uncategorized'}
//                     </span>
//                     <span className="px-2 py-1 rounded text-xs bg-indigo-600">
//                       {page.section || 'main'}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-400 mb-2">ID: {page.id}</p>
//                   <p className="text-gray-300 line-clamp-2">{page.text}</p>
                  
//                   {page.enemy && (
//                     <div className="mt-2 text-sm text-gray-400">
//                       Enemy: {page.enemy.name} (HP: {page.enemy.maxHP}, AC: {page.enemy.ac})
//                     </div>
//                   )}

//                   {page.choices && page.choices.length > 0 && (
//                     <div className="mt-2 text-sm text-gray-400">
//                       Choices: {page.choices.length} options
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setEditingPage(page)}
//                     className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
//                   >
//                     <Edit className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => deletePage(page.id)}
//                     className="bg-red-600 hover:bg-red-700 p-2 rounded"
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredPages.length === 0 && (
//           <div className="text-center text-gray-500 mt-8">
//             No pages match the current filters. Create a new page or adjust your filters!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ============================================
// // PAGE EDITOR COMPONENT
// // ============================================
// function PageEditor({ 
//   page, 
//   isCreating,
//   onSave, 
//   onCancel 
// }: { 
//   page: PageData; 
//   isCreating: boolean;
//   onSave: (page: PageData) => void; 
//   onCancel: () => void;
// }) {
//   const [formData, setFormData] = useState<PageData>(page);

//   const updateField = (field: keyof PageData, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const updateEnemyField = (field: keyof Enemy, value: any) => {
//     setFormData(prev => ({
//       ...prev,
//       enemy: {
//         name: prev.enemy?.name || '',
//         maxHP: prev.enemy?.maxHP || 100,
//         ac: prev.enemy?.ac || 15,
//         attack: prev.enemy?.attack || 10,
//         magic: prev.enemy?.magic || 10,
//         points: prev.enemy?.points || 0,
//         item: prev.enemy?.item || '',
//         [field]: value
//       }
//     }));
//   };

//   const addEnemy = () => {
//     setFormData(prev => ({
//       ...prev,
//       enemy: {
//         name: 'New Enemy',
//         maxHP: 100,
//         ac: 15,
//         attack: 10,
//         magic: 10,
//         points: 5,
//         item: 'Random Item'
//       }
//     }));
//   };

//   const removeEnemy = () => {
//     const newData = { ...formData };
//     delete newData.enemy;
//     setFormData(newData);
//   };

//   const handleSave = () => {
//     if (!formData.id.trim()) {
//       alert('Page ID is required');
//       return;
//     }
//     if (!formData.title.trim()) {
//       alert('Page title is required');
//       return;
//     }
//     onSave(formData);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">
//             {isCreating ? 'Create New Page' : 'Edit Page'}
//           </h1>
//           <div className="flex gap-2">
//             <button
//               onClick={handleSave}
//               className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
//             >
//               <Save className="w-5 h-5" />
//               Save
//             </button>
//             <button
//               onClick={onCancel}
//               className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
//             >
//               <X className="w-5 h-5" />
//               Cancel
//             </button>
//           </div>
//         </div>

//         <div className="space-y-6 bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
//           {/* Basic Info */}
//           <div>
//             <label className="block text-sm font-bold mb-2">Page ID (unique identifier)</label>
//             <input
//               type="text"
//               value={formData.id}
//               onChange={(e) => updateField('id', e.target.value)}
//               disabled={!isCreating}
//               className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 disabled:opacity-50"
//               placeholder="forest_encounter"
//             />
//             <p className="text-xs text-gray-400 mt-1">
//               Tip: Use descriptive IDs like "forest_encounter" or "castle_gate"
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-bold mb-2">Chapter</label>
//             <input
//               type="text"
//               value={formData.chapter || ''}
//               onChange={(e) => updateField('chapter', e.target.value)}
//               className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//               placeholder="chapter1"
//             />
//             <p className="text-xs text-gray-400 mt-1">
//               Main chapter grouping (e.g., "chapter1", "prologue", "epilogue")
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-bold mb-2">Section</label>
//             <input
//               type="text"
//               value={formData.section || ''}
//               onChange={(e) => updateField('section', e.target.value)}
//               className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//               placeholder="main"
//             />
//             <p className="text-xs text-gray-400 mt-1">
//               Sub-section within chapter (e.g., "forest", "castle", "sidequest")
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-bold mb-2">Page Title</label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => updateField('title', e.target.value)}
//               className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//               placeholder="The Dark Forest"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-bold mb-2">Page Type</label>
//             <select
//               value={formData.type}
//               onChange={(e) => updateField('type', e.target.value as PageData['type'])}
//               className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//             >
//               <option value="text">Text (Story/Narrative)</option>
//               <option value="battle">Battle (Combat)</option>
//               <option value="choice">Choice (Multiple Options)</option>
//               <option value="input">Input (Text Entry)</option>
//               <option value="roll">Roll (Dice Check)</option>
//               <option value="route">Route (Path Selection)</option>
//               <option value="stats">Stats (Character Sheet)</option>
//               <option value="equipment">Equipment (Inventory)</option>
//               <option value="death">Death (Game Over)</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-bold mb-2">Story Text</label>
//             <textarea
//               value={formData.text}
//               onChange={(e) => updateField('text', e.target.value)}
//               className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 min-h-32"
//               placeholder="Enter the story text that players will see..."
//             />
//           </div>

//           {/* Battle-specific fields */}
//           {formData.type === 'battle' && (
//             <div className="border-t border-gray-700 pt-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold">Enemy Configuration</h3>
//                 {!formData.enemy ? (
//                   <button
//                     onClick={addEnemy}
//                     className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
//                   >
//                     Add Enemy
//                   </button>
//                 ) : (
//                   <button
//                     onClick={removeEnemy}
//                     className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
//                   >
//                     Remove Enemy
//                   </button>
//                 )}
//               </div>

//               {formData.enemy && (
//                 <div className="space-y-4 bg-gray-900 p-4 rounded">
//                   <div>
//                     <label className="block text-sm font-bold mb-2">Enemy Name</label>
//                     <input
//                       type="text"
//                       value={formData.enemy.name}
//                       onChange={(e) => updateEnemyField('name', e.target.value)}
//                       className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-bold mb-2">Max HP</label>
//                       <input
//                         type="number"
//                         value={formData.enemy.maxHP}
//                         onChange={(e) => updateEnemyField('maxHP', parseInt(e.target.value) || 0)}
//                         className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold mb-2">Armor Class (AC)</label>
//                       <input
//                         type="number"
//                         value={formData.enemy.ac}
//                         onChange={(e) => updateEnemyField('ac', parseInt(e.target.value) || 0)}
//                         className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold mb-2">Attack Bonus</label>
//                       <input
//                         type="number"
//                         value={formData.enemy.attack}
//                         onChange={(e) => updateEnemyField('attack', parseInt(e.target.value) || 0)}
//                         className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-bold mb-2">Magic Bonus</label>
//                       <input
//                         type="number"
//                         value={formData.enemy.magic}
//                         onChange={(e) => updateEnemyField('magic', parseInt(e.target.value) || 0)}
//                         className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Navigation - Text Type */}
//           {formData.type === 'text' && (
//             <div className="border-t border-gray-700 pt-6">
//               <h3 className="text-xl font-bold mb-4">Navigation</h3>
//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   Next Page ID
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.next || ''}
//                   onChange={(e) => updateField('next', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                   placeholder="chapter1.forest_path"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">Format: chapter.page_id</p>
//               </div>
//             </div>
//           )}

//           {/* Navigation - Other Simple Types (roll, input, route, stats, equipment, death) */}
//           {(formData.type === 'roll' || formData.type === 'input' || formData.type === 'route' || 
//             formData.type === 'stats' || formData.type === 'equipment' || formData.type === 'death') && (
//             <div className="border-t border-gray-700 pt-6">
//               <h3 className="text-xl font-bold mb-4">Navigation</h3>
//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   Next Page ID
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.next || ''}
//                   onChange={(e) => updateField('next', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                   placeholder="chapter1.next_page"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Navigation - Battle Type */}
//           {formData.type === 'battle' && (
//             <div className="border-t border-gray-700 pt-6">
//               <h3 className="text-xl font-bold mb-4">Navigation</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-bold mb-2">
//                     Victory Page ID
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.next || ''}
//                     onChange={(e) => updateField('next', e.target.value)}
//                     className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                     placeholder="chapter1.victory"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold mb-2">
//                     Defeat Page ID
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.fail || ''}
//                     onChange={(e) => updateField('fail', e.target.value)}
//                     className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                     placeholder="chapter1.death"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold mb-2">
//                     Flee Page ID
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.flee || ''}
//                     onChange={(e) => updateField('flee', e.target.value)}
//                     className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                     placeholder="chapter1.escaped"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation - Choice Type */}
//           {formData.type === 'choice' && (
//             <div className="border-t border-gray-700 pt-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold">Player Choices</h3>
//                 <button
//                   onClick={() => {
//                     const newChoices = [...(formData.choices || []), { text: '', next: '' }];
//                     updateField('choices', newChoices);
//                   }}
//                   className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
//                 >
//                   Add Choice
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {(formData.choices || []).map((choice, index) => (
//                   <div key={index} className="bg-gray-900 p-4 rounded border border-gray-700">
//                     <div className="flex justify-between items-center mb-3">
//                       <h4 className="font-bold text-sm text-gray-400">Choice {index + 1}</h4>
//                       <button
//                         onClick={() => {
//                           const newChoices = formData.choices?.filter((_, i) => i !== index);
//                           updateField('choices', newChoices);
//                         }}
//                         className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
//                       >
//                         Remove
//                       </button>
//                     </div>
                    
//                     <div className="space-y-3">
//                       <div>
//                         <label className="block text-sm font-bold mb-2">
//                           Choice Text (what player sees)
//                         </label>
//                         <input
//                           type="text"
//                           value={choice.label}
//                           onChange={(e) => {
//                             const newChoices = [...(formData.choices || [])];
//                             newChoices[index] = { ...choice, label: e.target.value };
//                             updateField('choices', newChoices);
//                           }}
//                           className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                           placeholder="Go left into the forest"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-bold mb-2">
//                           Next Page ID
//                         </label>
//                         <input
//                           type="text"
//                           value={choice.next}
//                           onChange={(e) => {
//                             const newChoices = [...(formData.choices || [])];
//                             newChoices[index] = { ...choice, next: e.target.value };
//                             updateField('choices', newChoices);
//                           }}
//                           className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
//                           placeholder="chapter1.forest_path"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {(!formData.choices || formData.choices.length === 0) && (
//                   <div className="text-center text-gray-500 py-8">
//                     No choices yet. Add your first choice!
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// ============================================
// FILE: app/admin/page-editor/page.tsx
// 
// IMPORTANT: Update your Firestore Security Rules first!
// Go to Firebase Console > Firestore Database > Rules
// Replace with:
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /pages/{pageId} {
//       allow read: if true;
//       allow write: if request.auth != null;
//     }
//     match /users/{userId} {
//       allow read, write: if request.auth != null && request.auth.uid == userId;
//     }
//   }
// }
//
// Then click "Publish"
// ============================================
"use client";

import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Edit, Trash2, Plus, Save, X, Filter } from 'lucide-react';

interface Enemy {
  name: string;
  maxHP: number;
  ac: number;
  attack: number;
  magic: number;
  points: number;
  item: string;
}

interface PageData {
  id: string;
  title: string;
  type: 'battle' | 'choice' | 'input' | 'text' | 'roll' | 'route' | 'stats' | 'equipment' | 'death';
  text: string;
  chapter?: string;
  section?: string; // NEW: Section organization within chapters
  enemy?: Enemy;
  next?: string;
  fail?: string;
  flee?: string;
  choices?: Array<{
    label: string;
    next: string;
  }>;
}

export default function PageEditorAdmin() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [chapters, setChapters] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);

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
      
      // Extract unique chapters and sections
      const uniqueChapters = Array.from(new Set(pagesData.map(p => p.chapter || 'uncategorized')));
      setChapters(uniqueChapters.sort());
      
      const uniqueSections = Array.from(new Set(pagesData.map(p => p.section || 'main')));
      setSections(uniqueSections.sort());
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
        chapter: pageData.chapter || 'uncategorized',
        section: pageData.section || 'main',
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
      chapter: selectedChapter !== 'all' ? selectedChapter : 'chapter1',
      section: selectedSection !== 'all' ? selectedSection : 'main',
    });
    setIsCreating(true);
  };

  const filteredPages = pages.filter(p => {
    const matchesChapter = selectedChapter === 'all' || (p.chapter || 'uncategorized') === selectedChapter;
    const matchesSection = selectedSection === 'all' || (p.section || 'main') === selectedSection;
    return matchesChapter && matchesSection;
  });

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

        {/* Chapter and Section Filters */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg border-2 border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Chapter</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
              >
                <option value="all">All Chapters ({pages.length})</option>
                {chapters.map(chapter => (
                  <option key={chapter} value={chapter}>
                    {chapter} ({pages.filter(p => (p.chapter || 'uncategorized') === chapter).length})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
              >
                <option value="all">All Sections ({pages.length})</option>
                {sections.map(section => (
                  <option key={section} value={section}>
                    {section} ({pages.filter(p => (p.section || 'main') === section).length})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-3 text-sm text-gray-400">
            Showing {filteredPages.length} of {pages.length} pages
          </div>
        </div>

        <div className="grid gap-4">
          {filteredPages.map(page => (
            <div key={page.id} className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold">{page.title}</h2>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      page.type === 'battle' ? 'bg-red-600' :
                      page.type === 'choice' ? 'bg-blue-600' :
                      page.type === 'text' ? 'bg-gray-600' :
                      page.type === 'input' ? 'bg-cyan-600' :
                      page.type === 'roll' ? 'bg-purple-600' :
                      page.type === 'route' ? 'bg-yellow-600' :
                      page.type === 'stats' ? 'bg-green-600' :
                      page.type === 'equipment' ? 'bg-orange-600' :
                      page.type === 'death' ? 'bg-black' :
                      'bg-gray-600'
                    }`}>
                      {page.type}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-purple-600">
                      {page.chapter || 'uncategorized'}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-indigo-600">
                      {page.section || 'main'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">ID: {page.id}</p>
                  <p className="text-gray-300 line-clamp-2">{page.text}</p>
                  
                  {page.enemy && (
                    <div className="mt-2 text-sm text-gray-400">
                      Enemy: {page.enemy.name} (HP: {page.enemy.maxHP}, AC: {page.enemy.ac})
                    </div>
                  )}

                  {page.choices && page.choices.length > 0 && (
                    <div className="mt-2 text-sm text-gray-400">
                      Choices: {page.choices.length} options
                    </div>
                  )}

                  {/* Navigation Info */}
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex flex-wrap gap-2 text-xs">
                      {page.next && (
                        <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded border border-green-700">
                          → {page.next}
                        </span>
                      )}
                      {page.fail && (
                        <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded border border-red-700">
                          ✕ {page.fail}
                        </span>
                      )}
                      {page.flee && (
                        <span className="bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded border border-yellow-700">
                          ⎋ {page.flee}
                        </span>
                      )}
                      {page.choices?.map((choice, idx) => (
                        <span key={idx} className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded border border-blue-700">
                          {idx + 1}→ {choice.next}
                        </span>
                      ))}
                    </div>

                    {/* Pages that link TO this page */}
                    {(() => {
                      const incomingPages = pages.filter(p => 
                        p.next === page.id || 
                        p.fail === page.id || 
                        p.flee === page.id ||
                        p.choices?.some(c => c.next === page.id)
                      );
                      
                      if (incomingPages.length > 0) {
                        return (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <span className="text-gray-500">From:</span>
                            {incomingPages.map(p => (
                              <button
                                key={p.id}
                                onClick={() => setEditingPage(p)}
                                className="bg-gray-900/50 text-gray-400 px-2 py-1 rounded border border-gray-600 hover:border-gray-500 hover:text-gray-300"
                              >
                                ← {p.id}
                              </button>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
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

        {filteredPages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No pages match the current filters. Create a new page or adjust your filters!
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
  const [allPages, setAllPages] = useState<PageData[]>([]);

  // Load all pages for navigation preview
  useEffect(() => {
    const loadAllPages = async () => {
      try {
        const pagesCollection = collection(db, 'pages');
        const snapshot = await getDocs(pagesCollection);
        const pagesData = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        } as PageData));
        setAllPages(pagesData);
      } catch (error) {
        console.error('Error loading pages:', error);
      }
    };
    loadAllPages();
  }, []);

  // Find pages that link to this page
  const incomingPages = allPages.filter(p => 
    p.next === formData.id || 
    p.fail === formData.id || 
    p.flee === formData.id ||
    p.choices?.some(c => c.next === formData.id)
  );

  // Find pages this page links to
  const outgoingPageIds = [
    formData.next,
    formData.fail,
    formData.flee,
    ...(formData.choices?.map(c => c.next) || [])
  ].filter(Boolean);

  const outgoingPages = allPages.filter(p => outgoingPageIds.includes(p.id));

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
        points: prev.enemy?.points || 5,
        item: prev.enemy?.item || '',
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
        magic: 10,
        points: 5,
        item: 'Random Item'
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

        {/* Navigation Preview */}
        {!isCreating && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Incoming Pages */}
            <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              <h3 className="text-sm font-bold text-gray-400 mb-3">← Pages Leading Here ({incomingPages.length})</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {incomingPages.length > 0 ? (
                  incomingPages.map(p => (
                    <div key={p.id} className="bg-gray-900 p-2 rounded text-xs">
                      <div className="font-bold text-blue-400">{p.id}</div>
                      <div className="text-gray-500">{p.title}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-xs">No pages link to this one</div>
                )}
              </div>
            </div>

            {/* Outgoing Pages */}
            <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              <h3 className="text-sm font-bold text-gray-400 mb-3">Pages This Leads To → ({outgoingPages.length})</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {outgoingPages.length > 0 ? (
                  outgoingPages.map(p => (
                    <div key={p.id} className="bg-gray-900 p-2 rounded text-xs">
                      <div className="font-bold text-green-400">{p.id}</div>
                      <div className="text-gray-500">{p.title}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-xs">This page doesn't link anywhere yet</div>
                )}
              </div>
            </div>
          </div>
        )}

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
              placeholder="forest_encounter"
            />
            <p className="text-xs text-gray-400 mt-1">
              Tip: Use descriptive IDs like "forest_encounter" or "castle_gate"
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Chapter</label>
            <input
              type="text"
              value={formData.chapter || ''}
              onChange={(e) => updateField('chapter', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              placeholder="chapter1"
            />
            <p className="text-xs text-gray-400 mt-1">
              Main chapter grouping (e.g., "chapter1", "prologue", "epilogue")
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Section</label>
            <input
              type="text"
              value={formData.section || ''}
              onChange={(e) => updateField('section', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              placeholder="main"
            />
            <p className="text-xs text-gray-400 mt-1">
              Sub-section within chapter (e.g., "forest", "castle", "sidequest")
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Page Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              placeholder="The Dark Forest"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Page Type</label>
            <select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value as PageData['type'])}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            >
              <option value="text">Text (Story/Narrative)</option>
              <option value="battle">Battle (Combat)</option>
              <option value="choice">Choice (Multiple Options)</option>
              <option value="input">Input (Text Entry)</option>
              <option value="roll">Roll (Dice Check)</option>
              <option value="route">Route (Path Selection)</option>
              <option value="stats">Stats (Character Sheet)</option>
              <option value="equipment">Equipment (Inventory)</option>
              <option value="death">Death (Game Over)</option>
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

          {/* Navigation - Text Type */}
          {formData.type === 'text' && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-bold mb-4">Navigation</h3>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Next Page ID
                </label>
                <input
                  type="text"
                  value={formData.next || ''}
                  onChange={(e) => updateField('next', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  placeholder="chapter1.forest_path"
                />
                <p className="text-xs text-gray-400 mt-1">Format: chapter.page_id</p>
              </div>
            </div>
          )}

          {/* Navigation - Other Simple Types (roll, input, route, stats, equipment, death) */}
          {(formData.type === 'roll' || formData.type === 'input' || formData.type === 'route' || 
            formData.type === 'stats' || formData.type === 'equipment' || formData.type === 'death') && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-bold mb-4">Navigation</h3>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Next Page ID
                </label>
                <input
                  type="text"
                  value={formData.next || ''}
                  onChange={(e) => updateField('next', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  placeholder="chapter1.next_page"
                />
              </div>
            </div>
          )}

          {/* Navigation - Battle Type */}
          {formData.type === 'battle' && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-bold mb-4">Navigation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Victory Page ID
                  </label>
                  <input
                    type="text"
                    value={formData.next || ''}
                    onChange={(e) => updateField('next', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    placeholder="chapter1.victory"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Defeat Page ID
                  </label>
                  <input
                    type="text"
                    value={formData.fail || ''}
                    onChange={(e) => updateField('fail', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    placeholder="chapter1.death"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Flee Page ID
                  </label>
                  <input
                    type="text"
                    value={formData.flee || ''}
                    onChange={(e) => updateField('flee', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                    placeholder="chapter1.escaped"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation - Choice Type */}
          {formData.type === 'choice' && (
            <div className="border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Player Choices</h3>
                <button
                  onClick={() => {
                    const newChoices = [...(formData.choices || []), { text: '', next: '' }];
                    updateField('choices', newChoices);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                >
                  Add Choice
                </button>
              </div>

              <div className="space-y-4">
                {(formData.choices || []).map((choice, index) => (
                  <div key={index} className="bg-gray-900 p-4 rounded border border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-sm text-gray-400">Choice {index + 1}</h4>
                      <button
                        onClick={() => {
                          const newChoices = formData.choices?.filter((_, i) => i !== index);
                          updateField('choices', newChoices);
                        }}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-bold mb-2">
                          Choice Text (what player sees)
                        </label>
                        <input
                          type="text"
                          value={choice.label}
                          onChange={(e) => {
                            const newChoices = [...(formData.choices || [])];
                            newChoices[index] = { ...choice, label: e.target.value };
                            updateField('choices', newChoices);
                          }}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          placeholder="Go left into the forest"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2">
                          Next Page ID
                        </label>
                        <input
                          type="text"
                          value={choice.next}
                          onChange={(e) => {
                            const newChoices = [...(formData.choices || [])];
                            newChoices[index] = { ...choice, next: e.target.value };
                            updateField('choices', newChoices);
                          }}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                          placeholder="chapter1.forest_path"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(!formData.choices || formData.choices.length === 0) && (
                  <div className="text-center text-gray-500 py-8">
                    No choices yet. Add your first choice!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}