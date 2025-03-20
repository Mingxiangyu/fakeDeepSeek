import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import QuestionForm from './components/QuestionForm';
import './App.css';

// Message type
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  loading?: boolean;
  deepThinking?: string; // 添加深度思考内容属性
}

// Pre-defined example conversations
const exampleConversations: Record<string, Message[]> = {
  '努力': [
    { role: 'user', content: '你觉得努力后能得到什么？' },
    {
      role: 'assistant',
      content: '在探讨 "努力后能得到什么?" 时，我们可以从多个角度进行分析。首先，努力通常带来技能的提升，无论是在学业、职业还是兴趣爱好中。持续的努力让我们积累经验，增强能力，形成竞争优势。其次，努力能带来成果与成就感，通过克服挑战，我们不仅收获了具体的成果，如考试高分、升职加薪等，同时也培养了坚韧精神和自我满足感。再者，努力促进人际关系的建立，积极向上的态度和努力的精神常常吸引志同道合的人，形成良好的人际网络，这对个人发展至关重要。最后，努力也有助于塑造个性与价值观。通过面对挑战，我们学会了坚持、耐心以及应对挫折的能力，这些品质生活在生活中不可或缺。综合以上观点，努力的结果不仅限于物质方面，更在于个人成长和内心的充实。总之，所有这些努力汇聚成一个简单的结论：得到的，努力后能得到的是个人成长和内心的充实。',
      timestamp: Date.now() - 15000
    }
  ],
  '1111': [
    { role: 'user', content: '1111' },
    {
      role: 'assistant',
      content: '这是使用 深度思考 (R1) 模式的回复。您的问题是："1111"。这里给出一个详细的回答...',
      timestamp: Date.now() - 1000
    }
  ],
  '摄像头': [
    { role: 'user', content: '摄像头' },
    {
      role: 'assistant',
      content: '这是使用 深度思考 (R1) 模式的回复。您的问题是："摄像头"。这里给出一个详细的回答...\n\n摄像头是一种能够捕捉视频图像的设备，它广泛应用于各种场景，如安防监控、视频会议、直播、计算机和移动设备等。现代摄像头通常具有高清分辨率、自动对焦、低光性能和图像稳定等功能，有些还支持特殊功能如面部识别和运动检测。\n\n随着技术的发展，摄像头的应用越来越广泛，不仅仅限于传统的监控和拍摄，还延伸到了人工智能、虚拟现实和增强现实等领域。同时，随着隐私保护意识的增强，摄像头的使用也引发了相关的伦理和法律讨论。',
      timestamp: Date.now() - 10000
    }
  ],
  '付出和得到': [
    { role: 'user', content: '你认为付出和得到之间的关系是什么?' },
    {
      role: 'assistant',
      content: '首先，我们需要明确 "付出" 和 "得到" 的定义。付出通常指的是时间、精力、资源等我们投入的人、事物和问题处理过程中所付出的时间或资源。接着，我们可以从不同角度分析这个关系。首先，付出与得到之间往往是存在正比的，投入越多，得到的回报可能也越大。这可以体现在职业发展中，比如努力工作的人通常会获得更多的加薪、升职。付出不一定总是直接对应于得到，但在长期看来，付出可能会以各种形式的回报，如知识积累、经验提升、技能向上等。即使是表面上没有回报，但从长远来看，知识积累和个人能力提升是宝贵的财富。"播种" 的过程必然需要付出时间，得到的收获也可能在人际关系上呈现。最后，我们可以总结出，付出和得到之间的关系是密切但复杂的，付出并不一定会立即得到回报，所有的努力和投资都会为了被收获种种无形式的回报。因此，付出最终会得到回报，所有的努力和投资都会有所得。',
      timestamp: Date.now() - 20000
    }
  ],
  '测试': [
    { role: 'user', content: '测试' },
    {
      role: 'assistant',
      content: '好的，用户发来了"测试"，看起来他们可能是在测试这个系统是否正常工作。首先，我需要确认他们的意图。可能他们刚接触这个平台，想看看回复功能是否正常，或者想了解我的能力范围。这时候，我应该给出一个友好且信息丰富的回应，让他们知道我已经准备好帮助解决问题了。\n\n接下来，我应该考虑是否需要进一步询问用户的具体需求。如果他们只是简单的测试，可能不需要深入追问，但如果有潜在的问题，主动提供帮助会更贴心。同时，要注意用简洁明了的语言，避免复杂术语，让用户感到轻松。\n\n另外，用户可能对不同的主题感兴趣，比如技术支持、日常建议或学习帮助，所以可以列举一些常见领域，引导他们明确需求。这样既展示了我的功能，又帮助他们找到具体方向。\n\n最后，保持语气友好和鼓励，让用户感到欢迎，随时可以提出更多问题。确保回应结构清晰，分点说明，但不过于冗长，保持自然流畅。\n\n你好！看起来你在进行测试，不过有什么我可以帮助你的吗？无论是解答问题、提供建议，还是其他需求，我都在这里哦！如果有具体主题或疑问，随时告诉我。😊',
      timestamp: Date.now() - 11000
    }
  ]
};

function App() {
  const [tutorialStep, setTutorialStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  // Check URL parameters for pre-defined conversation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scenario = params.get('scenario');
    const form = params.get('form');

    if (scenario && exampleConversations[scenario]) {
      setMessages(exampleConversations[scenario]);
    }

    if (form === 'true') {
      setShowQuestionForm(true);
    }
  }, []);

  const handleQuestionSubmit = (question: string, aiResponse: string, deepThinking: string) => {
    // 创建用户消息和AI回复消息
    const userMessage: Message = { role: 'user', content: question };
    const assistantMessage: Message = { 
      role: 'assistant', 
      content: deepThinking, 
      timestamp: Date.now(),
      deepThinking: aiResponse // 添加普通AI回答作为deepThinking属性
    };
    
    // 将消息添加到聊天界面
    setMessages([userMessage, assistantMessage]);
    
    // 切换回聊天界面
    setShowQuestionForm(false);
  };

  return (
    <div className="w-full h-full md:flex md:flex-col md:justify-center md:items-center md:bg-slate-50">
      <h1 className="hidden text-4xl font-bold tracking-tighter mb-2 md:block md:text-4xl lg:text-4xl xl:text-5xl md:mb-3 lg:mb-4 xl:mb-5 text-[#4D6BFE]">
        <span className="relative inline-flex overflow-hidden">
          AI 对话助手
          <span className="pointer-events-none absolute inset-0 mix-blend-lighten dark:mix-blend-darken">
            <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]"></span>
            <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]"></span>
          </span>
        </span>
      </h1>

      {showQuestionForm ? (
        <QuestionForm onSubmit={handleQuestionSubmit} />
      ) : (
        <ChatInterface
          messages={messages}
          setMessages={setMessages}
          tutorialStep={tutorialStep}
          setTutorialStep={setTutorialStep}
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
        />
      )}

      <div className="hidden md:flex md:gap-4 text-sm text-[#4D6BFE] font-semibold mt-4">
        <button 
          onClick={() => setShowQuestionForm(!showQuestionForm)}
          className="px-4 py-2 rounded-lg bg-[#E1F2FF] hover:bg-[#c9e7ff] transition-colors"
        >
          {showQuestionForm ? '返回聊天' : '创建提问'}
        </button>
        <div>仅供个人学习研究和交流讨论，请合理使用</div>
      </div>
    </div>
  );
}

export default App;
