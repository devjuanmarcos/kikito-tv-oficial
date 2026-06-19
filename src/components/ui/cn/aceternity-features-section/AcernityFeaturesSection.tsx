interface Props {
  theme?: 'light' | 'dark'
}

const CHAT_MESSAGES = [
  { from: 'sarah', alt: 'Sarah', avatar: 'https://assets.aceternity.com/avatars/1.webp',    text: 'Hey! Are you free for a quick call?' },
  { from: 'you',   alt: 'You',   avatar: 'https://assets.aceternity.com/avatars/manu.webp', text: 'Sure, give me 5 minutes!' },
  { from: 'tyler', alt: 'Tyler', avatar: 'https://assets.aceternity.com/avatars/8.webp',    text: 'Sounds good 👍' },
  { from: 'you',   alt: 'Sarah', avatar: 'https://assets.aceternity.com/avatars/manu.webp', text: "I'm not sure if I can make it." },
]

const CODE_LINES = [
  { cls: 'afs-line-purple', indent: 0,  width: '60%' },
  { cls: 'afs-line-gray',   indent: 8,  width: '75%' },
  { cls: 'afs-line-blue',   indent: 8,  width: '50%' },
  { cls: 'afs-line-gray',   indent: 16, width: '80%' },
  { cls: 'afs-line-green',  indent: 16, width: '45%' },
  { cls: 'afs-line-gray',   indent: 8,  width: '30%' },
  { cls: 'afs-line-purple', indent: 0,  width: '20%' },
]

