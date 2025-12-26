import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Minus,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';
import { useChatStore, quickReplies } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const {
    isOpen,
    isMinimized,
    messages,
    isTyping,
    toggleChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    sendMessage,
    handleQuickReply,
  } = useChatStore();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Welcome message
  const welcomeMessage = {
    id: 'welcome',
    content: '¡Hola! 👋 Bienvenido a WALMER Store. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
    sender_type: 'bot' as const,
    created_at: new Date().toISOString(),
  };

  const allMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <>
      {/* Chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-40 p-4 bg-white text-black rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />

            {/* Notification dot */}
            <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '500px',
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 w-96 bg-primary-900 rounded-2xl shadow-2xl border border-primary-800 overflow-hidden flex flex-col',
              isMinimized && 'h-auto'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white text-black">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-semibold">WALMER Assistant</h3>
                  <p className="text-xs text-gray-600">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={isMinimized ? maximizeChat : minimizeChat}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {allMessages.map((message, index) => (
                    <motion.div
                      key={message.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex gap-3',
                        message.sender_type === 'user' && 'flex-row-reverse'
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                          message.sender_type === 'user'
                            ? 'bg-white text-black'
                            : 'bg-primary-800 text-white'
                        )}
                      >
                        {message.sender_type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </div>

                      {/* Message bubble */}
                      <div
                        className={cn(
                          'max-w-[75%] rounded-2xl px-4 py-3',
                          message.sender_type === 'user'
                            ? 'bg-white text-black rounded-tr-sm'
                            : 'bg-primary-800 text-white rounded-tl-sm'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="bg-primary-800 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick replies */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <motion.button
                          key={reply.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 bg-primary-800 text-sm text-white rounded-full hover:bg-primary-700 transition-colors"
                        >
                          {reply.text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-primary-800">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 h-11 px-4 bg-primary-800 border border-primary-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="h-11 w-11 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
