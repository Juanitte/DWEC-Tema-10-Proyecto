import React from 'react';

export default function ChatMessages({ senderId, receiverId, currentUserId }) {



  return (
    <ul className="space-y-2 p-4">
      {messages.map(msg => {
        const isOwn = msg.senderId === currentUserId;
        return (
          <li
            key={msg.id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[70%] px-4 py-2 
                ${isOwn 
                  ? 'bg-green-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                  : 'bg-gray-200 text-gray-800 rounded-tr-lg rounded-br-lg rounded-tl-lg'}
              `}
            >
              {msg.text}
              {msg.timestamp && (
                <time className="block text-xs text-gray-500 mt-1 text-right">
                  {msg.timestamp}
                </time>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}