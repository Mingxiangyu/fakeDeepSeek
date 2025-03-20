import { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import InputBar from './InputBar';
import Tutorial from './Tutorial';
import WelcomeScreen from './WelcomeScreen';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  loading?: boolean;
  deepThinking?: string; // 添加深度思考内容属性
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  tutorialStep: number;
  setTutorialStep: React.Dispatch<React.SetStateAction<number>>;
  showTutorial: boolean;
  setShowTutorial: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInterface = ({
  messages,
  setMessages,
  tutorialStep,
  setTutorialStep,
  showTutorial,
  setShowTutorial
}: ChatInterfaceProps) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const menuRef = useRef<HTMLImageElement>(null);
  const [inputText, setInputText] = useState('');
  const [modelType, setModelType] = useState<'thinking' | 'search'>('thinking');
  const [conversationTitle, setConversationTitle] = useState<string>('新对话');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Update the conversation title based on user's first message
    if (conversationTitle === '新对话' && messages.length === 0) {
      setConversationTitle(inputText.length > 15 ? inputText.substring(0, 15) + '...' : inputText);
    }

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: inputText }];
    setMessages(newMessages);

    // Start AI typing
    setIsTyping(true);

    // Add placeholder for AI message that's loading
    setTimeout(() => {
      setMessages([...newMessages, {
        role: 'assistant' as const,
        content: '',
        timestamp: Date.now(),
        loading: true
      }]);

      // Simulate AI response after a delay
      setTimeout(() => {
        const responseTime = Math.floor(Math.random() * 10) + 5; // Random time between 5-15 seconds

        setMessages(prev => {
          const updatedMessages = [...prev];
          // Replace the last message (which is loading) with the complete response
          if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].loading) {
            // Generate response based on input
            let aiResponse = '';

            if (inputText.includes('努力') || inputText.includes('得到')) {
              if (inputText.includes('付出') && inputText.includes('关系')) {
                aiResponse = '首先，我们需要明确 "付出" 和 "得到" 的定义。付出通常指的是时间、精力、资源等我们投入的人、事物和问题处理过程中所付出的时间或资源。接着，我们可以从不同角度分析这个关系。首先，付出与得到之间往往是存在正比的，投入越多，得到的回报可能也越大。这可以体现在职业发展中，比如努力工作的人通常会获得更多的加薪、升职。付出不一定总是直接对应于得到，但在长期看来，付出可能会以各种形式的回报，如知识积累、经验提升、技能向上等。即使是表面上没有回报，但从长远来看，知识积累和个人能力提升是宝贵的财富。"播种" 的过程必然需要付出时间，得到的收获也可能在人际关系上呈现。最后，我们可以总结出，付出和得到之间的关系是密切但复杂的，付出并不一定会立即得到回报，所有的努力和投资都会为了被收获种种无形式的回报。因此，付出最终会得到回报，所有的努力和投资都会有所得。';
              } else {
                aiResponse = '在探讨 "努力后能得到什么?" 时，我们可以从多个角度进行分析。首先，努力通常带来技能的提升，无论是在学业、职业还是兴趣爱好中。持续的努力让我们积累经验，增强能力，形成竞争优势。其次，努力能带来成果与成就感，通过克服挑战，我们不仅收获了具体的成果，如考试高分、升职加薪等，同时也培养了坚韧精神和自我满足感。再者，努力促进人际关系的建立，积极向上的态度和努力的精神常常吸引志同道合的人，形成良好的人际网络，这对个人发展至关重要。最后，努力也有助于塑造个性与价值观。通过面对挑战，我们学会了坚持、耐心以及应对挫折的能力，这些品质在生活中不可或缺。综合以上观点，努力的结果不仅限于物质方面，更在于个人成长和内心的充实。总之，所有这些努力汇聚成一个简单的结论：得到的，努力后能得到的是个人成长和内心的充实。';
              }
            } else if (inputText === '1111') {
              aiResponse = '首先，我们需要理解 "1111" 这个数字的含义和可能的上下文。它可能是一个数字，象征特定的事物，或者是某种代码。接着，我们探索 "1111" 在不同领域的应用，比如数学、计算机科学等。在数学上，1111是一个四位数，可以进行不同的数术运算。我们可以考虑的因数、质因数分解或者其他数学关系。比如，1111 = 11 × 101，可能暗示着某些数学性质或具有特殊性。此外，在计算机学的领域，1111可以被视为二进制数（在特定情况下）或者是某种数据格式的标识符。在这些情况下，1111可能具有特殊的算法或数据处理中的意义。最后，我们也要考虑文化和符号学的层面，比如在某些文化中，数字1111可能有特殊含义或者具有特殊的象征意义。通过以上的分析，我们综合考虑了数学、计算机科学和文化的不同角度，虽然具体含义依赖于上下文。得到的结论是：1111在数学、计算机科学和文化中都有其特殊的意义和应用。';
            } else if (inputText.includes('付出') && inputText.includes('关系')) {
              aiResponse = '首先，我们需要明确 "付出" 和 "得到" 的定义。付出通常指的是时间、精力、资源等我们投入的人、事物和问题处理过程中所付出的时间或资源。接着，我们可以从不同角度分析这个关系。首先，付出与得到之间往往是存在正比的，投入越多，得到的回报可能也越大。这可以体现在职业发展中，比如努力工作的人通常会获得更多的加薪、升职。付出不一定总是直接对应于得到，但在长期看来，付出可能会以各种形式的回报，如知识积累、经验提升、技能向上等。即使是表面上没有回报，但从长远来看，知识积累和个人能力提升是宝贵的财富。"播种" 的过程必然需要付出时间，得到的收获也可能在人际关系上呈现。最后，我们可以总结出，付出和得到之间的关系是密切但复杂的，付出并不一定会立即得到回报，所有的努力和投资都会为了被收获种种无形式的回报。因此，付出最终会得到回报，所有的努力和投资都会有所得。';
            } else {
              aiResponse = `这是使用 ${modelType === 'thinking' ? '深度思考 (R1)' : '联网搜索'} 模式的回复。您的问题是："${inputText}"。这里给出一个详细的回答...`;
            }

            updatedMessages[updatedMessages.length - 1] = {
              role: 'assistant',
              content: aiResponse,
              timestamp: Date.now(),
              loading: false,
              deepThinking: `这个是回答`
            };
          }
          return updatedMessages;
        });

        setIsTyping(false);
      }, 2000);
    }, 500);

    setInputText('');
  };

  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };

  const handleClearChat = () => {
    setMessages([]);
    setConversationTitle('新对话');
  };

  const toggleModelType = (type: 'thinking' | 'search') => {
    setModelType(type);
  };

  const getUserMessageTitle = () => {
    const userMessage = messages.find(msg => msg.role === 'user');
    if (userMessage && userMessage.content) {
      return userMessage.content.length > 10 ?
        userMessage.content.substring(0, 10) + '...' :
        userMessage.content;
    }
    return '新对话';
  };

  useEffect(() => {
    if (tutorialStep === 1 && showTutorial) {
      setShowSettingsMenu(true);
    } else {
      setShowSettingsMenu(false);
    }
  }, [tutorialStep, showTutorial]);

  return (
    <div id="chat-box" className="bg-white flex flex-col h-full md:w-[390px] md:h-[844px] md:scale-95 md:border md:shadow-xl">
      <header className="flex justify-between items-center px-4 py-[10px] border-b border-gray-100">
        <div className="w-6">
          <img
            id="menu"
            ref={menuRef}
            src="https://ext.same-assets.com/1993817417/2709286257.svg+xml"
            alt="menu"
            className="size-6 cursor-pointer select-none"
            onClick={toggleSettingsMenu}
          />
        </div>
        <div className="flex-grow text-center">
          <span className="font-semibold text-base">{getUserMessageTitle()}</span>
        </div>
        <div className="w-6">
          <img
            id="clear"
            src="https://ext.same-assets.com/3447434256/3104943959.svg+xml"
            alt="new-chat"
            className="size-6 cursor-pointer select-none"
            onClick={handleClearChat}
          />
        </div>
      </header>

      <main className="my-2 h-[calc(100vh-40px-112px)] overflow-y-auto">
        {messages.length > 0 ? (
          <MessageList messages={messages} />
        ) : (
          <WelcomeScreen />
        )}
      </main>

      <InputBar
        inputText={inputText}
        setInputText={setInputText}
        onSendMessage={handleSendMessage}
        modelType={modelType}
        toggleModelType={toggleModelType}
        isTyping={isTyping}
      />

      {showTutorial && tutorialStep === 1 && (
        <Tutorial
          step={tutorialStep}
          setStep={setTutorialStep}
          totalSteps={4}
          targetRef={menuRef}
          title="设置菜单"
          description="点击这里可以设置 AI 助手的回答问题"
          onClose={() => setShowTutorial(false)}
        />
      )}

      {showSettingsMenu && !showTutorial && (
        <div className="absolute top-[50px] left-[20px] bg-white p-4 rounded-md shadow-lg z-10">
          <h3 className="font-semibold mb-2">设置菜单</h3>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">修改用户名</li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">调整模型参数</li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">更改主题</li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">重新开始教程</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
