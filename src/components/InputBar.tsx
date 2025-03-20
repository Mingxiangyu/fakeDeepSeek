import React from 'react';

interface InputBarProps {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: () => void;
  modelType: 'thinking' | 'search';
  toggleModelType: (type: 'thinking' | 'search') => void;
  isTyping: boolean;
}

const InputBar: React.FC<InputBarProps> = ({
  inputText,
  setInputText,
  onSendMessage,
  modelType,
  toggleModelType,
  isTyping
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <footer className="flex flex-col px-3 gap-2 py-3 bg-white border-t border-gray-100">
      {/* Bottom input area with input field and buttons */}
      <div className="flex flex-col gap-2">
        {/* Message input */}
        <div className="w-full p-[1px] rounded-full bg-gradient-to-b from-gray-200 to-transparent">
          <div className="w-full rounded-full bg-[#F8F8F8] overflow-hidden flex items-center relative">
            <textarea
              className="w-full py-3 px-4 resize-none focus:outline-none min-h-[40px] max-h-[120px] bg-transparent"
              placeholder="发送消息..."
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              style={{
                height: '40px',
                overflowY: inputText.split('\n').length > 1 ? 'auto' : 'hidden'
              }}
            />
          </div>
        </div>

        {/* Model selection and send button */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <div
              className={`rounded-full px-3 py-1 flex gap-1 font-medium items-center cursor-pointer select-none ${
                modelType === 'thinking' ? 'bg-[#E1F2FF]' : 'bg-[#F5F5F5]'
              }`}
              onClick={() => toggleModelType('thinking')}
            >
              <img
                src="https://ext.same-assets.com/2367535983/4044499210.svg+xml"
                alt="r1"
                className="w-4 h-4"
              />
              <span className={`text-sm ${modelType === 'thinking' ? 'text-[#1084FE]' : 'text-gray-600'}`}>
                深度思考 (R1)
              </span>
            </div>
            <div
              className={`rounded-full px-3 py-1 flex gap-1 font-medium items-center cursor-pointer select-none ${
                modelType === 'search' ? 'bg-[#E1F2FF]' : 'bg-[#F5F5F5]'
              }`}
              onClick={() => toggleModelType('search')}
            >
              <img
                src="https://ext.same-assets.com/2657749894/459640554.svg+xml"
                alt="search"
                className="w-4 h-4"
              />
              <span className={`text-sm ${modelType === 'search' ? 'text-[#1084FE]' : 'text-gray-600'}`}>
                联网搜索
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus cursor-pointer text-gray-500"
              id="screenshot"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            <button
              className={`flex items-center justify-center size-8 rounded-full text-white select-none ${
                !isTyping && inputText.trim() ? 'bg-[#4D6BFE] cursor-pointer' : 'bg-[#95C1FF] cursor-not-allowed'
              }`}
              onClick={!isTyping && inputText.trim() ? onSendMessage : undefined}
              disabled={isTyping || !inputText.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-up"
              >
                <path d="m5 12 7-7 7 7"></path>
                <path d="M12 19V5"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Black bar at the bottom for iPhone style */}
      <div className="flex justify-center mt-1">
        <div className="w-1/3 h-1 bg-black rounded-full"></div>
      </div>
    </footer>
  );
};

export default InputBar;
