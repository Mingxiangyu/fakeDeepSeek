import React from 'react';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col justify-center items-center h-full gap-4 px-8 select-none">
        <img
          src="https://ext.same-assets.com/4008935861/148238700.svg+xml"
          alt="AI Logo"
          className="w-16 h-16 text-[#4D6BFE]"
        />
        <span className="text-xl font-semibold text-center">
          嗨！我是 AI 助手
        </span>
        <p className="text-center text-gray-500 text-sm">
          我可以帮你搜索、答疑、写作，请把你的任务交给我吧～
        </p>
        <div className="mt-4 w-full px-4">
          <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-700">
            你觉得努力后能得到什么？
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
