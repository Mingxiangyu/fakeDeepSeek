import React, { useState } from 'react';

interface QuestionFormProps {
  onSubmit?: (question: string, aiResponse: string, deepThinking: string) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [deepThinking, setDeepThinking] = useState('');
  const [autoDeepThinking, setAutoDeepThinking] = useState(false);
  const [deepThinkingCount, setDeepThinkingCount] = useState(0);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(question, aiResponse, deepThinking);
    }
  };

  const handlePreview = () => {
    // 预览功能实现
    console.log('预览效果');
  };

  const handleShare = () => {
    // 分享功能实现
    console.log('生成高清分享图');
  };

  return (
    <div className="bg-white flex flex-col h-full md:w-[390px] md:h-[844px] md:scale-95 md:border md:shadow-xl">
      <div className="p-4 flex flex-col h-full">
        {/* 标题 */}
        <h2 className="text-lg font-medium mb-4">提出问题</h2>
        
        {/* 问题输入 */}
        <div className="mb-4">
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="输入你想要提的问题"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        {/* AI 回答 */}
        <div className="mb-4">
          <h3 className="text-gray-500 mb-2">AI 回答</h3>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="输入你想要生成的回答内容"
            rows={6}
            value={aiResponse}
            onChange={(e) => setAiResponse(e.target.value)}
          />
        </div>

        {/* 自动生成深度思考 */}
        <div className="flex items-center mb-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={autoDeepThinking}
                onChange={() => setAutoDeepThinking(!autoDeepThinking)}
              />
              <div className={`block w-10 h-6 rounded-full ${autoDeepThinking ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoDeepThinking ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-2 text-sm font-medium">自动生成深度思考 ({deepThinkingCount}次)</span>
          </label>
          <button className="ml-auto text-blue-500 text-sm font-medium px-4 py-1 rounded-full bg-blue-50">
            分享群聊获取次数
          </button>
        </div>

        {/* 深度思考内容 */}
        <div className="mb-4">
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="输入你想要深度思考的内容，必填"
            rows={6}
            value={deepThinking}
            onChange={(e) => setDeepThinking(e.target.value)}
          />
        </div>

        {/* 按钮区域 */}
        <div className="mt-auto flex gap-4">
          <button
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium"
            onClick={handlePreview}
          >
            预览效果
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-medium"
            onClick={handleShare}
          >
            生成高清分享图
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-[#4D6BFE] text-white font-medium"
            onClick={handleSubmit}
            disabled={!question.trim() || !deepThinking.trim()}
          >
            提交到对话
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;