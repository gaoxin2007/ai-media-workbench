import React, { useState, useEffect } from 'react';
import { apiClient, endpoints } from '../api/client';
import { IPProfile, IPPositioningResult, IPHistoryItem } from '../types';
import { Loader2, History, AlertTriangle, CheckCircle, Info, ChevronRight, AlertOctagon, Edit3, Save, X } from 'lucide-react';

const IPPositioning: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    name_or_brand: '',
    bio: '',
    target_direction: '',
    style_preference: '',
    target_audience: '',
    monetization: '',
    constraints: '',
    platform_preference: 'douyin',
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Data State
  const [result, setResult] = useState<IPProfile | null>(null);
  const [editData, setEditData] = useState<IPPositioningResult | null>(null);
  const [history, setHistory] = useState<IPHistoryItem[]>([]);

  // Load History on Mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Sync editData when result loads
  useEffect(() => {
    if (result?.result_json) {
      setEditData(result.result_json);
      setIsEditing(false);
    }
  }, [result]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await apiClient.get(endpoints.ip.history);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleLoadHistoryItem = async (id: number) => {
    setLoading(true);
    try {
      // @ts-ignore
      const res = await apiClient.get(endpoints.ip.detail(id));
      setResult(res.data);
    } catch (err) {
      console.error("Failed to load item", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post(endpoints.ip.generate, formData);
      setResult(response.data);
      fetchHistory(); // Refresh history
    } catch (error) {
      console.error('Failed to generate IP', error);
      alert('生成失败，请检查API Key配置或网络');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !editData) return;
    setLoading(true);
    try {
      // @ts-ignore
      const res = await apiClient.put(endpoints.ip.update(result.id), editData);
      setResult(res.data);
      setIsEditing(false);
      fetchHistory(); // Refresh summary in list
    } catch (err) {
      console.error("Failed to save", err);
      alert("保存失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (result?.result_json) {
      setEditData(result.result_json);
    }
    setIsEditing(false);
  };

  // Helper to safely access result data
  const displayData = isEditing ? editData : result?.result_json;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">IP 定位中心</h2>
        <div className="text-sm text-gray-500">基于千问大模型 (Qwen)</div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
              定位输入
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名称/品牌 (可选)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="例如：AI 探索者"
                  value={formData.name_or_brand}
                  onChange={(e) => setFormData({ ...formData, name_or_brand: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">个人简介 (Bio) *</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  rows={3}
                  placeholder="例如：5年AI开发经验，热爱编程，想通过视频分享技术..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目标方向 *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="例如：AI 编程入门教学"
                  value={formData.target_direction}
                  onChange={(e) => setFormData({ ...formData, target_direction: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">风格偏好 *</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={formData.style_preference}
                  onChange={(e) => setFormData({ ...formData, style_preference: e.target.value })}
                  required
                >
                  <option value="">选择风格</option>
                  <option value="Professional">专业严肃</option>
                  <option value="Humorous">幽默风趣</option>
                  <option value="Inspirational">励志情感</option>
                  <option value="Casual">轻松日常</option>
                </select>
              </div>

              {/* Advanced Fields */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">高级选项 (可选)</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">目标受众</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="例如：大学生、职场新人"
                      value={formData.target_audience}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">变现目标</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="例如：售卖课程、接广告"
                      value={formData.monetization}
                      onChange={(e) => setFormData({ ...formData, monetization: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">合规/禁区</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="例如：不涉及政治、不承诺收益"
                      value={formData.constraints}
                      onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 mt-4 font-medium"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'AI 正在思考中...' : '生成 IP 定位策略'}
              </button>
            </form>
          </div>

          {/* History List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
               <History className="w-4 h-4" />
               历史版本
             </h3>
             {loadingHistory ? (
               <div className="text-center py-4 text-gray-400 text-sm">加载中...</div>
             ) : (
               <div className="space-y-2 max-h-60 overflow-y-auto">
                 {history.map(item => (
                   <button
                     key={item.id}
                     onClick={() => handleLoadHistoryItem(item.id)}
                     className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${
                       result?.id === item.id 
                         ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                         : 'border-gray-100 hover:bg-gray-50 text-gray-600'
                     }`}
                   >
                     <div className="font-medium truncate">{item.positioning_one_liner || "未命名定位"}</div>
                     <div className="text-xs text-gray-400 mt-1">
                       {new Date(item.created_at).toLocaleString()}
                     </div>
                   </button>
                 ))}
                 {history.length === 0 && (
                   <div className="text-center py-4 text-gray-400 text-xs">暂无历史记录</div>
                 )}
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Result Display (8 cols) */}
        <div className="lg:col-span-8">
          {displayData ? (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative group">
                <div className="absolute top-4 right-4 flex gap-2">
                   {isEditing ? (
                     <>
                       <button onClick={handleSave} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg backdrop-blur-sm transition-colors" title="保存">
                         <Save className="w-5 h-5 text-white" />
                       </button>
                       <button onClick={handleCancel} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg backdrop-blur-sm transition-colors" title="取消">
                         <X className="w-5 h-5 text-white" />
                       </button>
                     </>
                   ) : (
                     <button onClick={() => setIsEditing(true)} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100" title="编辑">
                       <Edit3 className="w-5 h-5 text-white" />
                     </button>
                   )}
                </div>

                <div className="text-indigo-100 text-sm font-medium mb-2 uppercase tracking-wider">核心定位 (One-Liner)</div>
                {isEditing ? (
                  <textarea 
                    className="w-full bg-white/10 border border-white/30 rounded p-2 text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 outline-none"
                    value={displayData.positioning_one_liner}
                    onChange={e => setEditData({...editData!, positioning_one_liner: e.target.value})}
                    rows={2}
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                    {displayData.positioning_one_liner}
                  </h1>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                   {displayData.differentiation.map((tag, idx) => (
                     <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                       {isEditing ? (
                         <input 
                           className="bg-transparent border-b border-white/30 w-20 text-center outline-none focus:border-white"
                           value={tag}
                           onChange={e => {
                             const newDiff = [...editData!.differentiation];
                             newDiff[idx] = e.target.value;
                             setEditData({...editData!, differentiation: newDiff});
                           }}
                         />
                       ) : tag}
                     </span>
                   ))}
                </div>
              </div>

              {/* Alerts & Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Confidence Note */}
                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                   <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                   <div>
                     <h4 className="text-sm font-bold text-blue-800 mb-1">AI 自检报告</h4>
                     <p className="text-sm text-blue-700 leading-relaxed">{displayData.confidence_notes}</p>
                   </div>
                 </div>
                 {/* Do Not Say */}
                 <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3">
                   <AlertOctagon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                   <div>
                     <h4 className="text-sm font-bold text-red-800 mb-1">合规禁区 (Do Not Say)</h4>
                     <ul className="text-sm text-red-700 list-disc list-inside">
                       {displayData.do_not_say.map((item, idx) => (
                         <li key={idx}>{item}</li>
                       ))}
                     </ul>
                   </div>
                 </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Audience Profiles */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" /> 目标受众画像
                  </h3>
                  <div className="space-y-4">
                    {displayData.audience_profiles.map((aud, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-bold text-gray-900 mb-2">
                          {isEditing ? (
                             <input 
                               className="bg-white border border-gray-300 rounded px-2 py-1 w-full"
                               value={aud.name}
                               onChange={e => {
                                 const newAud = [...editData!.audience_profiles];
                                 newAud[idx] = {...newAud[idx], name: e.target.value};
                                 setEditData({...editData!, audience_profiles: newAud});
                               }}
                             />
                          ) : aud.name}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500 font-medium">痛点: </span>
                            <span className="text-gray-700">{aud.pain_points.join(", ")}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-medium">触发点: </span>
                            <span className="text-gray-700">{aud.triggers.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Pillars */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-500" /> 内容栏目规划
                  </h3>
                  <div className="space-y-4">
                    {displayData.content_pillars.map((pillar, idx) => (
                      <div key={idx} className="border-l-4 border-purple-500 pl-4 py-1">
                        <div className="font-bold text-gray-900">
                          {isEditing ? (
                             <input 
                               className="bg-white border border-gray-300 rounded px-2 py-1 w-full"
                               value={pillar.pillar}
                               onChange={e => {
                                 const newPillars = [...editData!.content_pillars];
                                 newPillars[idx] = {...newPillars[idx], pillar: e.target.value};
                                 setEditData({...editData!, content_pillars: newPillars});
                               }}
                             />
                          ) : pillar.pillar}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {pillar.topics.join(" · ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Monetization & Samples */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">变现路径</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品/服务</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格区间</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">行动号召 (CTA)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayData.monetization_path.map((path, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{path.offer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{path.price_hint || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{path.cta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-gray-800 mb-3">参考标题 (10条)</h3>
                   <ul className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                     {displayData.sample_titles.slice(0, 10).map((t, i) => <li key={i}>{t}</li>)}
                   </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-gray-800 mb-3">爆款开头 (Hooks)</h3>
                   <ul className="space-y-2">
                     {displayData.sample_hooks.map((h, i) => (
                       <li key={i} className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                         "{h}"
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border-2 border-dashed border-gray-100">
              <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <Loader2 className="w-8 h-8 text-indigo-400" /> 
              </div>
              <p className="text-lg font-medium text-gray-500">等待生成策略</p>
              <p className="text-sm mt-2 max-w-xs text-center">
                请在左侧填写您的信息，点击生成按钮，AI 将为您定制专属 IP 定位方案。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IPPositioning;
