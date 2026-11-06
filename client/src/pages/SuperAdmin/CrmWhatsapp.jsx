import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Search, Phone, CheckCheck, User, RefreshCw, Plus, X } from 'lucide-react';

const CrmWhatsapp = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newName, setNewName] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.phone);
      const msgInterval = setInterval(() => fetchMessages(selectedChat.phone, true), 4000);
      return () => clearInterval(msgInterval);
    }
  }, [selectedChat?.phone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/whatsapp/chats`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setChats(prevChats => {
          // Keep local newly added chat if backend hasn't indexed it yet
          return data;
        });
        setSelectedChat(prev => {
          if (!prev && data.length > 0) return data[0];
          return prev ? data.find(c => c.phone === prev.phone) || prev : data[0];
        });
      }
    } catch (error) {
      console.error('Failed to load chats', error);
    }
  };

  const fetchMessages = async (phone, isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/whatsapp/messages/${phone}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const payload = {
      phone: selectedChat.phone,
      name: selectedChat.name,
      message: newMessage,
    };

    const textToSend = newMessage;
    setNewMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const sentMsg = await response.json();
        setMessages((prev) => [...prev, sentMsg]);
        fetchChats();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.error || 'Failed to send message via WhatsApp Cloud API.');
        setNewMessage(textToSend);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(textToSend);
    }
  };

  const handleStartNewChat = (e) => {
    e.preventDefault();
    if (!newPhone.trim()) return;

    const formattedPhone = newPhone.replace(/\D/g, '');
    const chatObj = {
      phone: formattedPhone,
      name: newName.trim() || 'New Lead',
      lastMessage: 'Chat initialized',
      time: 'Just now'
    };

    setChats(prev => [chatObj, ...prev.filter(c => c.phone !== formattedPhone)]);
    setSelectedChat(chatObj);
    setMessages([]);
    setIsNewChatModalOpen(false);
    setNewPhone('');
    setNewName('');
  };

  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    chat.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">WhatsApp CRM</h1>
          <p className="text-xs text-slate-500 mt-1">Manage customer communications and live chat threads in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setIsNewChatModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
          <button 
            type="button"
            onClick={fetchChats}
            className="px-3.5 py-2 bg-white border border-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-13rem)] flex bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        
        {/* Left Sidebar */}
        <div className="w-80 border-r border-slate-200/80 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Conversations</h2>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
              {chats.length} Active
            </span>
          </div>

          <div className="p-3 border-b border-slate-200/60 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search leads or phones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <div
                  key={chat.phone}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    selectedChat?.phone === chat.phone ? 'bg-blue-50/60 border-l-4 border-blue-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                    {chat.name ? chat.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{chat.name || chat.phone}</p>
                      <span className="text-[10px] text-slate-400">{chat.time || ''}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{chat.lastMessage || 'Tap to view conversation'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <p>No conversations found.</p>
                <p className="text-[11px]">Click <strong className="text-blue-600">"New Chat"</strong> above to message any phone number directly!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedChat ? (
            <>
              <div className="h-16 px-6 border-b border-slate-200/80 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-xs">
                    {selectedChat.name ? selectedChat.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{selectedChat.name || 'Customer'}</h3>
                    <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {selectedChat.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-slate-50/50">
                {loading && messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-xs text-slate-400">Loading messages...</div>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                        msg.direction === 'outbound'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                          msg.direction === 'outbound' ? 'text-blue-100' : 'text-slate-400'
                        }`}>
                          <span>{msg.timestamp || 'Just now'}</span>
                          {msg.direction === 'outbound' && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                    <MessageCircle className="w-10 h-10 text-slate-300 mb-2" />
                    <p>Start messaging {selectedChat.name || selectedChat.phone} below!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/80 bg-white flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message to reply via WhatsApp..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
              <MessageCircle className="w-12 h-12 text-slate-200 mb-3" />
              <p>Click "New Chat" above or select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {isNewChatModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Start New WhatsApp Chat</h3>
              <button type="button" onClick={() => setIsNewChatModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleStartNewChat} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Phone Number (with Country Code)</label>
                <input
                  type="text"
                  placeholder="e.g. 919876543210 (without + sign)"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Include country code (e.g., 91 for India) without '+' symbol.</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewChatModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  Start Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmWhatsapp;