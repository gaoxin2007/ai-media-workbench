import React, { useState } from 'react';
import { apiClient, endpoints } from '../api/client';
import { Loader2, Play } from 'lucide-react';

const AvatarGen: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const response = await apiClient.post(endpoints.avatar.create, {
        text,
        avatar_id: "avatar_001", // Mock ID
        voice_id: "voice_001"   // Mock ID
      });
      setVideoUrl(response.data.video_url);
    } catch (error) {
      console.error('Video generation failed', error);
      alert('Video generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">数字人创作室</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Control */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">视频配置</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">口播文案</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-40"
                placeholder="在此粘贴您的文案..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数字人形象</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50" disabled>
                  <option>安娜 (默认)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">配音音色</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50" disabled>
                  <option>温柔女声 (默认)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !text}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              生成视频
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-black rounded-xl overflow-hidden flex items-center justify-center relative aspect-video shadow-lg">
          {videoUrl ? (
            <div className="text-center">
                {/* Mock Video Player */}
                <div className="text-white mb-4">视频生成成功！</div>
                <a 
                    href={videoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200"
                >
                    下载 / 观看
                </a>
                <p className="text-gray-500 text-xs mt-2">模拟链接: {videoUrl}</p>
            </div>
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              <VideoPlaceholder />
              <p className="mt-2 text-sm">预览将在此显示</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VideoPlaceholder = () => (
  <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"/>
  </svg>
);

export default AvatarGen;
