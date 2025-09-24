"use client";
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useScanData } from './ScanDataContext';
import { useTheme } from './ThemeContext';

export default function AccessibilityChatbot() {
  const { darkMode } = useTheme();
  const { scanData } = useScanData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "👋 Hi! I'm AccessibilityGuard AI, your expert accessibility consultant. I specialize in WCAG 2.1 AA compliance and can help you:\n\n• Understand accessibility violations and their impact\n• Get specific code fixes with examples\n• Prioritize issues by severity\n• Learn testing methodologies\n• Ensure legal compliance (ADA, Section 508)\n\nI can analyze your scan results and provide targeted advice. How can I help you create a more inclusive website today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          conversationHistory: conversationHistory,
          scanData: scanData
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${data.error || data.details || 'Unknown error'}`);
      }

      if (data.success && data.message) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          hasContext: data.hasContext || (scanData !== null)
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. In the meantime, you can check the WCAG 2.1 guidelines at https://www.w3.org/WAI/WCAG21/quickref/ for immediate help.\n\nCommon accessibility issues to check:\n• Color contrast ratios (4.5:1 for normal text)\n• Alt text for images\n• Keyboard navigation support\n• Proper heading structure\n• Form labels and error messages",
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: "Chat cleared! How can I help you with accessibility today?",
      timestamp: new Date()
    }]);
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickQuestions = [
    "What are WCAG 2.1 AA requirements?",
    "How do I fix color contrast issues?",
    "What are ARIA attributes and when to use them?",
    "How to test with screen readers?",
    "What's the difference between AA and AAA?",
    "Show me keyboard navigation best practices",
    "How to write accessible forms?",
    "What are the most common accessibility mistakes?"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-[9997] transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : darkMode
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
        } text-white`}
      >
        {/* Notification badge when scan data is available */}
        {scanData && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
          />
        )}
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        )}
        <span className="sr-only">
          {isOpen ? 'Close Accessibility Assistant' : 'Open Accessibility Assistant'}
        </span>
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Chat Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`fixed top-0 right-0 z-[9999] w-96 h-screen shadow-2xl border-l flex flex-col ${
                darkMode 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
            >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                       stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    AccessibilityGuard AI
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {scanData ? 'Accessibility Expert • Scan data available' : 'Accessibility Expert'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                  title="Clear chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : message.isError
                      ? darkMode 
                        ? 'bg-red-900/30 text-red-300 border border-red-800'
                        : 'bg-red-50 text-red-800 border border-red-200'
                      : darkMode
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.hasContext && message.role === 'assistant' && (
                      <div className={`flex items-center gap-2 mb-2 text-xs ${
                        darkMode ? 'text-purple-300' : 'text-purple-600'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" 
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Analyzed with your scan data
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-2 opacity-70`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl px-4 py-3 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions (shown when few messages) */}
            {messages.length <= 2 && (
              <div className={`px-4 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {scanData ? 'Quick questions about your scan:' : 'Quick questions:'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(scanData ? [
                    "Explain my most critical accessibility issues",
                    "What should I fix first to improve compliance?",
                    "Show me how to fix color contrast violations",
                    "Help me understand these WCAG violations",
                    "What's the business impact of these issues?"
                  ] : quickQuestions.slice(0, 3)).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                        darkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={sendMessage} className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about accessibility..."
                  disabled={isLoading}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } disabled:opacity-50`}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                  </svg>
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </form>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}