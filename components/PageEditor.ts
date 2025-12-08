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
        ...prev.enemy!,
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
    setFormData(prev => {
      const newData = { ...prev };
      delete newData.enemy;
      return newData;
    });
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
              onChange={(e) => updateField('type', e.target.value)}
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
                        onChange={(e) => updateEnemyField('maxHP', parseInt(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Armor Class (AC)</label>
                      <input
                        type="number"
                        value={formData.enemy.ac}
                        onChange={(e) => updateEnemyField('ac', parseInt(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Attack Bonus</label>
                      <input
                        type="number"
                        value={formData.enemy.attack}
                        onChange={(e) => updateEnemyField('attack', parseInt(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Magic Bonus</label>
                      <input
                        type="number"
                        value={formData.enemy.magic}
                        onChange={(e) => updateEnemyField('magic', parseInt(e.target.value))}
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