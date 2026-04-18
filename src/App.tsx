import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, Crosshair, Anchor, Medal } from 'lucide-react';
import { COMMANDERS, QUESTIONS, Question, Commander, Vector } from './data';

export default function App() {
  const [appState, setAppState] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userVector, setUserVector] = useState<Vector>([0, 0, 0, 0, 0]);
  const [answerHistory, setAnswerHistory] = useState<Vector[]>([]);
  const [matchedCommander, setMatchedCommander] = useState<Commander | null>(null);
  const [normalizedVector, setNormalizedVector] = useState<Vector>([0, 0, 0, 0, 0]);

  const startQuiz = () => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 15);
    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setUserVector([0, 0, 0, 0, 0]);
    setAnswerHistory([]);
    setAppState('quiz');
  };

  const handleAnswer = (delta: Vector) => {
    const newVector = userVector.map((v, i) => v + delta[i]) as Vector;
    setAnswerHistory([...answerHistory, delta]);
    
    if (currentIndex < quizQuestions.length - 1) {
      setUserVector(newVector);
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateResult(newVector);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const lastDelta = answerHistory[answerHistory.length - 1];
      const newVector = userVector.map((v, i) => v - lastDelta[i]) as Vector;
      setUserVector(newVector);
      setAnswerHistory(answerHistory.slice(0, -1));
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateResult = (finalVector: Vector) => {
    // Normalize user vector to 1-10 range to match commanders
    const minVal = Math.min(...finalVector);
    const maxVal = Math.max(...finalVector);
    
    let normalized: Vector;
    if (maxVal === minVal) {
      normalized = [5, 5, 5, 5, 5];
    } else {
      normalized = finalVector.map(v => 
        ((v - minVal) / (maxVal - minVal)) * 9 + 1
      ) as Vector;
    }
    
    setNormalizedVector(normalized);

    // Calculate Euclidean distance
    let bestMatch = COMMANDERS[0];
    let minDistance = Infinity;

    COMMANDERS.forEach(cmd => {
      let distSq = 0;
      for (let i = 0; i < 5; i++) {
        distSq += Math.pow(normalized[i] - cmd.vector[i], 2);
      }
      const dist = Math.sqrt(distSq);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = cmd;
      }
    });

    setMatchedCommander(bestMatch);
    setAppState('result');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden p-4 md:p-8 flex flex-col pt-12 md:pt-20 items-center selection:bg-sky-900 selection:text-sky-100 pb-20">
      <div className="crt-overlay"></div>
      
      <div className="w-full max-w-3xl z-10 w-full relative">
        <header className="mb-10 text-center border-b border-[#38bdf8] opacity-80 pb-4">
          <h1 className="text-2xl md:text-4xl font-bold tracking-widest text-[#38bdf8] flex items-center justify-center gap-3">
            <Anchor className="w-6 h-6 md:w-8 md:h-8 animate-pulse" />
            太平洋战争终端
            <Anchor className="w-6 h-6 md:w-8 md:h-8 animate-pulse" />
          </h1>
          <p className="text-xs md:text-sm mt-2 opacity-70 tracking-widest">海军统帅匹配协议 v1.0</p>
        </header>

        <main className="min-h-[60vh] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {appState === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1a1a1b] border border-[#38bdf8]/30 shadow-[0_0_15px_rgba(56,189,248,0.15)] p-6 md:p-10"
              >
                <div className="flex items-center mb-6 gap-3 text-[#38bdf8]">
                  <Radar className="w-8 h-8 animate-[spin_4s_linear_infinite]" />
                  <h2 className="text-xl md:text-2xl font-bold uppercase">系统初始化中... (System Init...)</h2>
                </div>
                <div className="space-y-4 text-sm md:text-base opacity-90 leading-relaxed mb-8">
                  <p>&gt; 警告：最高绝密级心理评估。 (HIGHLY CLASSIFIED PSYCHOLOGICAL EVALUATION.)</p>
                  <p>&gt; 本测试由太平洋战争真实战役数据生成的 15 道战术情境组成。</p>
                  <p>&gt; 你的抉择将在5个维度上刻画你的统帅侧写：进攻、理性、冒险、理想、正统。</p>
                  <p className="text-[#ef4444] animate-pulse">&gt; 部署在即。是否继续？ (DEPLOYMENT IMMINENT. PROCEED?)</p>
                </div>
                <button
                  onClick={startQuiz}
                  className="btn-radar w-full py-4 bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8] font-bold tracking-widest uppercase transition-all"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Crosshair className="w-5 h-5" /> 接受指挥权 (ACCEPT COMMAND)
                  </span>
                </button>
              </motion.div>
            )}

            {appState === 'quiz' && quizQuestions.length > 0 && (
              <motion.div
                key={`question-${currentIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#1a1a1b] border border-[#38bdf8]/30 p-6 md:p-10 shadow-[0_0_20px_rgba(56,189,248,0.1)] focus:outline-none"
              >
                <div className="flex justify-between items-center border-b border-[#38bdf8]/30 pb-3 mb-6 text-xs md:text-sm text-[#38bdf8]">
                  <div className="flex items-center gap-4">
                    {currentIndex > 0 && (
                      <button 
                        onClick={handleBack} 
                        className="hover:text-white transition-colors flex items-center gap-1 bg-[#38bdf8]/10 px-2 py-1 rounded"
                      >
                        ← 上一题
                      </button>
                    )}
                    <span>intercept_log_ref_{String(currentIndex + 1).padStart(2, '0')}</span>
                  </div>
                  <span>SEQ: {currentIndex + 1} / 15</span>
                </div>
                
                <h3 className="text-lg md:text-xl mb-8 leading-relaxed font-semibold min-h-[5rem]">
                  <span className="text-[#ef4444] mr-2">SYS.REQ:</span> 
                  {quizQuestions[currentIndex].text}
                </h3>
                
                <div className="space-y-4 flex flex-col">
                  {quizQuestions[currentIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt.delta)}
                      className="group relative text-left w-full p-4 border border-zinc-700 hover:border-[#38bdf8] bg-black/40 hover:bg-[#38bdf8]/10 transition-all focus:outline-none focus:ring-1 focus:ring-[#38bdf8]"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#38bdf8] scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                      <span className="text-[#38bdf8] mr-3 font-bold opacity-50 group-hover:opacity-100">{'ABC'[idx]}.</span>
                      <span className="text-sm md:text-base">{opt.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {appState === 'result' && matchedCommander && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1a1b] border border-[#38bdf8] p-6 md:p-10 shadow-[0_0_30px_rgba(56,189,248,0.2)]"
              >
                <div className="flex justify-center mb-6">
                  <Medal className="w-16 h-16 text-[#ef4444] animate-pulse" />
                </div>
                
                <div className="text-center mb-8">
                  <p className="text-xs uppercase tracking-widest text-[#38bdf8] mb-2">身份确认 (IDENTIFICATION CONFIRMED)</p>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{matchedCommander.name}</h2>
                  <p className="text-sm text-zinc-400">阵营 (FACTION): {matchedCommander.faction}</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                  <div className="w-full md:w-1/2 flex justify-center border border-zinc-800 bg-black/50 p-4">
                    <RadarChart userVector={normalizedVector} commanderVector={matchedCommander.vector} />
                  </div>
                  
                  <div className="w-full md:w-1/2 flex flex-col justify-center h-full space-y-4 text-sm md:text-base">
                    <div className="border-l-2 border-[#38bdf8] pl-4">
                      <p className="text-[#38bdf8] text-xs font-bold mb-1">将领档案 (COMMANDER PROFILE):</p>
                      <p className="opacity-90 leading-relaxed text-zinc-300">
                        {matchedCommander.description}
                      </p>
                    </div>

                    <div className="border-l-2 border-[#ef4444] pl-4">
                      <p className="text-[#ef4444] text-xs font-bold mb-1">历史评价 (HISTORICAL EVALUATION):</p>
                      <p className="italic opacity-90 leading-relaxed text-zinc-300">
                        "{matchedCommander.evaluation}"
                      </p>
                    </div>
                    
                    <div className="border border-zinc-800 p-4 mt-4 text-xs font-mono text-zinc-400">
                      <p className="mb-2 text-[#38bdf8]">雷达分析数据 (VECTOR DATA):</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div><span className="text-zinc-500">进攻 (AGG):</span> {normalizedVector[0].toFixed(1)} / {matchedCommander.vector[0]}</div>
                        <div><span className="text-zinc-500">理性 (RAT):</span> {normalizedVector[1].toFixed(1)} / {matchedCommander.vector[1]}</div>
                        <div><span className="text-zinc-500">冒险 (RSK):</span> {normalizedVector[2].toFixed(1)} / {matchedCommander.vector[2]}</div>
                        <div><span className="text-zinc-500">理想 (IDL):</span> {normalizedVector[3].toFixed(1)} / {matchedCommander.vector[3]}</div>
                        <div><span className="text-zinc-500">正统 (ORT):</span> {normalizedVector[4].toFixed(1)} / {matchedCommander.vector[4]}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startQuiz}
                  className="w-full p-4 mt-4 bg-transparent border border-zinc-600 text-zinc-400 hover:border-[#38bdf8] hover:text-[#38bdf8] uppercase tracking-widest text-sm transition-colors"
                >
                  重启终端 (REBOOT SYSTEM)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-12 mb-4 text-center text-[10px] md:text-xs text-zinc-600 font-mono opacity-60">
          <p>免责声明：本系统界面、题库、算法模型及历史文本均由 Google Gemini 主导生成。</p>
          <p>仅供历史军事爱好者娱乐与推演参考，不代表任何官方政治立场或严肃学术定论。</p>
        </footer>
      </div>
    </div>
  );
}

function RadarChart({ userVector, commanderVector }: { userVector: Vector, commanderVector: Vector }) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - 30; // padding

  const labels = ['进攻 Aggression', '理性 Rationality', '冒险 Risk', '理想 Idealism', '正统 Orthodoxy'];
  
  // Calculate polygon points based on vector (1-10 mapped to 0-maxRadius)
  const getPoints = (vec: Vector) => {
    return vec.map((val, i) => {
      // Mapping value 1-10 to radius ratio 0-1 (roughly, let's map 0-10)
      const ratio = val / 10;
      const r = maxRadius * ratio;
      // Start at top (-90 degrees)
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
  };

  // Generate grid backgrounds (pentagons)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = gridLevels.map(level => {
    return Array.from({ length: 5 }).map((_, i) => {
      const r = maxRadius * level;
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Grid */}
      {gridPolygons.map((points, i) => (
        <polygon key={i} points={points} fill="none" stroke="#333" strokeWidth="1" strokeDasharray="4 4" />
      ))}

      {/* Axis Lines */}
      {labels.map((_, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const x2 = cx + maxRadius * Math.cos(angle);
        const y2 = cy + maxRadius * Math.sin(angle);
        return <line key={`axis-${i}`} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#333" strokeWidth="1" />;
      })}

      {/* Labels */}
      {labels.map((label, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        // slightly further out
        const r = maxRadius + 15; 
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        
        let anchor = "middle";
        if (Math.cos(angle) > 0.1) anchor = "start";
        if (Math.cos(angle) < -0.1) anchor = "end";

        // adjust spacing
        const xPad = Math.cos(angle) > 0.1 ? 5 : Math.cos(angle) < -0.1 ? -5 : 0;
        const yPad = Math.sin(angle) > 0.1 ? 10 : Math.sin(angle) < -0.1 ? -5 : 5;

        return (
          <text 
            key={label}
            x={x + xPad} 
            y={y + yPad} 
            fontSize="10" 
            fill="#a1a1aa" 
            textAnchor={anchor}
            className="font-mono tracking-tighter"
          >
            {label}
          </text>
        );
      })}

      {/* Commander Polygon (Target) - faint */}
      <polygon 
        points={getPoints(commanderVector)} 
        fill="rgba(239, 68, 68, 0.1)" 
        stroke="#ef4444" 
        strokeWidth="1.5" 
        strokeDasharray="2 2"
      />

      {/* User Polygon - active */}
      <polygon 
        points={getPoints(userVector)} 
        fill="rgba(56, 189, 248, 0.3)" 
        stroke="#38bdf8" 
        strokeWidth="2"
        filter="url(#glow)"
      />
      
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2" fill="#38bdf8" />
    </svg>
  );
}

