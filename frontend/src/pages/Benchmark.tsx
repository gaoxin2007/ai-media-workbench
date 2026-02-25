import React, { useState } from 'react';
import { apiClient, endpoints } from '../api/client';
import { BenchmarkAccount } from '../types';
import { Search, Loader2, ExternalLink } from 'lucide-react';

const Benchmark: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<BenchmarkAccount[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiClient.post(endpoints.benchmark.search, { keyword });
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to search accounts', error);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">对标账号库</h2>
      
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="输入关键词搜索（例如：AI工具、烹饪、健身）"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            搜索抖音
          </button>
        </form>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{acc.account_name}</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">抖音号: {acc.user_id}</span>
              </div>
              <a 
                href={acc.profile_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 mb-4"
              >
                查看主页 <ExternalLink className="w-3 h-3" />
              </a>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">对标理由</h4>
                  <p className="text-sm text-blue-900">{acc.analysis_reason}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <h4 className="text-xs font-bold text-orange-800 uppercase mb-1">值得借鉴</h4>
                  <p className="text-sm text-orange-900">{acc.learning_points}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {accounts.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-12">
            输入关键词以查找热门对标账号
          </div>
        )}
      </div>
    </div>
  );
};

export default Benchmark;
