import React, { useState } from 'react';
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';

const conversations = [
  { id: 1, name: 'Iva Ryan', avatar: 'https://i.pravatar.cc/150?u=iva', lastMessage: 'The report is ready for your review.', time: '10:30 AM', unread: 2, status: 'online' },
  { id: 2, name: 'Kurt Bates', avatar: 'https://i.pravatar.cc/150?u=kurt', lastMessage: 'When can we discuss the budget?', time: '9:15 AM', unread: 0, status: 'offline' },
  { id: 3, name: 'James Hall', avatar: 'https://i.pravatar.cc/150?u=james', lastMessage: 'Thanks for the help today!', time: 'Yesterday', unread: 0, status: 'online' },
  { id: 4, name: 'Kenneth Allen', avatar: 'https://i.pravatar.cc/150?u=kenneth', lastMessage: 'Sent you the invoice.', time: 'Monday', unread: 0, status: 'offline' },
];

const MessagePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState({
    1: [
      { id: 101, text: 'Hello! How are things going with the financial tracking module?', time: '10:25 AM', sent: false },
      { id: 102, text: 'Hi Iva, it\'s going great! Almost finished with the UI matches.', time: '10:28 AM', sent: true },
    ],
    2: [
      { id: 201, text: 'Hey Purva, can we review the budget for next quarter?', time: '9:05 AM', sent: false },
    ],
    3: [
      { id: 301, text: 'Thanks for the help today!', time: 'Yesterday', sent: false },
    ],
    4: [
      { id: 401, text: 'Sent you the invoice.', time: 'Monday', sent: false },
    ]
  });

  const selectedChat = conversations.find(c => c.id === selectedChatId);
  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true
    };

    setChatHistory(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));
    setMessage('');

    // Mock auto-reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: "Thanks for your message! I'll get back to you shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sent: false
      };
      setChatHistory(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), reply]
      }));
    }, 1500);
  };

  return (
    <div className="dashboard-content">
      <div className="message-page animate-fade">
        <div className="chat-sidebar-inner">
        <div className="sidebar-header-inner">
          <h2 className="serif" style={{ fontSize: '28px', marginBottom: '20px' }}>Messages</h2>
          <div className="search-box-inner">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search contact..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-list-inner">
          {filteredConversations.map(chat => (
            <div 
              key={chat.id} 
              className={`chat-item-inner ${selectedChatId === chat.id ? 'active' : ''}`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div className="avatar-wrapper">
                <img src={chat.avatar} alt={chat.name} className="avatar-msg" />
                <span className={`status-dot ${chat.status}`}></span>
              </div>
              <div className="chat-info-inner">
                <div className="chat-name-row">
                  <span className="name">{chat.name}</span>
                  <span className="time">{chat.time}</span>
                </div>
                <div className="chat-msg-row">
                  <p className="last-message">
                    {chatHistory[chat.id]?.[chatHistory[chat.id].length - 1]?.text || chat.lastMessage}
                  </p>
                  {chat.unread > 0 && selectedChatId !== chat.id && (
                    <span className="unread-badge-msg">{chat.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-window-inner">
        {selectedChat ? (
          <>
            <div className="chat-header-top">
              <div className="header-contact-info">
                <img src={selectedChat.avatar} alt={selectedChat.name} className="avatar-msg" />
                <div className="contact-text">
                  <span className="name">{selectedChat.name}</span>
                  <span className="status">{selectedChat.status === 'online' ? 'Online' : 'Last seen 2h ago'}</span>
                </div>
              </div>
              <div className="header-actions-msg">
                <button className="action-btn-msg"><Phone size={20} /></button>
                <button className="action-btn-msg"><Video size={20} /></button>
                <button className="action-btn-msg"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="chat-history-inner">
              {chatHistory[selectedChatId]?.map(msg => (
                <div key={msg.id} className={`message-bubble ${msg.sent ? 'sent' : 'received'}`}>
                  <p>{msg.text}</p>
                  <span className="time-bubble">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-row">
              <button type="button" className="icon-btn-msg"><Paperclip size={20} /></button>
              <div className="input-wrapper-msg">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="button" className="icon-btn-msg"><Smile size={20} /></button>
              </div>
              <button type="submit" className="send-btn-msg" disabled={!message.trim()}>
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-state">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .message-page {
          display: flex;
          height: calc(100vh - 120px);
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
        }

        .chat-sidebar-inner {
          width: 320px;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          background: #fdfdfd;
        }

        .sidebar-header-inner {
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .search-box-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-main);
          padding: 10px 16px;
          border-radius: 12px;
          color: var(--text-muted);
        }

        .search-box-inner input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          width: 100%;
        }

        .chat-list-inner {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .chat-item-inner {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 4px;
        }

        .chat-item-inner:hover {
          background: var(--bg-main);
        }

        .chat-item-inner.active {
          background: var(--primary-light);
          color: var(--primary);
        }

        .chat-item-inner.active .last-message {
          color: var(--primary);
          opacity: 0.8;
        }

        .avatar-msg {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-wrapper {
          position: relative;
        }

        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .status-dot.online { background: var(--success); }
        .status-dot.offline { background: #cbd5e1; }

        .chat-info-inner {
          flex: 1;
        }

        .chat-name-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .chat-name-row .name { font-weight: 600; font-size: 14px; }
        .chat-name-row .time { font-size: 12px; color: var(--text-muted); }

        .chat-msg-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .last-message {
          font-size: 13px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }

        .unread-badge-msg {
          background: var(--primary);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .chat-window-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat-header-top {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-contact-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .contact-text .name { display: block; font-weight: 700; font-size: 16px; }
        .contact-text .status { font-size: 12px; color: var(--success); font-weight: 500; }

        .header-actions-msg {
          display: flex;
          gap: 8px;
        }

        .action-btn-msg {
          color: var(--text-muted);
          padding: 8px;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .action-btn-msg:hover {
          background: var(--bg-main);
          color: var(--primary);
        }

        .chat-history-inner {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #fafafa;
        }

        .message-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          position: relative;
        }

        .message-bubble.received {
          align-self: flex-start;
          background: white;
          color: var(--text-main);
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .message-bubble.sent {
          align-self: flex-end;
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(155, 126, 189, 0.2);
        }

        .time-bubble {
          display: block;
          font-size: 10px;
          margin-top: 4px;
          opacity: 0.7;
          text-align: right;
        }

        .chat-input-row {
          padding: 20px 24px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .input-wrapper-msg {
          flex: 1;
          background: var(--bg-main);
          border-radius: 12px;
          padding: 4px 16px;
          display: flex;
          align-items: center;
        }

        .input-wrapper-msg input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          padding: 10px 0;
          font-size: 14px;
        }

        .icon-btn-msg {
          color: var(--text-muted);
          padding: 8px;
          transition: color 0.2s;
        }

        .icon-btn-msg:hover { color: var(--primary); }

        .send-btn-msg {
          background: var(--primary);
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .send-btn-msg:hover { transform: scale(1.05); }

        .no-chat-state {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .message-page {
            flex-direction: column;
            height: calc(100vh - 160px);
          }
          .chat-sidebar-inner {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
            height: 40%;
          }
          .chat-window-inner {
            height: 60%;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default MessagePage;
