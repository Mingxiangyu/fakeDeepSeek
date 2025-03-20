import React from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  closing?: string; // Optional closing text in a different style
  timestamp?: number;
  loading?: boolean;
  deepThinking?: string; // 深度思考内容
};

type MessageListProps = {
  messages: Message[];
};

// Helper function to split content into formal and casual parts if needed
const processMessageContent = (content: string): { mainContent: string, casualClosing: string | null } => {
  // If the content contains a line starting with "你好!" or similar greeting patterns
  const closingPatterns = [
    /(?:\n|^)你好[!！]/,
    /(?:\n|^)您好[!！]/,
    /(?:\n|^)嗨[!！]/,
    /(?:\n|^)哈[!！]/
  ];

  let splitIndex = -1;
  for (const pattern of closingPatterns) {
    const match = content.match(pattern);
    if (match && match.index !== undefined) {
      splitIndex = match.index;
      break;
    }
  }

  if (splitIndex !== -1) {
    return {
      mainContent: content.substring(0, splitIndex).trim(),
      casualClosing: content.substring(splitIndex).trim()
    };
  }

  return {
    mainContent: content,
    casualClosing: null
  };
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  // Calculate response time in seconds
  const getResponseTime = (timestamp?: number) => {
    if (!timestamp) return null;
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    return seconds > 0 ? seconds : 1;
  };

  return (
    <div className="space-y-6 px-4 pt-2 pb-6">
      {messages.map((message, index) => {
        // Process the content to separate formal and casual parts if needed
        const { mainContent, casualClosing } = message.role === 'assistant'
          ? processMessageContent(message.content)
          : { mainContent: message.content, casualClosing: null };

        return (
          <div key={index} className="flex flex-col">
            {/* User Message */}
            {message.role === 'user' && (
              <div className="flex justify-end mb-1 relative">
                {/* Up scroll indicator - only show for long conversations */}
                {index > 0 && index === messages.length - 1 && (
                  <div className="absolute -top-4 right-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="m18 15-6-6-6 6"/>
                    </svg>
                  </div>
                )}
                <div className="max-w-[85%] rounded-2xl py-2 px-4 bg-[#E1F2FF] text-[#333]">
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
              </div>
            )}

            {/* AI Message */}
            {message.role === 'assistant' && (
              <div className="space-y-2">
                {/* Loading state */}
                {message.loading ? (
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1">
                      <img
                        src="https://ext.same-assets.com/895024275/2604857941.svg+xml"
                        alt="DeepSeek Logo"
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex-grow rounded-2xl py-3 px-4 bg-gray-100 text-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#4D6BFE]"></div>
                        <span className="text-gray-600 text-sm">正在思考中...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 深度思考部分 - 显示在气泡上方 */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 pl-6 mb-1 ml-0">
                      <img
                        src="https://ext.same-assets.com/895024275/2604857941.svg+xml"
                        alt="DeepSeek Logo"
                        className="w-4 h-4 mr-1"
                      />
                      <span>已深度思考</span>
                      {message.timestamp && (
                        <span className="whitespace-nowrap">(用时 {getResponseTime(message.timestamp)} 秒)</span>
                      )}
                      <span className="ml-1 cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="inline-block text-gray-400"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </div>

                    {/* 深度思考内容 */}
                    <div className="pl-6">
                      <div className="rounded-2xl py-3 px-4 bg-gray-50 text-gray-700">
                        <div className="whitespace-pre-wrap text-sm font-normal leading-6">
                          {mainContent}
                        </div>
                      </div>
                    </div>

                    {/* 普通AI回答 */}
                    {message.deepThinking && (
                      <div className="pl-6 mt-3">
                        <div className="rounded-2xl py-3 px-4 bg-[#E1F2FF] text-gray-800">
                          <div className="whitespace-pre-wrap text-sm font-normal leading-6">
                            这个是回答
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message Actions */}
                    <div className="flex items-center space-x-3 pl-6 mt-1 text-gray-400">
                      <button className="p-1 hover:text-gray-600" title="复制">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                      <button className="p-1 hover:text-gray-600" title="刷新">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                        </svg>
                      </button>
                      <button className="p-1 hover:text-blue-500" title="点赞">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                      </button>
                      <button className="p-1 hover:text-red-500" title="点踩">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
