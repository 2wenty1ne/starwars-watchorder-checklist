import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css'

interface Episode {
  id: number,
  displayCount: string,
  epCount: string, 
  titleLink: string, 
  title: string, 
  dLink: string, 
  completed: boolean
}

const socket = io('https://omegalul.ddns.net', { secure: true });

const App: React.FC = () => {
  const [items, setItems] = useState<Episode[]>([]);

  useEffect(() => {
    // Listen for checklist updates from the server
    socket.on('checklist-update', (updatedItems: Episode[]) => {
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

                      <div className="row-container">
                        <div className="ep-num">{item.displayCount}</div>
                        <div className="ep-count">{item.epCount}</div>
                        <div className="ep-links">
                          <a className="a" target="_blank" rel="noopener noreferrer" href={item.titleLink}>{item.title}</a>
                          &nbsp;|&nbsp;
                          <a className="a" target="_blank" rel="noopener noreferrer" href={item.dLink}>Disney+ Stream</a>
                        </div>
                      </div>
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