export function AcernityFeaturesSection({ theme = 'light' }: Props) {
  return (
    <>
      <style>{`
        .afs-shell { display: flex; align-items: center; justify-content: center; font-family: 'Inter','Albert Sans',system-ui,sans-serif; }
        .afs-shell[data-theme='dark'] { background: var(--ks-lacquer-deep); }
        .afs-shell[data-theme='light'] { background: oklch(97% 0 0); }
        .afs-section { width: 100%; padding: 40px 0.75rem; }
        @media (min-width: 768px) { .afs-section { padding: 96px 1.5rem; } }
        @media (min-width: 1024px) { .afs-section { padding: 128px 64px; } }
        .afs-grid {
          display: grid; grid-template-columns: 1fr; max-width: 72rem;
          width: 100%; margin: 0 auto; border-radius: 16px; overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,.1); outline: 1px solid;
        }
        .afs-shell[data-theme='light'] .afs-grid { outline-color: rgba(0,0,0,.1); }
        .afs-shell[data-theme='dark']  .afs-grid { outline-color: rgba(255,255,255,.1); }
        @media (min-width: 768px) { .afs-grid { grid-template-columns: repeat(3,1fr); } }
        .afs-card { display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 40px; border-bottom: 1px solid; }
        .afs-shell[data-theme='light'] .afs-card { background: white; border-color: oklch(90% 0 0); }
        .afs-shell[data-theme='dark']  .afs-card { background: var(--ks-lacquer-raised); border-color: oklch(27% 0 0); }
        @media (min-width: 768px) { .afs-card { border-bottom: none; border-right: 1px solid; } .afs-card:last-child { border-right: none; } }
        .afs-card-viz { height: 240px; width: 100%; overflow: visible; border-radius: 6px; }
        .afs-card-text { margin-top: 1rem; }
        .afs-card-title { margin: 0; font-size: 1rem; font-weight: 700; letter-spacing: -0.01em; line-height: 1.4; }
        .afs-shell[data-theme='light'] .afs-card-title { color: oklch(32% 0 0); }
        .afs-shell[data-theme='dark']  .afs-card-title { color: oklch(87% 0 0); }
        .afs-card-desc { margin: 0.5rem 0 0; font-size: 1rem; letter-spacing: -0.01em; line-height: 1.5; }
        .afs-shell[data-theme='light'] .afs-card-desc { color: oklch(32% 0 0); }
        .afs-shell[data-theme='dark']  .afs-card-desc { color: var(--ks-text-muted, oklch(62% 0 0)); }
        /* Chat */
        .afs-chat-list { display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; height: 100%; }
        .afs-chat-row { display: flex; align-items: flex-start; gap: 0.5rem; }
        .afs-chat-right { flex-direction: row-reverse; }
        .afs-chat-avatar { width: 20px; height: 20px; flex-shrink: 0; border-radius: 9999px; object-fit: cover; animation: afs-avatar-in 600ms cubic-bezier(0.22,1,0.36,1) both; }
        .afs-chat-bubble { border-radius: 8px; padding: 4px 8px; font-size: 0.75rem; box-shadow: 0 1px 2px rgba(0,0,0,.05); outline: 1px solid; animation: afs-bubble-in 600ms cubic-bezier(0.22,1,0.36,1) both; }
        .afs-shell[data-theme='light'] .afs-chat-bubble { background: white; color: oklch(32% 0 0); outline-color: rgba(0,0,0,.05); }
        .afs-shell[data-theme='dark']  .afs-chat-bubble { background: oklch(27% 0 0); color: oklch(87% 0 0); outline-color: rgba(255,255,255,.05); }
        .afs-chat-row:nth-child(1) .afs-chat-avatar,.afs-chat-row:nth-child(1) .afs-chat-bubble { animation-delay: 0ms; }
        .afs-chat-row:nth-child(2) .afs-chat-avatar,.afs-chat-row:nth-child(2) .afs-chat-bubble { animation-delay: 180ms; }
        .afs-chat-row:nth-child(3) .afs-chat-avatar,.afs-chat-row:nth-child(3) .afs-chat-bubble { animation-delay: 360ms; }
        .afs-chat-row:nth-child(4) .afs-chat-avatar,.afs-chat-row:nth-child(4) .afs-chat-bubble { animation-delay: 540ms; }
        .afs-chat-row:not(.afs-chat-right) .afs-chat-bubble { --chat-x: -10px; }
        .afs-chat-right .afs-chat-bubble { --chat-x: 10px; }
        @keyframes afs-avatar-in { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes afs-bubble-in { from { opacity: 0; transform: translateX(var(--chat-x,0)); } to { opacity: 1; transform: translateX(0); } }
        /* File sharing */
        .afs-file-viz { position: relative; display: flex; height: 100%; align-items: center; justify-content: center; -webkit-mask-image: linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%); mask-image: linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%); }
        .afs-flow-lines { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; overflow: hidden; }
        .afs-flow-row { position: relative; height: 1px; width: 100%; }
        .afs-flow-dash { position: absolute; inset: 0; border-top: 1px dashed; }
        .afs-shell[data-theme='light'] .afs-flow-dash { border-color: oklch(90% 0 0); }
        .afs-shell[data-theme='dark']  .afs-flow-dash { border-color: oklch(35% 0 0); }
        .afs-flow-beam { position: absolute; top: 0; height: 1px; width: 48px; background: linear-gradient(to right, transparent, rgb(59,130,246), transparent); animation: afs-flow 2.2s linear infinite; }
        .afs-flow-row:nth-child(1) .afs-flow-beam { animation-delay: 0ms; }
        .afs-flow-row:nth-child(2) .afs-flow-beam { animation-delay: 220ms; }
        .afs-flow-row:nth-child(3) .afs-flow-beam { animation-delay: 440ms; }
        .afs-flow-row:nth-child(4) .afs-flow-beam { animation-delay: 660ms; }
        .afs-flow-row:nth-child(5) .afs-flow-beam { animation-delay: 880ms; }
        @keyframes afs-flow { 0% { opacity: 0; transform: translateX(0%); } 18% { opacity: 0.7; } 42% { opacity: 1; } 78% { opacity: 0.35; } 100% { opacity: 0; transform: translateX(800%); } }
        .afs-file-objects { position: relative; z-index: 10; display: flex; align-items: flex-end; gap: 48px; }
        .afs-folder { position: relative; cursor: pointer; perspective: 1000px; animation: afs-rise 700ms cubic-bezier(0.22,1,0.36,1) both; }
        .afs-folder-body { position: relative; width: 72px; height: 54px; transform-style: preserve-3d; }
        .afs-folder-back { position: absolute; inset: 0; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,.1); }
        .afs-shell[data-theme='light'] .afs-folder-back { background: linear-gradient(to bottom, oklch(78% .18 80), oklch(72% .19 78)); }
        .afs-shell[data-theme='dark']  .afs-folder-back { background: linear-gradient(to bottom, oklch(72% .19 78), oklch(66% .19 75)); }
        .afs-folder-tab { position: absolute; top: -8px; left: 6px; width: 26px; height: 10px; border-radius: 2px 2px 0 0; }
        .afs-shell[data-theme='light'] .afs-folder-tab { background: linear-gradient(to bottom, oklch(85% .15 80), oklch(78% .18 80)); }
        .afs-shell[data-theme='dark']  .afs-folder-tab { background: linear-gradient(to bottom, oklch(78% .18 80), oklch(72% .19 78)); }
        .afs-folder-file { position: absolute; top: 6px; left: 50%; z-index: 10; overflow: hidden; border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,.1); outline: 1px solid rgba(0,0,0,.1); transform-origin: bottom; transition: width 300ms cubic-bezier(0.22,1,0.36,1), height 300ms cubic-bezier(0.22,1,0.36,1), transform 300ms cubic-bezier(0.22,1,0.36,1); }
        .afs-shell[data-theme='light'] .afs-folder-file { background: white; }
        .afs-shell[data-theme='dark']  .afs-folder-file { background: oklch(27% 0 0); }
        .afs-folder-file[data-n='1'] { z-index: 10; width: 36px; height: 24px; transform: translateX(calc(-50% + 0px)) translateY(-10px) rotate(-3deg); }
        .afs-folder-file[data-n='2'] { z-index: 11; width: 36px; height: 24px; transform: translateX(calc(-50% + 0px)) translateY(-8px); }
        .afs-folder-file[data-n='3'] { z-index: 12; width: 36px; height: 24px; transform: translateX(calc(-50% + 0px)) translateY(-6px) rotate(3deg); }
        .afs-folder:hover .afs-folder-file[data-n='1'] { width: 56px; height: 40px; transform: translateX(calc(-50% - 32px)) translateY(-65px) rotate(-12deg); }
        .afs-folder:hover .afs-folder-file[data-n='2'] { width: 56px; height: 40px; transform: translateX(calc(-50% + 0px)) translateY(-60px); }
        .afs-folder:hover .afs-folder-file[data-n='3'] { width: 56px; height: 40px; transform: translateX(calc(-50% + 32px)) translateY(-55px) rotate(12deg); }
        .afs-folder-file-img { width: 100%; height: 100%; object-fit: cover; }
        .afs-folder-front { position: absolute; bottom: 0; left: 0; right: 0; height: 85%; z-index: 20; transform-origin: bottom; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,.1); transform-style: preserve-3d; transform: rotateX(-25deg); transition: transform 300ms cubic-bezier(0.22,1,0.36,1); }
        .afs-shell[data-theme='light'] .afs-folder-front { background: linear-gradient(to bottom, oklch(85% .15 80), oklch(78% .18 80)); }
        .afs-shell[data-theme='dark']  .afs-folder-front { background: linear-gradient(to bottom, oklch(78% .18 80), oklch(72% .19 78)); }
        .afs-folder:hover .afs-folder-front { transform: scaleY(0.8) rotateX(-45deg); }
        .afs-folder-front-line { position: absolute; top: 8px; right: 8px; left: 8px; height: 1px; }
        .afs-shell[data-theme='light'] .afs-folder-front-line { background: oklch(85% .15 80 / .5); }
        .afs-shell[data-theme='dark']  .afs-folder-front-line { background: oklch(85% .14 80 / .5); }
        .afs-server { position: relative; width: 56px; height: 72px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,.1); animation: afs-rise 760ms 160ms cubic-bezier(0.22,1,0.36,1) both; }
        .afs-shell[data-theme='light'] .afs-server { background: linear-gradient(to bottom, oklch(97% 0 0), oklch(97% 0 0)); }
        .afs-shell[data-theme='dark']  .afs-server { background: linear-gradient(to bottom, oklch(40% 0 0), oklch(27% 0 0)); }
        .afs-server-head { position: absolute; top: 6px; left: 6px; right: 6px; height: 12px; border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,.1); display: flex; align-items: center; justify-content: center; gap: 2px; }
        .afs-shell[data-theme='light'] .afs-server-head { background: white; outline: 1px solid rgba(0,0,0,.05); }
        .afs-shell[data-theme='dark']  .afs-server-head { background: oklch(12% 0 0); outline: 1px solid rgba(255,255,255,.05); }
        .afs-server-bar { width: 1px; height: 6px; }
        .afs-shell[data-theme='light'] .afs-server-bar { background: oklch(55% 0 0); }
        .afs-shell[data-theme='dark']  .afs-server-bar { background: oklch(45% 0 0); }
        .afs-server-cards { position: absolute; bottom: 6px; left: 6px; right: 6px; display: flex; flex-direction: column; gap: 4px; }
        .afs-server-card { height: 16px; border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
        .afs-shell[data-theme='light'] .afs-server-card { background: white; outline: 1px solid rgba(0,0,0,.05); }
        .afs-shell[data-theme='dark']  .afs-server-card { background: oklch(27% 0 0); outline: 1px solid rgba(255,255,255,.1); }
        .afs-server-card-line { margin: 4px 0 0 4px; width: 12px; height: 2px; border-radius: 9999px; }
        .afs-shell[data-theme='light'] .afs-server-card-line { background: oklch(75% 0 0); }
        .afs-shell[data-theme='dark']  .afs-server-card-line { background: oklch(42% 0 0); }
        @keyframes afs-rise { from { opacity: 0; transform: translateY(6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        /* Collab */
        .afs-collab-viz { position: relative; display: flex; height: 100%; align-items: center; justify-content: center; overflow: visible; }
        .afs-code-card { position: relative; width: 100%; max-width: 160px; border-radius: 8px; padding: 12px; box-shadow: 0 1px 2px rgba(0,0,0,.1); outline: 1px solid; animation: afs-rise 700ms cubic-bezier(0.22,1,0.36,1) both; }
        .afs-shell[data-theme='light'] .afs-code-card { background: white; outline-color: rgba(0,0,0,.1); }
        .afs-shell[data-theme='dark']  .afs-code-card { background: oklch(13% 0 0); outline-color: rgba(255,255,255,.1); }
        .afs-mac { display: flex; align-items: center; margin-bottom: 8px; }
        .afs-dots { display: flex; gap: 4px; }
        .afs-dot { width: 6px; height: 6px; border-radius: 9999px; }
        .afs-dot-r { background: #f87171; } .afs-dot-y { background: #facc15; } .afs-dot-g { background: #4ade80; }
        .afs-url-bar { margin-left: 8px; height: 6px; width: 48px; border-radius: 9999px; }
        .afs-shell[data-theme='light'] .afs-url-bar { background: oklch(90% 0 0); }
        .afs-shell[data-theme='dark']  .afs-url-bar { background: oklch(35% 0 0); }
        .afs-code-line { display: flex; align-items: center; margin: 6px 0; }
        .afs-code-line-bar { height: 6px; border-radius: 9999px; }
        .afs-line-purple { background: oklch(70% .15 295 / .6); }
        .afs-line-blue   { background: oklch(65% .15 240 / .6); }
        .afs-line-green  { background: oklch(70% .15 155 / .6); }
        .afs-line-gray   { background: oklch(60% 0 0 / .4); }
        .afs-shell[data-theme='light'] .afs-line-gray { background: oklch(80% 0 0); }
        .afs-shell[data-theme='dark']  .afs-line-gray { background: oklch(42% 0 0); }
        .afs-cursor { position: absolute; will-change: transform, opacity; }
        .afs-cursor[data-p='sarah'] { animation: afs-cursor-sarah 3.4s cubic-bezier(0.22,1,0.36,1) infinite alternate; }
        .afs-cursor[data-p='tyler'] { animation: afs-cursor-tyler 3.4s 0.25s cubic-bezier(0.22,1,0.36,1) infinite alternate; }
        @keyframes afs-cursor-sarah { 0% { opacity:0; transform: translateX(20px) translateY(15px); } 20% { opacity:1; } 100% { opacity:1; transform: translateX(84px) translateY(44px); } }
        @keyframes afs-cursor-tyler { 0% { opacity:0; transform: translateX(120px) translateY(75px); } 20% { opacity:1; } 100% { opacity:1; transform: translateX(60px) translateY(25px); } }
        .afs-cursor-icon { width: 20px; height: 20px; filter: drop-shadow(0 1px 2px rgba(0,0,0,.15)); }
        .afs-cursor-label { position: absolute; top: 20px; left: 12px; z-index: 50; display: flex; align-items: center; gap: 6px; border-radius: 9999px; padding: 4px 10px 4px 4px; box-shadow: 0 1px 2px rgba(0,0,0,.15); white-space: nowrap; }
        .afs-cursor-label[data-p='sarah'] { background: rgb(59,130,246); }
        .afs-cursor-label[data-p='tyler'] { background: rgb(16,185,129); }
        .afs-cursor-avatar { width: 20px; height: 20px; border-radius: 9999px; object-fit: cover; outline: 1px solid rgba(255,255,255,.3); }
        .afs-cursor-name { flex-shrink: 0; font-size: 0.625rem; font-weight: 500; color: white; }
        @media (prefers-reduced-motion: reduce) {
          .afs-chat-avatar,.afs-chat-bubble,.afs-flow-beam,.afs-folder,.afs-server,.afs-code-card,.afs-cursor { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
      <div className="afs-shell" data-theme={theme}>
        <section className="afs-section">
          <div className="afs-grid">
            {/* Card 1: Chat */}
            <div className="afs-card">
              <div className="afs-card-viz">
                <div className="afs-chat-list">
                  {CHAT_MESSAGES.map((msg, i) => (
                    <div key={i} className={`afs-chat-row${msg.from !== 'sarah' && msg.from !== 'tyler' ? ' afs-chat-right' : ''}`}>
                      <img src={msg.avatar} alt={msg.alt} className="afs-chat-avatar" />
                      <div className="afs-chat-bubble">{msg.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="afs-card-text">
                <h3 className="afs-card-title">Real time messaging</h3>
                <p className="afs-card-desc">Send and receive messages in real time with voice and text.</p>
              </div>
            </div>

            {/* Card 2: File sharing */}
            <div className="afs-card">
              <div className="afs-card-viz">
                <div className="afs-file-viz">
                  <div className="afs-flow-lines" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="afs-flow-row">
                        <div className="afs-flow-dash" />
                        <div className="afs-flow-beam" />
                      </div>
                    ))}
                  </div>
                  <div className="afs-file-objects">
                    <div className="afs-folder">
                      <div className="afs-folder-body">
                        <div className="afs-folder-back"><div className="afs-folder-tab" /></div>
                        {[
                          { n: '1', src: 'https://assets.aceternity.com/avatars/1.webp',    alt: 'File 1' },
                          { n: '2', src: 'https://assets.aceternity.com/avatars/manu.webp', alt: 'File 2' },
                          { n: '3', src: 'https://assets.aceternity.com/avatars/8.webp',    alt: 'File 3' },
                        ].map(f => (
                          <div key={f.n} className="afs-folder-file" data-n={f.n}>
                            <img src={f.src} alt={f.alt} className="afs-folder-file-img" />
                          </div>
                        ))}
                        <div className="afs-folder-front"><div className="afs-folder-front-line" /></div>
                      </div>
                    </div>
                    <div className="afs-server">
                      <div className="afs-server-head">
                        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="afs-server-bar" />)}
                      </div>
                      <div className="afs-server-cards">
                        {[1, 2].map(n => (
                          <div key={n} className="afs-server-card"><div className="afs-server-card-line" /></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="afs-card-text">
                <h3 className="afs-card-title">Secure file sharing</h3>
                <p className="afs-card-desc">Share files securely with end-to-end encryption.</p>
              </div>
            </div>

            {/* Card 3: Collaboration */}
            <div className="afs-card">
              <div className="afs-card-viz">
                <div className="afs-collab-viz">
                  <div className="afs-code-card">
                    <div className="afs-mac">
                      <div className="afs-dots">
                        <div className="afs-dot afs-dot-r" /><div className="afs-dot afs-dot-y" /><div className="afs-dot afs-dot-g" />
                      </div>
                      <div className="afs-url-bar" />
                    </div>
                    {CODE_LINES.map((line, i) => (
                      <div key={i} className="afs-code-line" style={{ paddingLeft: line.indent }}>
                        <div className={`afs-code-line-bar ${line.cls}`} style={{ width: line.width }} />
                      </div>
                    ))}
                    <div className="afs-cursor" data-p="sarah">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="afs-cursor-icon" style={{ color: 'rgb(59,130,246)' }} aria-hidden="true">
                        <path d="M3.039 4.277l3.904 13.563c.185.837.92 1.516 1.831 1.642l.17.016a2.2 2.2 0 0 0 1.982-1.006l.045-.078 1.4-2.072 4.05 4.05a2.067 2.067 0 0 0 2.924 0l1.047-1.047c.388-.388.606-.913.606-1.461l-.008-.182a2.067 2.067 0 0 0-.598-1.28l-4.047-4.048 2.103-1.412c.726-.385 1.18-1.278 1.053-2.189a2.2 2.2 0 0 0-1.701-1.845l-13.524-3.89a1 1 0 0 0-1.236 1.24z" fill="currentColor" strokeWidth="0" />
                      </svg>
                      <div className="afs-cursor-label" data-p="sarah">
                        <img src="https://assets.aceternity.com/avatars/1.webp" alt="Sarah" className="afs-cursor-avatar" />
                        <span className="afs-cursor-name">Sarah</span>
                      </div>
                    </div>
                    <div className="afs-cursor" data-p="tyler">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="afs-cursor-icon" style={{ color: 'rgb(16,185,129)' }} aria-hidden="true">
                        <path d="M3.039 4.277l3.904 13.563c.185.837.92 1.516 1.831 1.642l.17.016a2.2 2.2 0 0 0 1.982-1.006l.045-.078 1.4-2.072 4.05 4.05a2.067 2.067 0 0 0 2.924 0l1.047-1.047c.388-.388.606-.913.606-1.461l-.008-.182a2.067 2.067 0 0 0-.598-1.28l-4.047-4.048 2.103-1.412c.726-.385 1.18-1.278 1.053-2.189a2.2 2.2 0 0 0-1.701-1.845l-13.524-3.89a1 1 0 0 0-1.236 1.24z" fill="currentColor" strokeWidth="0" />
                      </svg>
                      <div className="afs-cursor-label" data-p="tyler">
                        <img src="https://assets.aceternity.com/avatars/8.webp" alt="Tyler" className="afs-cursor-avatar" />
                        <span className="afs-cursor-name">Tyler</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="afs-card-text">
                <h3 className="afs-card-title">Team collaboration</h3>
                <p className="afs-card-desc">Collaborate with your team in shared workspaces.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
