import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, MinusCircle, Loader, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your Modern Academy assistant. How can I help you today?',
      options: [
        'Admission Process',
        'Fee Structure',
        'Course Information',
        'Contact Details'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (userMessage) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = {
        type: 'bot',
        content: '',
        options: []
      };

      // Simple response logic
      if (userMessage.toLowerCase().includes('admission')) {
        botResponse.content = 'Our admission process involves these steps:\n1. Submit online application\n2. Entrance test\n3. Interview\n4. Document verification';
        botResponse.options = ['Fee Structure', 'Contact Details', 'Schedule Interview'];
      } else if (userMessage.toLowerCase().includes('fee')) {
        botResponse.content = 'Our fee structure varies by grade level. Would you like to see the detailed fee structure or speak with our finance department?';
        botResponse.options = ['View Fee Structure', 'Payment Methods', 'Financial Aid'];
      } else if (userMessage.toLowerCase().includes('course')) {
        botResponse.content = 'We offer various courses across different grades. Which grade level are you interested in?';
        botResponse.options = ['Grade 8', 'Grade 9', 'Grade 10'];
      } else if (userMessage.toLowerCase().includes('contact')) {
        botResponse.content = 'You can reach us at:\nPhone: +1 (555) 123-4567\nEmail: info@modernacademy.edu\nAddress: 123 Education Ave, Learning City';
        botResponse.options = ['Get Directions', 'Schedule Visit', 'Email Us'];
      } else {
        botResponse.content = 'I\'m not sure I understand. Could you please choose from one of these options?';
        botResponse.options = ['Admission Process', 'Fee Structure', 'Course Information', 'Contact Details'];
      }

      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && !isMinimized && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 animate-bounce"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Minimized Chat */}
      {isMinimized && (
        <button
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center space-x-2"
        >
          <Bot className="h-5 w-5" />
          <span>Chat with us</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col transform transition-transform duration-300 animate-slideIn">
          {/* Chat Header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <h3 className="font-semibold">Modern Academy Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsMinimized(true);
                  setIsOpen(false);
                }}
                className="hover:bg-indigo-700 p-1 rounded"
              >
                <MinusCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-indigo-700 p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white rounded-l-xl rounded-tr-xl'
                      : 'bg-gray-100 text-gray-800 rounded-r-xl rounded-tl-xl'
                  } p-4 shadow-md transform hover:scale-[1.02] transition-transform duration-200`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(option)}
                          className="block w-full text-left px-3 py-2 text-sm bg-white text-indigo-600 rounded hover:bg-indigo-50 transition-colors duration-200"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.message;
                if (input.value.trim()) {
                  handleSendMessage(input.value);
                  input.value = '';
                }
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                name="message"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors duration-200 transform hover:scale-110"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;