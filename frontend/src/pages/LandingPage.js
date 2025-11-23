import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';
import { AuthContext } from '../App';

// Text Clip Animation Component
function AnimatedText({ text, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <span ref={ref} className={`text-clip-container ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="text-clip-letter"
          style={{
            animationDelay: isInView ? `${delay + i * 0.03}s` : '0s',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

// Typewriter Effect Component with Infinite Loop - Cycles through multiple texts
function TypewriterText({ texts, className = '', speed = 80, delay = 0, deleteSpeed = 50, pauseTime = 2000 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const mountedRef = useRef(true);
  const timeoutRefs = useRef({ timeoutId: null, startDelayId: null });

  useEffect(() => {
    mountedRef.current = true;
    let currentIndex = 0;
    let isDeletingState = false;
    let textIndex = 0;

    const getCurrentText = () => {
      if (Array.isArray(texts)) {
        return texts[textIndex % texts.length];
      }
      return texts;
    };

    const typeNextChar = () => {
      if (!mountedRef.current) return;
      
      const currentText = getCurrentText();
      
      if (!isDeletingState) {
        // Typing mode
        if (currentIndex < currentText.length) {
          setDisplayedText(currentText.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutRefs.current.timeoutId = setTimeout(typeNextChar, speed);
        } else {
          // Finished typing, pause then start deleting
          timeoutRefs.current.timeoutId = setTimeout(() => {
            if (mountedRef.current) {
              isDeletingState = true;
              deleteNextChar();
            }
          }, pauseTime);
        }
      }
    };

    const deleteNextChar = () => {
      if (!mountedRef.current) return;
      
      if (currentIndex > 0) {
        currentIndex--;
        setDisplayedText(getCurrentText().slice(0, currentIndex));
        timeoutRefs.current.timeoutId = setTimeout(deleteNextChar, deleteSpeed);
      } else {
        // Finished deleting, move to next text and start typing
        isDeletingState = false;
        textIndex = (textIndex + 1) % (Array.isArray(texts) ? texts.length : 1);
        setCurrentTextIndex(textIndex);
        currentIndex = 0;
        timeoutRefs.current.timeoutId = setTimeout(() => {
          if (mountedRef.current) {
            typeNextChar();
          }
        }, pauseTime / 2); // Shorter pause between texts
      }
    };

    // Start typing after delay
    timeoutRefs.current.startDelayId = setTimeout(() => {
      if (mountedRef.current) {
        typeNextChar();
      }
    }, delay);

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (timeoutRefs.current.startDelayId) {
        clearTimeout(timeoutRefs.current.startDelayId);
      }
      if (timeoutRefs.current.timeoutId) {
        clearTimeout(timeoutRefs.current.timeoutId);
      }
    };
  }, [texts, speed, delay, deleteSpeed, pauseTime]);

  // Always show cursor
  const showCursor = true;

  return (
    <span 
      className={`typewriter-text ${className}`}
      style={{ 
        color: '#ffffff',
        opacity: 1,
        visibility: 'visible',
        display: 'inline-block',
        whiteSpace: 'pre-wrap',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        lineHeight: 'inherit'
      }}
    >
      {displayedText}
      {showCursor && <span className="typewriter-cursor" style={{ color: '#FF4D00', marginLeft: '2px', display: 'inline-block' }}>|</span>}
    </span>
  );
}

// Hero Rotating Component
function HeroRotatingView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % 2);
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const dashboardView = (
    <div className="relative rounded-3xl border border-white/20 bg-gradient-to-br from-orange-500/15 via-[#151515] to-blue-500/15 backdrop-blur-2xl overflow-hidden shadow-2xl group hover:border-orange-500/40 transition-all aspect-[4/3]">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/50 via-transparent to-transparent z-10 pointer-events-none" />
      
      {/* Image Placeholder with Modern Dashboard Visualization */}
      <div className="relative w-full h-full bg-gradient-to-br from-orange-500/5 to-blue-500/5 flex items-center justify-center overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
        
        {/* Dashboard Mockup Visual */}
        <div className="relative z-10 w-full h-full p-8 flex flex-col gap-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="text-xs text-gray-500 font-mono">dashboard.aurapply.com</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Applications', value: '142', color: 'orange' },
              { label: 'Responses', value: '38', color: 'blue' },
              { label: 'Interviews', value: '12', color: 'green' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm"
              >
                <div className="text-xs text-gray-300 mb-1">{stat.label}</div>
                <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Activity Chart */}
          <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="text-xs text-gray-400 mb-3">Weekly Activity</div>
            <div className="flex items-end justify-between gap-1 h-20">
              {[30, 50, 40, 70, 60, 80, 65].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-orange-500/60 to-orange-500/30 rounded-t"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-blue-500/20 opacity-50 group-hover:opacity-75 transition-opacity" />
      </div>
    </div>
  );

  const terminalView = (
    <div className="relative rounded-3xl border border-white/20 bg-[#151515]/90 backdrop-blur-2xl overflow-hidden shadow-2xl flashlight-effect flashlight-border aspect-[4/3]">
      <DeveloperTerminal 
        isActive={currentIndex === 1} 
        onInteractionStart={() => setIsPaused(true)}
        onInteractionEnd={() => setIsPaused(false)}
      />
    </div>
  );

  const handleContainerTouchStart = (e) => {
    if (currentIndex === 1 && isPaused) {
      e.stopPropagation();
      return;
    }
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleContainerTouchMove = (e) => {
    if (currentIndex === 1 && isPaused) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  const handleContainerTouchEnd = (e) => {
    if (currentIndex === 1 && isPaused) {
      e.stopPropagation();
      return;
    }
    if (currentIndex === 1) return; // Don't allow swipe when terminal is active
    
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    
    // Only trigger swipe if horizontal movement is greater than vertical (swipe, not scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        setCurrentIndex((prev) => (prev - 1 + 2) % 2);
      } else {
        // Swipe left - go to next
        setCurrentIndex((prev) => (prev + 1) % 2);
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-[4/3]"
      onTouchStart={handleContainerTouchStart}
      onTouchMove={handleContainerTouchMove}
      onTouchEnd={handleContainerTouchEnd}
    >
      {[dashboardView, terminalView].map((view, index) => (
        <motion.div
          key={index}
          initial={false}
          animate={{
            opacity: currentIndex === index ? 1 : 0,
            scale: currentIndex === index ? 1 : 0.95,
            x: currentIndex === index ? 0 : currentIndex < index ? 50 : -50,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          drag={false}
          dragConstraints={false}
          className={`absolute inset-0 ${currentIndex === index ? 'z-10' : 'z-0 pointer-events-none'}`}
          style={{ touchAction: index === 1 ? 'pan-y' : 'none' }}
        >
          {view}
        </motion.div>
      ))}
      
      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500/20 rounded-full blur-xl -z-10"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full blur-xl -z-10"
      />
    </div>
  );
}

// Developer Terminal Component
function DeveloperTerminal({ isActive = false, onInteractionStart, onInteractionEnd }) {
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef(null);
  const interactionTimeoutRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      // Small delay to ensure the card is fully visible
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isActive]);

  const commands = {
    help: {
      output: [
        'Available commands:',
        '  help       - Show this help message',
        '  about     - Learn about AurApply',
        '  features  - View platform features',
        '  stats     - See platform statistics',
        '  commands  - List all available commands',
        '  clear     - Clear terminal output',
        '  start     - Get started with AurApply',
        '  pricing   - View pricing information',
        '  contact   - Get in touch with us',
        '',
        'Type any command and press Enter to execute.'
      ]
    },
    about: {
      output: [
        'AurApply v2.0 - Public Beta',
        '',
        'AurApply is the operating system for your career growth.',
        'We automate your job search process using advanced AI',
        'to match you with the perfect opportunities.',
        '',
        'Our mission: Help professionals land their dream roles faster.',
        'Built with cutting-edge technology and a focus on privacy.'
      ]
    },
    features: {
      output: [
        'Key Features:',
        '',
        '  ✓ AI-Powered Matching - Advanced algorithms analyze job postings',
        '  ✓ Auto-Fill Applications - Automatically fill 50+ job boards',
        '  ✓ Real-Time Analytics - Track success rates and optimize strategy',
        '  ✓ Privacy First - Encrypted data, never shared',
        '  ✓ Lightning Fast - Submit applications in seconds',
        '  ✓ Fully Customizable - Tailor every aspect to your preferences',
        '',
        'Type "help" for more information.'
      ]
    },
    stats: {
      output: [
        'Platform Statistics:',
        '',
        '  • 50+ Job Platforms Integrated',
        '  • 10K+ Active Users',
        '  • 500K+ Applications Sent',
        '  • 98% Success Rate',
        '',
        'Join thousands of professionals accelerating their careers!'
      ]
    },
    commands: {
      output: [
        'Available Commands:',
        '  help, about, features, stats, commands, clear, start, pricing, contact'
      ]
    },
    clear: {
      output: [],
      clearHistory: true
    },
    start: {
      output: [
        'Getting Started with AurApply:',
        '',
        '1. Sign up for a free account',
        '2. Upload your CV and cover letter',
        '3. Set your job preferences',
        '4. Let AurApply automate your applications',
        '',
        'Ready to accelerate your career?',
        'Visit the dashboard to get started!'
      ]
    },
    pricing: {
      output: [
        'AurApply Pricing:',
        '',
        '  Free Trial - 14 days, full access',
        '  Starter    - $29/month - 50 applications/month',
        '  Pro        - $79/month - 200 applications/month',
        '  Enterprise - Custom pricing for teams',
        '',
        'All plans include:',
        '  • AI-powered job matching',
        '  • Auto-fill applications',
        '  • Real-time analytics',
        '  • Priority support'
      ]
    },
    contact: {
      output: [
        'Contact AurApply:',
        '',
        '  Email: support@aurapply.com',
        '  Twitter: @aurapply',
        '  LinkedIn: /company/aurapply',
        '',
        'We\'re here to help you land your dream job!'
      ]
    }
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) {
      return;
    }

    const command = commands[trimmedCmd];
    
    if (command) {
      if (command.clearHistory) {
        setCommandHistory([]);
      } else {
        setCommandHistory(prev => [
          ...prev,
          { type: 'command', text: cmd },
          { type: 'output', lines: command.output }
        ]);
      }
    } else {
      setCommandHistory(prev => [
        ...prev,
        { type: 'command', text: cmd },
        { type: 'output', lines: [`Command not found: ${trimmedCmd}. Type "help" for available commands.`] }
      ]);
    }
  };

  const handleInteraction = () => {
    if (onInteractionStart) {
      onInteractionStart();
    }
    // Clear any existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    // Resume rotation after 10 seconds of inactivity
    interactionTimeoutRef.current = setTimeout(() => {
      if (onInteractionEnd) {
        onInteractionEnd();
      }
    }, 10000);
  };

  const handleKeyPress = (e) => {
    handleInteraction();
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleInputChange = (e) => {
    handleInteraction();
    setCurrentInput(e.target.value);
  };

  const handleTerminalClick = () => {
    handleInteraction();
  };

  const handleTouchStart = (e) => {
    handleInteraction();
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="w-full h-full flex flex-col min-h-0" 
      onClick={handleTerminalClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/20 bg-[#0F0F0F]/80 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-gray-500 font-mono">developer@aurapply:~</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-6 font-mono text-sm overflow-y-auto bg-[#0F0F0F]/60" style={{ scrollbarWidth: 'thin', scrollbarColor: '#FF4D00 #0F0F0F' }}>
        {/* Welcome Message */}
        {isVisible && commandHistory.length === 0 && (
          <div className="mb-4">
            <AnimatedText 
              text="Welcome to AurApply Developer Terminal" 
              delay={0.1} 
              className="text-orange-400 font-semibold block mb-2"
            />
            <AnimatedText 
              text="Type 'help' to see available commands" 
              delay={0.5} 
              className="text-gray-300 block mb-4"
            />
            <AnimatedText 
              text="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" 
              delay={0.7} 
              className="text-gray-500 block mb-4"
            />
          </div>
        )}

        {/* Command History */}
        <div className="space-y-2">
          {commandHistory.map((item, idx) => (
            <div key={idx} className="mb-2">
              {item.type === 'command' && (
                <div className="text-green-400 mb-1">
                  <span className="text-orange-400">$</span> {item.text}
                </div>
              )}
              {item.type === 'output' && (
                <div className="text-gray-300 ml-4">
                  {item.lines.map((line, lineIdx) => (
                    <div key={lineIdx} className="mb-1">{line || '\u00A0'}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Line */}
        {isVisible && (
          <div className="flex items-center gap-2 mt-4 sticky bottom-0 bg-[#0F0F0F]/60 pb-2">
            <span className="text-orange-400 font-semibold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-none outline-none text-gray-200 font-mono caret-orange-400 placeholder-gray-500"
              placeholder="Type a command..."
              style={{ caretColor: '#FF4D00' }}
            />
            <span className="text-orange-400 animate-pulse font-bold">|</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Rotating Card Component
function RotatingCard({ cards, onCardClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cards.length, isPaused]);

  const rafIdRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    
    rafIdRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
      
      // Update CSS variables for flashlight effect
      const activeCard = containerRef.current.querySelector('.active-card');
      if (activeCard) {
        activeCard.style.setProperty('--mouse-x', `${x}px`);
        activeCard.style.setProperty('--mouse-y', `${y}px`);
      }
    });
  };
  
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[400px]"
      onMouseMove={handleMouseMove}
    >
      {cards.map((card, index) => {
        const position = (index - currentIndex + cards.length) % cards.length;
        const isActive = position === 0;
        
        return (
          <motion.div
            key={index}
            initial={false}
            animate={{
              x: position === 0 ? 0 : position === 1 ? '100%' : '-100%',
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1 : 0.9,
              rotateY: position === 0 ? 0 : position === 1 ? -15 : 15,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={`absolute inset-0 ${isActive ? 'z-10 active-card' : 'z-0 pointer-events-none'}`}
            onClick={isActive && card.key !== 'terminal' ? onCardClick : undefined}
          >
            <div className={`relative rounded-3xl border border-white/20 bg-[#151515]/80 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all group flashlight-effect flashlight-border h-full ${card.key !== 'terminal' ? 'cursor-pointer hover:border-orange-500/40' : ''}`}>
              {/* Flashlight Background */}
              <div 
                className="absolute pointer-events-none transition-opacity duration-300"
                style={{
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  opacity: isActive ? 1 : 0,
                  zIndex: 1,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/70 via-transparent to-transparent z-10 pointer-events-none" />
              <div className="relative z-0 p-8 md:p-12 bg-gradient-to-br from-orange-500/8 via-[#151515] to-trust-blue/8 h-full">
                {(() => {
                  if (!React.isValidElement(card)) return card;
                  
                  // Check if card has DeveloperTerminal as a child
                  if (card.props?.children && React.isValidElement(card.props.children) && card.props.children.type === DeveloperTerminal) {
                    return React.cloneElement(card, {
                      children: React.cloneElement(card.props.children, { 
                        isActive,
                        onInteractionStart: () => setIsPaused(true),
                        onInteractionEnd: () => setIsPaused(false)
                      })
                    });
                  }
                  
                  // Check if card itself is DeveloperTerminal
                  if (card.type === DeveloperTerminal) {
                    return React.cloneElement(card, { 
                      isActive,
                      onInteractionStart: () => setIsPaused(true),
                      onInteractionEnd: () => setIsPaused(false)
                    });
                  }
                  
                  return card;
                })()}
              </div>
            </div>
          </motion.div>
        );
      })}
      
      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white/25 transition-all border-beam"
        aria-label="Previous card"
      >
        <Icon icon="solar:alt-arrow-left-bold" className="text-xl text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white/25 transition-all border-beam"
        aria-label="Next card"
      >
        <Icon icon="solar:alt-arrow-right-bold" className="text-xl text-white" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-orange-500 w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Glow Card Component with Context-Aware Shine Effect + Flashlight
function GlowCard({ feature, index }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const rafIdRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    
    rafIdRef.current = requestAnimationFrame(() => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
      
      // Update CSS variables for flashlight border on the card element
      const cardElement = cardRef.current;
      cardElement.style.setProperty('--mouse-x', `${x}px`);
      cardElement.style.setProperty('--mouse-y', `${y}px`);
    });
  };
  
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6, fillMode: 'both' }}
      whileHover={{ scale: 1.05, y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative p-8 rounded-2xl border border-white/20 bg-gradient-to-br ${feature.gradient} backdrop-blur-xl hover:border-orange-500/40 transition-all overflow-hidden flashlight-effect flashlight-border`}
    >
      {/* Flashlight Background Effect */}
      <div 
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          opacity: isHovered ? 1 : 0,
          zIndex: 1,
        }}
      />
      
      <div className="absolute inset-0 bg-[#151515]/60 rounded-2xl" />
      
      {/* Glow Effect - Duplicated Icon that follows cursor */}
      <div 
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%) scale(3)',
          opacity: isHovered ? 0.4 : 0,
          filter: 'url(#glow-filter-strong)',
          zIndex: 2,
        }}
      >
        <Icon 
          icon={feature.icon} 
          className="text-3xl text-orange-500"
          style={{ 
            filter: 'drop-shadow(0 0 20px rgba(255, 77, 0, 0.8))',
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center mb-6 border border-white/30 relative">
          {/* Original Icon */}
          <Icon icon={feature.icon} className="text-3xl text-orange-500 relative z-10" />
          {/* Duplicated Glow Icon - subtle movement */}
          <Icon 
            icon={feature.icon} 
            className="text-3xl text-orange-500 absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              transform: `translate(${(mousePosition.x - 56) * 0.1}px, ${(mousePosition.y - 28) * 0.1}px) scale(1.5)`,
              filter: 'url(#glow-filter)',
              opacity: isHovered ? 0.6 : 0,
            }}
          />
        </div>
        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
        <p className="text-gray-400 leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AuthContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [navbarHovered, setNavbarHovered] = useState(false);
  const { scrollY } = useScroll();
  const isLoggedIn = !!token || !!localStorage.getItem('token');
  // Reverse: bright (1) at top, dim (0.5) when scrolling
  const navbarOpacity = useTransform(scrollY, [0, 100], [1, 0.5]);
  const navbarBlur = useTransform(scrollY, [0, 100], [20, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetAccess = () => {
    navigate('/auth');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleViewDemo = () => {
    navigate('/dashboard');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white overflow-x-hidden relative selection:bg-orange-500/30">
      {/* SVG Filters for Glow Effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-filter-strong">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Animated Background Grid with Clip Path */}
      <div className="fixed inset-0 z-0 opacity-[0.08]">
        <div className="absolute inset-0 clip-column" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Gradient Orbs */}
      <motion.div 
        className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/18 rounded-full blur-[120px] -z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-trust-blue/18 rounded-full blur-[100px] -z-10"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="fixed top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/18 rounded-full blur-[90px] -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Enhanced Navigation - Lumina Style */}
      <motion.nav 
        onMouseEnter={() => setNavbarHovered(true)}
        onMouseLeave={() => setNavbarHovered(false)}
        style={{ 
          backdropFilter: `blur(${navbarBlur}px)`,
          opacity: navbarHovered ? 1 : navbarOpacity
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#151515]/80 border-b border-white/20' : navbarHovered ? 'bg-[#151515]/95' : 'bg-[#151515]/90'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="font-bold text-xl text-white">
                AurApply
              </span>
            </motion.div>

            {/* Center-Left: Navigation Links with Icons */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center ml-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/25 text-white text-sm font-medium border border-orange-500/40 border-beam"
              >
                <Icon icon="solar:home-2-bold-duotone" className="text-base" />
                Overview
              </motion.button>
              <button 
                onClick={() => scrollToSection('features')}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-white/8 text-sm font-medium transition-colors"
              >
                <Icon icon="solar:widget-5-bold-duotone" className="text-base" />
                Features
              </button>
              <button 
                onClick={() => scrollToSection('technology')}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-white/8 text-sm font-medium transition-colors"
              >
                <Icon icon="solar:settings-bold-duotone" className="text-base" />
                Technology
              </button>
              <button 
                onClick={() => scrollToSection('stats')}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-white/8 text-sm font-medium transition-colors"
              >
                <Icon icon="solar:graph-up-bold-duotone" className="text-base" />
                Stats
              </button>
            </div>

            {/* Right: CTA Buttons */}
            <div className="flex items-center gap-3 ml-4">
              {isLoggedIn ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 bg-[#1A1A1A]/90 backdrop-blur-2xl border border-white/20 px-4 py-2 rounded-full shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)]"
                >
                  <Link to="/dashboard" className="relative group">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      location.pathname === '/dashboard' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}>
                      <Icon icon="solar:widget-bold-duotone" width="20" height="20" />
                    </div>
                    {location.pathname === '/dashboard' && (
                      <motion.div 
                        layoutId="dot" 
                        className="absolute -bottom-1 left-0 right-0 mx-auto w-1 h-1 bg-white rounded-full" 
                      />
                    )}
                  </Link>
                  <Link to="/discover" className="relative group">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      location.pathname === '/discover' ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}>
                      <Icon icon="solar:radar-bold-duotone" width="20" height="20" />
                    </div>
                    {location.pathname === '/discover' && (
                      <motion.div 
                        layoutId="dot" 
                        className="absolute -bottom-1 left-0 right-0 mx-auto w-1 h-1 bg-white rounded-full" 
                      />
                    )}
                  </Link>
                  <div className="w-px h-6 bg-white/20 mx-1"></div>
                  <button 
                    onClick={() => { 
                      localStorage.removeItem('token'); 
                      setToken(null);
                      navigate('/auth');
                    }} 
                    className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Icon icon="solar:logout-3-bold-duotone" width="20" height="20" />
                  </button>
                </motion.div>
              ) : (
                <>
                  <Link to="/auth">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-white/8 border border-white/20 rounded-full text-sm font-medium text-white hover:bg-white/15 transition-colors hidden sm:block"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link to="/auth">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGetAccess}
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-full text-sm font-bold hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg shadow-orange-500/20"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
        </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 max-w-7xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-white/15 to-white/8 border border-white/30 text-xs font-mono text-orange-400 mb-8 backdrop-blur-xl"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(255,77,0,0.8)]"
              />
              <span>v2.0 PUBLIC BETA • Now Live</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, fillMode: 'both' }}
              className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-[1.05] mb-8"
              style={{ color: 'white' }}
            >
              <TypewriterText 
                texts={[
                  "We care about your career",
                  "Your next opportunity awaits",
                  "Automate your job search",
                  "Land your dream role faster"
                ]}
                speed={80} 
                delay={500} 
              />
            </motion.h1>


            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, fillMode: 'both' }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8"
            >
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="parallelogram-button parallelogram-button-white"
                    >
                      <span className="parallelogram-button-content">
                        Go to Dashboard
                        <Icon icon="solar:arrow-right-up-linear" className="text-lg" />
                      </span>
                    </motion.button>
                  </Link>
                  <Link to="/discover">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="parallelogram-button parallelogram-button-outlined"
                      style={{ borderColor: '#0066FF', color: '#0066FF' }}
                    >
                      <span className="parallelogram-button-content">
                        <Icon icon="solar:radar-bold-duotone" className="text-lg" />
                        Discover
                      </span>
                    </motion.button>
                  </Link>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetAccess}
                    className="parallelogram-button parallelogram-button-white"
                  >
                    <span className="parallelogram-button-content">
                      Start Automating
                      <Icon icon="solar:arrow-right-up-linear" className="text-lg" />
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewDemo}
                    className="parallelogram-button parallelogram-button-outlined"
                    style={{ borderColor: '#FF4D00', color: '#FF4D00' }}
                  >
                    <span className="parallelogram-button-content">
                      <Icon icon="solar:play-circle-bold" className="text-lg" />
                    Watch Demo
                    </span>
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right: Hero Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <HeroRotatingView />
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview - Rotating Cards */}
      <section className="relative pt-16 pb-48 px-6 max-w-7xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 100 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.9, duration: 0.8, fillMode: 'both' }}
          className="max-w-5xl mx-auto"
        >
          <RotatingCard
            cards={[
              <div key="card1">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Dashboard Preview</h3>
              <p className="text-sm text-gray-500 mb-3">Real-time insights into your job search performance</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <motion.div 
                whileHover={{ scale: 1.02, borderColor: 'rgba(255, 77, 0, 0.3)' }}
                    className="glass-card rounded-xl p-6 border border-white/20 bg-white/8 transition-all flashlight-effect flashlight-border"
              >
                <div className="text-xs text-gray-400 mb-2">Total Applications</div>
                <div className="text-4xl font-bold text-white mb-4">142</div>
                <div className="h-20 flex items-end gap-1.5">
                  {[40, 60, 30, 80, 50, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                          transition={{ delay: 1.2 + i * 0.1, duration: 0.5, fillMode: 'both' }}
                      className="flex-1 bg-gradient-to-t from-orange-500/80 to-orange-500/40 rounded-t"
                    />
                  ))}
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02, borderColor: 'rgba(255, 77, 0, 0.3)' }}
                      className="glass-card rounded-xl p-6 border border-white/20 bg-white/8 flex flex-col justify-between transition-all flashlight-effect flashlight-border"
              >
                <Icon icon="solar:upload-square-bold-duotone" className="text-orange-500 text-3xl mb-4" />
                <div>
                  <div className="text-base text-white font-semibold mb-1">Upload CV</div>
                  <div className="text-xs text-gray-300">Update your assets</div>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02, borderColor: 'rgba(255, 77, 0, 0.3)' }}
                      className="glass-card rounded-xl p-6 border border-white/20 bg-white/8 col-span-2 transition-all flashlight-effect flashlight-border"
              >
                  <div className="text-xs text-gray-400 mb-4">Recent Activity</div>
                <div className="space-y-3">
                  {[
                    { company: 'Vercel', role: 'Frontend Engineer', status: 'Sent', time: '2h ago' },
                    { company: 'Linear', role: 'Product Designer', status: 'Viewed', time: '5h ago' },
                    { company: 'Stripe', role: 'Full Stack Dev', status: 'Applied', time: '1d ago' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                          initial={{ filter: 'blur(5px)', x: -20 }}
                          animate={{ filter: 'blur(0px)', x: 0 }}
                          transition={{ delay: 1.4 + i * 0.1, fillMode: 'both' }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/8 hover:bg-white/15 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <div>
                          <span className="text-sm text-white font-medium">{item.role}</span>
                          <span className="text-xs text-gray-400 ml-2">at {item.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{item.time}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          item.status === 'Sent' ? 'bg-trust-blue/20 text-trust-blue' : 
                          item.status === 'Viewed' ? 'bg-success-green/20 text-success-green' : 
                          'bg-orange-500/20 text-orange-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
              </div>,
              <div key="card2">
                <div className="mb-8 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics Overview</h3>
                  <p className="text-sm text-gray-400 mb-3">Track your application success metrics</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                  {[
                    { label: 'Response Rate', value: '27%', color: 'orange' },
                    { label: 'Interview Rate', value: '8%', color: 'blue' },
                    { label: 'Offer Rate', value: '3%', color: 'green' }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="glass-card rounded-xl p-6 border border-white/10 bg-white/5 transition-all flashlight-effect flashlight-border text-center"
                    >
                      <div className="text-xs text-gray-400 mb-2">{stat.label}</div>
                      <div className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
                      <div className="h-16 flex items-end justify-center">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${parseInt(stat.value)}%` }}
                          transition={{ delay: 1.5 + i * 0.2, duration: 0.8, fillMode: 'both' }}
                          className={`w-full bg-gradient-to-t from-${stat.color}-500/60 to-${stat.color}-500/30 rounded-t`}
                        />
          </div>
                    </motion.div>
                  ))}
                </div>
              </div>,
              <div key="card3">
                <div className="mb-8 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Job Matching</h3>
                  <p className="text-sm text-gray-400 mb-3">AI-powered job recommendations</p>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Senior Frontend Engineer', company: 'Vercel', match: '95%', status: 'Hot Match' },
                    { title: 'Product Designer', company: 'Linear', match: '88%', status: 'Great Fit' },
                    { title: 'Full Stack Developer', company: 'Stripe', match: '82%', status: 'Good Match' }
                  ].map((job, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + i * 0.1, fillMode: 'both' }}
                      className="glass-card rounded-xl p-6 border border-white/20 bg-white/8 transition-all flashlight-effect flashlight-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-base text-white font-semibold">{job.title}</div>
                          <div className="text-sm text-gray-300">{job.company}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-400">{job.match}</div>
                          <div className="text-xs text-gray-400">Match</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">
                          {job.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ]}
            onCardClick={handleViewDemo}
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative pt-48 pb-32 px-6 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, fillMode: 'both' }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
            <AnimatedText text="Powerful Features" delay={0} />
          </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            <AnimatedText text="Everything you need to streamline your job search process" delay={0.3} />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: 'solar:magic-stick-3-bold-duotone',
              title: 'AI-Powered Matching',
              description: 'Advanced algorithms analyze job postings and match them with your profile automatically.',
              gradient: 'from-orange-500/20 to-red-500/20'
            },
            {
              icon: 'solar:document-text-bold-duotone',
              title: 'Auto-Fill Applications',
              description: 'Automatically fill out applications across 50+ job boards with your saved information.',
              gradient: 'from-trust-blue/20 to-cyan-500/20'
            },
            {
              icon: 'solar:graph-up-bold-duotone',
              title: 'Real-Time Analytics',
              description: 'Track your application success rate, response times, and optimize your strategy.',
              gradient: 'from-purple-500/20 to-pink-500/20'
            },
            {
              icon: 'solar:shield-check-bold-duotone',
              title: 'Privacy First',
              description: 'Your data is encrypted and stored securely. We never share your information.',
              gradient: 'from-success-green/20 to-emerald-500/20'
            },
            {
              icon: 'solar:rocket-2-bold-duotone',
              title: 'Lightning Fast',
              description: 'Submit applications in seconds. What used to take hours now takes minutes.',
              gradient: 'from-yellow-500/20 to-orange-500/20'
            },
            {
              icon: 'solar:settings-bold-duotone',
              title: 'Fully Customizable',
              description: 'Tailor every aspect of your applications to match your preferences and style.',
              gradient: 'from-indigo-500/20 to-purple-500/20'
            }
          ].map((feature, i) => (
            <GlowCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* Logos Marquee Section */}
      <section className="relative py-16 px-6 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ filter: 'blur(10px)', y: 30 }}
          whileInView={{ filter: 'blur(0px)', y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, fillMode: 'both' }}
          className="text-center mb-12"
        >
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-8">
            Trusted by leading companies
          </p>
        </motion.div>
        <div className="marquee-container">
          <div className="marquee-content">
            {[
              'Vercel', 'Linear', 'Stripe', 'Vercel', 'Linear', 'Stripe',
              'Vercel', 'Linear', 'Stripe', 'Vercel', 'Linear', 'Stripe'
            ].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-12 flex items-center justify-center"
              >
                <div className="text-4xl font-bold text-white mono-logo hover:text-white transition-all">
                  {logo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-32 px-6 max-w-7xl mx-auto z-10">
        <div className="relative rounded-3xl border border-white/20 bg-[#151515]/80 backdrop-blur-2xl p-12 md:p-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-transparent to-trust-blue/15" />
          
          <motion.div
            initial={{ filter: 'blur(10px)', y: 50 }}
            whileInView={{ filter: 'blur(0px)', y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, fillMode: 'both' }}
            className="text-center mb-16 relative z-10"
          >
            <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
              <AnimatedText text="By The Numbers" delay={0} />
            </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              <AnimatedText text="Join thousands of professionals accelerating their careers" delay={0.3} />
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {[
              { number: '50+', label: 'Job Platforms', icon: 'solar:global-bold-duotone' },
              { number: '10K+', label: 'Active Users', icon: 'solar:users-group-two-rounded-bold-duotone' },
              { number: '500K+', label: 'Applications Sent', icon: 'solar:document-bold-duotone' },
              { number: '98%', label: 'Success Rate', icon: 'solar:check-circle-bold-duotone' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5, fillMode: 'both' }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Icon icon={stat.icon} className="text-2xl text-orange-500" />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ fillMode: 'both' }}
                  className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="relative py-32 px-6 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, fillMode: 'both' }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
            <AnimatedText text="Built With Cutting-Edge Tech" delay={0} />
          </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            <AnimatedText text="Leveraging the latest in AI and automation technology" delay={0.3} />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, fillMode: 'both' }}
            className="relative p-10 rounded-3xl border border-white/20 bg-[#151515]/80 backdrop-blur-xl flashlight-effect flashlight-border"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            <h3 className="text-2xl font-semibold mb-4">Cinematic Intelligence</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Our proprietary AI engine doesn't just match keywords—it understands context, culture fit, and career progression. Think of it as having a career coach that never sleeps.
            </p>
            <div className="flex flex-wrap gap-2">
              {['GPT-4', 'NLP', 'Computer Vision', 'ML'].map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white/8 border border-white/20 text-sm text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, fillMode: 'both' }}
            className="relative p-10 rounded-3xl border border-white/20 bg-[#151515]/80 backdrop-blur-xl flashlight-effect flashlight-border"
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-trust-blue/10 rounded-full blur-3xl" />
            <h3 className="text-2xl font-semibold mb-4">Secure & Scalable</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Enterprise-grade security meets cloud scalability. Your data is protected with end-to-end encryption and stored in SOC 2 compliant infrastructure.
            </p>
            <div className="flex flex-wrap gap-2">
              {['AWS', 'Encryption', 'SOC 2', 'GDPR'].map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white/8 border border-white/20 text-sm text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 px-6 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, fillMode: 'both' }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
            <AnimatedText text="Trusted By Professionals" delay={0} />
          </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            <AnimatedText text="See what our users are saying" delay={0.3} />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah Chen',
              role: 'Software Engineer',
              company: 'ex-Meta',
              image: '👩‍💻',
              quote: 'AurApply transformed my job search. I went from spending 5 hours a week on applications to 30 minutes. Landed my dream role in 2 weeks.'
            },
            {
              name: 'Marcus Johnson',
              role: 'Product Designer',
              company: 'ex-Airbnb',
              image: '👨‍🎨',
              quote: 'The AI matching is incredible. It found opportunities I never would have discovered manually. This is the future of job hunting.'
            },
            {
              name: 'Emily Rodriguez',
              role: 'Data Scientist',
              company: 'ex-Google',
              image: '👩‍🔬',
              quote: 'As someone who values efficiency, AurApply is a game-changer. The analytics alone are worth it—I can optimize my strategy in real-time.'
            }
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.1, duration: 0.5, fillMode: 'both' }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative p-8 rounded-2xl border border-white/20 bg-[#151515]/80 backdrop-blur-xl flashlight-effect flashlight-border"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="text-4xl mb-4">{testimonial.image}</div>
                <p className="text-gray-300 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-300">{testimonial.role} • {testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6 max-w-5xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, fillMode: 'both' }}
          className="relative rounded-3xl border border-white/20 bg-gradient-to-br from-orange-500/15 via-[#151515] to-trust-blue/15 backdrop-blur-2xl p-12 md:p-16 text-center overflow-hidden flashlight-effect flashlight-border"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-6">
              Ready to Accelerate Your Career?
            </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who are already using AurApply to land their dream jobs faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetAccess}
                className="px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
              >
                Start Free Trial
                <Icon icon="solar:rocket-2-bold" className="text-xl" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewDemo}
                className="px-10 py-5 rounded-2xl bg-white/12 text-white font-bold border border-white/20 hover:bg-white/25 transition"
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-white/20 py-16 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Icon icon="solar:rocket-2-bold" className="text-white text-xl" />
                </div>
                <span className="font-bold text-xl">AurApply</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                The operating system for your career growth. Automate your job search and land your dream role faster.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-white transition">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('technology')} className="hover:text-white transition">
                    Technology
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('stats')} className="hover:text-white transition">
                    Stats
                  </button>
                </li>
                <li><button className="bg-transparent border-none p-0 text-left hover:text-white transition">Pricing</button></li>
              </ul>
      </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><button className="bg-transparent border-none p-0 text-left hover:text-white transition">About</button></li>
                <li><button className="bg-transparent border-none p-0 text-left hover:text-white transition">Blog</button></li>
                <li><button className="bg-transparent border-none p-0 text-left hover:text-white transition">Careers</button></li>
                <li><button className="bg-transparent border-none p-0 text-left hover:text-white transition">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><button className="bg-transparent border-none p-0 text-left hover:text-white transition">Privacy</button></li>
                <li><button className="bg-transparent border-none p-0 text-left hover:text-white transition">Terms</button></li>
                <li><button className="bg-transparent border-none p-0 text-left hover:text-white transition">Security</button></li>
                <li><button className="bg-transparent border-none p-0 text-left hover:text-white transition">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 AurApply Inc. Crafted for the ambitious.</p>
            <div className="flex items-center gap-6">
              <button className="bg-transparent border-none p-0 text-gray-300 hover:text-white transition">
                <Icon icon="solar:twitter-bold" className="text-xl" />
              </button>
              <button className="bg-transparent border-none p-0 text-gray-300 hover:text-white transition">
                <Icon icon="solar:linkedin-bold" className="text-xl" />
              </button>
              <button className="bg-transparent border-none p-0 text-gray-300 hover:text-white transition">
                <Icon icon="solar:github-bold" className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
