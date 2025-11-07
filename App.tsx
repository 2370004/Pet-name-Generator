
import React, { useState, useCallback } from 'react';
import { PET_TYPES } from './constants';
import { generatePetNames } from './services/geminiService';

const App: React.FC = () => {
  const [selectedPetType, setSelectedPetType] = useState<string>(PET_TYPES[0]);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateNames = useCallback(async () => {
    setLoading(true);
    setError(null);
    setGeneratedNames([]);
    try {
      const names = await generatePetNames(selectedPetType);
      setGeneratedNames(names);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("未知のエラーが発生しました。");
      }
      console.error("Error generating names:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedPetType]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-purple-700 mb-6 font-sans">
          <span role="img" aria-label="paw" className="mr-2">🐾</span>
          ペットの名前ジェネレーター
        </h1>

        <p className="text-center text-gray-600 mb-6 text-sm md:text-base">
          あなたの新しい家族にぴったりの、かわいくて覚えやすいカタカナの名前を見つけましょう！
        </p>

        <div className="mb-6">
          <label htmlFor="pet-type-select" className="block text-lg font-medium text-gray-700 mb-2">
            動物の種類を選択してください:
          </label>
          <select
            id="pet-type-select"
            value={selectedPetType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPetType(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base md:text-lg bg-white appearance-none"
            disabled={loading}
          >
            {PET_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerateNames}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg md:text-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-6 w-6 text-white mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            '名前を生成する'
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center shadow-md">
            <p className="font-semibold mb-2">エラーが発生しました:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {generatedNames.length > 0 && (
          <div className="mt-8 bg-purple-50 rounded-lg p-6 shadow-inner animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-purple-700 mb-5">
              候補の名前:
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedNames.map((name, index) => (
                <li
                  key={index}
                  className="bg-white text-center text-purple-800 font-semibold text-xl py-3 rounded-md shadow-sm transition duration-200 ease-in-out hover:bg-purple-100 hover:shadow-md transform hover:scale-105"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
