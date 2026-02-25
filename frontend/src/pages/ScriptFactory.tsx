import React, { useState } from 'react';
import { apiClient, endpoints } from '../api/client';
import { Script, RewriteVersion } from '../types';
import { Loader2, Link as LinkIcon, Upload, Wand2 } from 'lucide-react';

const ScriptFactory: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingRewrite, setLoadingRewrite] = useState(false);
  const [script, setScript] = useState<Script | null>(null);
  const [rewrites, setRewrites] = useState<RewriteVersion[]>([]);

  const handleExtract = async () => {
    if (!url) return;
    setLoadingExtract(true);
    try {
      // Mocking file upload via URL param for now as per requirements
      const response = await apiClient.post(endpoints.script.extract + `?url=${encodeURIComponent(url)}`);
      setScript(response.data);
      setRewrites([]); // Clear previous rewrites
    } catch (error) {
      console.error('Extraction failed', error);
      alert('Extraction failed');
    } finally {
      setLoadingExtract(false);
    }
  };

  const handleRewrite = async () => {
    if (!script) return;
    setLoadingRewrite(true);
    try {
      const response = await apiClient.post(endpoints.script.rewrite, {
        script_id: script.id
      });
      setRewrites(response.data);
    } catch (error) {
      console.error('Rewrite failed', error);
      alert('Rewrite failed');
    } finally {
      setLoadingRewrite(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">文案改写工厂</h2>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">抖音视频链接</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="https://v.douyin.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleExtract}
            disabled={loadingExtract || !url}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 h-10 whitespace-nowrap"
          >
            {loadingExtract ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            提取逐字稿
          </button>
        </div>
      </div>

      {/* Transcript & Rewrite */}
      {script && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Transcript */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-semibold mb-4">原始逐字稿</h3>
            <div className="bg-gray-50 p-4 rounded-lg h-64 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap border border-gray-200">
              {script.transcript}
            </div>
            <div className="mt-4">
              <button
                onClick={handleRewrite}
                disabled={loadingRewrite}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loadingRewrite ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                生成 3 个爆款版本
              </button>
            </div>
          </div>

          {/* Rewritten Versions */}
          <div className="space-y-4">
            {rewrites.length > 0 ? (
              rewrites.map((ver) => (
                <div key={ver.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase rounded">
                      {ver.style} 版本
                    </span>
                    <button 
                        className="text-xs text-gray-500 hover:text-indigo-600"
                        onClick={() => navigator.clipboard.writeText(ver.content)}
                    >
                        复制
                    </button>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{ver.content}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed">
                等待 AI 改写...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptFactory;
