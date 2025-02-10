import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import DOMPurify from 'dompurify';
import './App.css'

interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

const socket = io('https://omegalul.ddns.net', { secure: true });// Replace with your server IP

const App: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    document.title = 'Clone Wars Checklist';

    var iconPath = "rex.jpg";
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

    if (!link) {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      document.head.appendChild(newLink);
      newLink.href = iconPath; // Replace with your favicon path
    } else {
      link.href = iconPath; // Replace with your favicon path
    }


    // Listen for checklist updates from the server
    socket.on('checklist-update', (updatedItems: ChecklistItem[]) => {
      setItems(updatedItems);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleComplete = (id: number, completed: boolean) => {
    socket.emit('toggle-item', id, completed); // Send the toggle event to the server
  };

  return (
    <div>
        <header className="header">
          <h1 className="h1">Clone Wars checklist</h1>
        </header>
        <main className="main">
          <section className="checklist">
          <h2 className="h2">Episodes</h2>
            <ul className="ul">
              {items.map((item) => (
                <li className="l1" key={item.id}>
                  <div className="checkbox-wrapper-4">
                    <input
                      className="inp-cbx"
                      id={`checkbox-${item.id}`}
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleComplete(item.id, item.completed)}
                    />
                    <label className="cbx" htmlFor={`checkbox-${item.id}`}>
                      <span>
                        <svg width="12px" height="10px">
                          <use xlinkHref="#check-4"></use>
                        </svg>
                      </span>
                      <span 
                        style={{ whiteSpace: 'pre-wrap' }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.text) }} />
                    </label>
                    <svg className="inline-svg">
                      <symbol id="check-4" viewBox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                      </symbol>
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
    </div>
  );
};

export default App;