* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
  background-color: #0b0e14;
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  user-select: none;
}

.game-wrapper {
  width: 100%;
  max-width: 820px;
}

.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.8rem 1.2rem;
  background-color: #161b26;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 12px;
}

.title {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.title span {
  color: #f59e0b;
}

.scores {
  display: flex;
  gap: 1.5rem;
  font-size: 1.05rem;
  color: #94a3b8;
}

.scores strong {
  color: #f59e0b;
  font-size: 1.2rem;
}

.canvas-box {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #334155;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

canvas {
  display: block;
  width: 100%;
  height: auto;
  background-color: #111622;
  transition: background-color 0.6s ease;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 14, 20, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
}

.overlay h2 {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  margin-bottom: 0.6rem;
  color: #f59e0b;
}

.overlay p {
  color: #cbd5e1;
  margin-bottom: 1.5rem;
  max-width: 480px;
}

#startBtn {
  background-color: #f59e0b;
  color: #0b0e14;
  border: none;
  padding: 0.9rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
  transition: transform 0.15s;
}

#startBtn:hover {
  transform: scale(1.05);
}

.controls-hint {
  text-align: center;
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.9rem;
}

.controls-hint span {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #334155;
}
