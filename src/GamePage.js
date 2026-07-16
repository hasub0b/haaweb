import React, { useEffect, useRef, useState, useCallback } from 'react';

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwSAug8VPgY7gIt6psTuW-FzTCin-xyyUxVuHVbgerOVik8X1_x9_DL6EuxLAiPr8_V/exec';

// ── Game constants ──────────────────────────────────────────────────────────
const GAME_W = 400;
const GAME_H = 580;
const BRIDE_W = 74;
const BRIDE_H = 74;
const BRIDE_Y = GAME_H - BRIDE_H - 8;   // top-y of bride sprite
const ITEM_SIZE = 54;
const LIVES_MAX = 3;

const BASE_SPEED = 2.5;
const SPEED_RAMP_EVERY_MS = 8000;        // difficulty ramp interval
const SPEED_RAMP_AMOUNT = 0.65;
const MAX_SPEED = 20;
const BASE_SPAWN_MS = 1000;
const MIN_SPAWN_MS = 500;
const SPAWN_RAMP_AMOUNT = 100;           // reduce spawn interval per level

const HAZARDS = new Set(['cloud', 'brokenHeart']);
const POINTS = { groom: 50, bouquet: 10, ring: 20 };

function pickType() {
  const r = Math.random() * 100;
  if (r < 15) return 'groom';       // 15 % — miss him and lose a life!
  if (r < 42) return 'bouquet';     // 27 %
  if (r < 60) return 'ring';        // 18 %
  if (r < 78) return 'cloud';       // 18 %
  return 'brokenHeart';             // 22 %
}

// ── Canvas drawing helpers ──────────────────────────────────────────────────

/** Dark storm cloud with rain streaks, centred at (x, y) */
function drawCloud(ctx, x, y) {
  const r = ITEM_SIZE * 0.44;
  ctx.save();

  ctx.fillStyle = '#8896a8';
  ctx.beginPath();
  ctx.arc(x,           y - r * 0.1,  r * 0.44, 0, Math.PI * 2);
  ctx.arc(x - r * 0.5, y + r * 0.1,  r * 0.32, 0, Math.PI * 2);
  ctx.arc(x + r * 0.5, y + r * 0.05, r * 0.37, 0, Math.PI * 2);
  ctx.arc(x,           y + r * 0.22, r * 0.40, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#4a7fb5';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  [
    [x - r * 0.34, y + r * 0.55, x - r * 0.46, y + r * 0.85],
    [x,            y + r * 0.60, x - r * 0.12, y + r * 0.92],
    [x + r * 0.34, y + r * 0.55, x + r * 0.22, y + r * 0.85],
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  ctx.restore();
}


/** Emoji helper (bouquet, ring, broken heart) */
function drawEmoji(ctx, emoji, x, y) {
  ctx.save();
  ctx.font = `${Math.round(ITEM_SIZE * 0.82)}px 'Apple Color Emoji', serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(emoji, x, y);
  ctx.restore();
}

/**
 * Groom stick-figure drawn centred at the CURRENT ORIGIN
 * (caller does ctx.translate + ctx.rotate before calling this).
 * When headImg is provided the PNG is clipped into the head circle
 * instead of drawing a plain circle.
 */
function drawGroomStick(ctx, size, headImg = null) {
  const r     = size * 0.4;
  const headY = -r * 0.70;   // head centre Y
  const headR =  r * 0.26;   // head radius

  ctx.save();
  ctx.strokeStyle = '#2c2c2c';
  ctx.fillStyle   = '#2c2c2c';
  ctx.lineWidth   = 2.5;
  ctx.lineCap     = 'round';

  // PNG head – drawn above the arms, no circle, no neck
  if (headImg) {
    const bigR = headR * 4;
    ctx.drawImage(headImg, -bigR, headY - bigR, bigR * 2, bigR * 2);
  }
  // Body starts well below the oversized head PNG (bottom of PNG ≈ r*0.34)
  // Arms
  ctx.beginPath();
  ctx.moveTo(-r * 0.78, r * 0.55);
  ctx.lineTo( r * 0.78, r * 0.55);
  ctx.stroke();

  // Lower body (arm junction → waist)
  ctx.beginPath();
  ctx.moveTo(0, r * 0.55);
  ctx.lineTo(0, r * 0.85);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(0,  r * 0.85);
  ctx.lineTo(-r * 0.44, r * 1.43);
  ctx.moveTo(0,  r * 0.85);
  ctx.lineTo( r * 0.44, r * 1.43);
  ctx.stroke();

  ctx.restore();
}

/**
 * Bride stick-figure drawn in absolute game coords.
 * topY is the top of the sprite bounding box.
 */
function drawBrideStick(ctx, cx, topY, w, h) {
  ctx.save();
  const headR = w * 0.15;
  const headCY = topY + headR * 1.4;
  ctx.lineCap = 'round';

  // Veil
  ctx.fillStyle = '#f5f0e8';
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - headR * 1.7, headCY - headR * 0.7);
  ctx.lineTo(cx + headR * 1.7, headCY - headR * 0.7);
  ctx.lineTo(cx + headR * 1.2, headCY + headR * 1.8);
  ctx.lineTo(cx - headR * 1.2, headCY + headR * 1.8);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Head
  ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, headCY, headR, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  const bodyTop = headCY + headR;
  const bodyMid = topY + h * 0.54;
  ctx.beginPath();
  ctx.moveTo(cx, bodyTop);
  ctx.lineTo(cx, bodyMid);
  ctx.stroke();

  // Arms
  const armY = bodyTop + (bodyMid - bodyTop) * 0.28;
  ctx.beginPath();
  ctx.moveTo(cx, armY);
  ctx.lineTo(cx - w * 0.36, armY + (bodyMid - bodyTop) * 0.38);
  ctx.moveTo(cx, armY);
  ctx.lineTo(cx + w * 0.36, armY + (bodyMid - bodyTop) * 0.38);
  ctx.stroke();

  // Dress (triangle)
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.10, bodyMid);
  ctx.lineTo(cx - w * 0.44, topY + h);
  ctx.lineTo(cx + w * 0.44, topY + h);
  ctx.lineTo(cx + w * 0.10, bodyMid);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.restore();
}

// ── Component ───────────────────────────────────────────────────────────────

export function GamePage({ onClose }) {
  const canvasRef      = useRef(null);
  const gameActiveRef  = useRef(false);
  const rafRef         = useRef(null);
  const imgsRef        = useRef({ bride: null, groom: null, brideOk: false, groomOk: false });
  const pointerXRef    = useRef(null);   // current pointer X in game coords
  const scaleRef       = useRef(1);      // CSS px → game coord factor

  const [phase, setPhase]               = useState('loading'); // loading | start | playing | gameover | leaderboard
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(LIVES_MAX);
  const [playerName, setPlayerName]     = useState('');
  const [leaderboard, setLeaderboard]   = useState([]);
  const [submitting, setSubmitting]     = useState(false);
  const [fetchError, setFetchError]     = useState(false);
  const [lbLoading, setLbLoading]       = useState(false);

  // ── Image loading ───────────────────────────────────────────────────────
  useEffect(() => {
    let done = 0;
    const finish = () => { if (++done === 2) setPhase('start'); };

    const bride = new Image();
    bride.onload = () => { imgsRef.current.brideOk = true; finish(); };
    bride.onerror = finish;
    bride.src = `${process.env.PUBLIC_URL}/bride.png`;
    imgsRef.current.bride = bride;

    const groom = new Image();
    groom.onload = () => { imgsRef.current.groomOk = true; finish(); };
    groom.onerror = finish;
    groom.src = `${process.env.PUBLIC_URL}/groom.png`;
    imgsRef.current.groom = groom;
  }, []);

  // ── Fetch leaderboard on start screen ──────────────────────────────────
  useEffect(() => {
    if (phase === 'start') fetchLeaderboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Auto-refresh leaderboard every 30 s while playing ──────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    fetchLeaderboard();
    const id = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Game loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Responsive canvas – fill container width up to GAME_W
    const dpr  = window.devicePixelRatio || 1;
    const cssW = Math.min(canvas.parentElement?.clientWidth ?? GAME_W, GAME_W);
    const cssH = Math.round(cssW * GAME_H / GAME_W);
    const scale = cssW / GAME_W;
    scaleRef.current = scale;

    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width  = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    ctx.scale(dpr * scale, dpr * scale);

    // Game state (all via plain object – no React state in the loop)
    const state = {
      items: [],
      brideX: GAME_W / 2,
      score: 0,
      lives: LIVES_MAX,
      elapsed: 0,
      lastSpawnTime: -9999,
      nextSpawnDelay: BASE_SPAWN_MS,
    };
    gameActiveRef.current = true;
    let lastTs = null;

    const loop = (ts) => {
      if (!gameActiveRef.current) return;
      if (lastTs === null) lastTs = ts;
      const dt = Math.min(ts - lastTs, 50);
      lastTs = ts;
      state.elapsed += dt;

      // Difficulty ramp
      const level    = Math.floor(state.elapsed / SPEED_RAMP_EVERY_MS);
      const speed    = Math.min(BASE_SPEED + level * SPEED_RAMP_AMOUNT, MAX_SPEED);
      const spawnMs  = Math.max(BASE_SPAWN_MS - level * SPAWN_RAMP_AMOUNT, MIN_SPAWN_MS);

      // Bride follows pointer
      const targetX = pointerXRef.current ?? state.brideX;
      state.brideX += (targetX - state.brideX) * 0.18;
      state.brideX  = Math.max(BRIDE_W / 2, Math.min(GAME_W - BRIDE_W / 2, state.brideX));

      // Spawn
      if (ts - state.lastSpawnTime > state.nextSpawnDelay) {
        const margin = ITEM_SIZE * 0.6;
        state.items.push({
          type:     pickType(),
          x:        margin + Math.random() * (GAME_W - margin * 2),
          y:        -ITEM_SIZE / 2,
          rot:      0,
          rotDir:   Math.random() < 0.5 ? 1 : -1,
          rotSpeed: 0.055 + Math.random() * 0.045,
        });
        state.lastSpawnTime = ts;
        // randomise next interval: 60 %–140 % of the base ramp value
        state.nextSpawnDelay = spawnMs * (0.6 + Math.random() * 0.8);
      }

      // Update items + collision detection
      const catchL   = state.brideX - BRIDE_W * 0.58;
      const catchR   = state.brideX + BRIDE_W * 0.58;
      const catchTop = BRIDE_Y - ITEM_SIZE * 0.35;
      const catchBot = BRIDE_Y + BRIDE_H * 0.55;
      const toRemove = [];
      let died = false;

      for (let i = 0; i < state.items.length; i++) {
        const item = state.items[i];
        item.y += speed * (dt / 16.67);
        if (item.type === 'groom') item.rot += item.rotDir * item.rotSpeed * (dt / 16.67);

        // Catch zone collision
        if (item.y >= catchTop && item.y <= catchBot && item.x >= catchL && item.x <= catchR) {
          toRemove.push(i);
          if (HAZARDS.has(item.type)) {
            state.lives--;
          } else {
            state.score += POINTS[item.type] || 10;
          }
          if (state.lives <= 0) { died = true; break; }
          continue;
        }

        // Off-screen at bottom – missing any good item costs a life
        if (item.y > GAME_H + ITEM_SIZE) {
          toRemove.push(i);
          if (!HAZARDS.has(item.type)) {
            state.lives--;
            if (state.lives <= 0) { died = true; break; }
          }
        }
      }

      if (died) {
        gameActiveRef.current = false;
        setDisplayScore(state.score);
        setPhase('gameover');
        return;
      }

      // Remove caught/missed items (reverse to keep indices valid)
      for (let i = toRemove.length - 1; i >= 0; i--) state.items.splice(toRemove[i], 1);

      // Sync UI counters
      setDisplayScore(state.score);
      setDisplayLives(state.lives);

      // ── Draw ─────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, GAME_W, GAME_H);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, GAME_H);
      bg.addColorStop(0, '#fdf6f0');
      bg.addColorStop(1, '#ede6dc');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      // Items
      for (const item of state.items) {
        if (item.type === 'groom') {
          ctx.save();
          ctx.translate(item.x, item.y);
          ctx.rotate(item.rot);
          // Always draw the stick-figure; pass the PNG so it replaces only the head circle
          drawGroomStick(ctx, ITEM_SIZE, imgsRef.current.groomOk ? imgsRef.current.groom : null);
          ctx.restore();
        } else if (item.type === 'cloud') {
          drawCloud(ctx, item.x, item.y);
        } else if (item.type === 'brokenHeart') {
          drawEmoji(ctx, '💔', item.x, item.y);
        } else if (item.type === 'bouquet') {
          drawEmoji(ctx, '💐', item.x, item.y);
        } else {
          drawEmoji(ctx, '💍', item.x, item.y);
        }
      }

      // Bride
      if (imgsRef.current.brideOk) {
        ctx.drawImage(imgsRef.current.bride, state.brideX - BRIDE_W / 2, BRIDE_Y, BRIDE_W, BRIDE_H);
      } else {
        drawBrideStick(ctx, state.brideX, BRIDE_Y, BRIDE_W, BRIDE_H);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      gameActiveRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  // ── Pointer / touch tracking ────────────────────────────────────────────
  const toGameX = useCallback((clientX) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return (clientX - rect.left) / scaleRef.current;
  }, []);

  const handleMouseMove  = useCallback((e) => { pointerXRef.current = toGameX(e.clientX); }, [toGameX]);
  const handleTouchMove  = useCallback((e) => { e.preventDefault(); pointerXRef.current = toGameX(e.touches[0].clientX); }, [toGameX]);
  const handleTouchStart = useCallback((e) => { pointerXRef.current = toGameX(e.touches[0].clientX); }, [toGameX]);

  // ── Leaderboard ─────────────────────────────────────────────────────────
  const fetchLeaderboard = async () => {
    setFetchError(false);
    setLbLoading(true);
    try {
      const res  = await fetch(`${SCRIPT_URL}?action=getScores`);
      const data = await res.json();
      setLeaderboard(data.scores || []);
    } catch {
      setFetchError(true);
      setLeaderboard([]);
    } finally {
      setLbLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!playerName.trim() || submitting) return;
    setSubmitting(true);
    // Save score – fire-and-forget with no-cors, same pattern as RSVP
    try {
      await fetch(
        `${SCRIPT_URL}?action=saveScore&name=${encodeURIComponent(playerName.trim())}&score=${displayScore}`,
        { mode: 'no-cors' }
      );
    } catch { /* ignore */ }
    // Brief pause to let the sheet process before fetching
    await new Promise(r => setTimeout(r, 1800));
    await fetchLeaderboard();
    setSubmitting(false);
    setPhase('leaderboard');
  };

  const playAgain = () => {
    pointerXRef.current = null;
    setDisplayScore(0);
    setDisplayLives(LIVES_MAX);
    setPlayerName('');
    setPhase('start');
  };

  // ── Shared styles ────────────────────────────────────────────────────────
  const C = { primary: '#2c5f5d', accent: '#d4a574', cream: '#faf8f5', text: '#2c2c2c', border: '#e5e0d8' };

  const btn = (bg, color, extra = {}) => ({
    width: '100%',
    padding: '0.85rem',
    background: bg,
    color,
    border: bg === 'none' ? `1px solid ${C.primary}` : 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: '1px',
    cursor: 'pointer',
    ...extra,
  });

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: C.cream,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: "'Montserrat', sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        width: '100%', padding: '0.7rem 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        borderBottom: `1px solid ${C.border}`,
        background: 'rgba(250,248,245,0.97)',
        flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#aaa', lineHeight: 1, padding: '0.25rem' }}
          aria-label="Close game"
        >
          ✕
        </button>
      </div>

      {/* ── Main area ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        width: '100%', padding: '1rem', overflow: 'auto',
      }}>

        {/* Loading */}
        {phase === 'loading' && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: C.primary, fontSize: '1.5rem' }}>
            Ladataan...
          </p>
        )}

        {/* Start screen */}
        {phase === 'start' && (
          <div style={{ textAlign: 'center', maxWidth: '380px', width: '90%' }}>
            <button
              onClick={() => { pointerXRef.current = null; setPhase('playing'); }}
              style={btn(C.primary, '#fff', { marginBottom: '1.8rem', fontSize: '1rem', letterSpacing: '2px' })}
            >
              Pelaa!
            </button>

            <div style={{ color: C.accent, fontSize: '0.72rem', letterSpacing: '3px', marginBottom: '0.75rem' }}>
              TULOSLISTAUS
            </div>

            {lbLoading ? (
              <p style={{ color: '#aaa', marginBottom: '1.5rem', fontSize: '0.88rem' }}>Ladataan...</p>
            ) : fetchError ? (
              <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: '1rem' }}>
                Tuloksia ei voitu ladata
              </p>
            ) : leaderboard.length === 0 ? (
              <p style={{ color: '#aaa', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                Ei vielä tuloksia – ole ensimmäinen!
              </p>
            ) : (
              <div style={{
                border: `1px solid ${C.border}`,
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '1rem',
              }}>
                {leaderboard.map((entry, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 1rem',
                      background: i % 2 === 0 ? 'rgba(44,95,93,0.05)' : '#fff',
                      borderBottom: i < leaderboard.length - 1 ? `1px solid ${C.border}` : 'none',
                    }}
                  >
                    <span style={{ color: i === 0 ? C.accent : '#ccc', width: '1.4rem', flexShrink: 0, fontWeight: 600 }}>
                      {i + 1}.
                    </span>
                    <span style={{ flex: 1, textAlign: 'left', color: C.text, fontSize: '0.9rem' }}>{entry.name}</span>
                    <span style={{ fontWeight: 600, color: C.primary, fontSize: '0.9rem' }}>{entry.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Canvas */}
        {phase === 'playing' && (
          <div style={{ width: '100%', maxWidth: `${GAME_W}px` }}>
            {/* HUD – sits directly above the game window */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.45rem 0.85rem',
              background: 'rgba(250,248,245,0.97)',
              border: `1px solid ${C.border}`,
              borderBottom: 'none',
              borderRadius: '8px 8px 0 0',
            }}>
              <span style={{ color: C.accent, fontWeight: 600, fontSize: '0.95rem' }}>★ {displayScore}</span>
              <span style={{ fontSize: '1rem', letterSpacing: '2px' }}>
                {'❤️'.repeat(displayLives)}{'🖤'.repeat(LIVES_MAX - displayLives)}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#6dbf7e' }}>✓:</span>
                <span>🤵 💍 💐</span>
                <span style={{ display: 'inline-block', width: '10px' }} />
                <span style={{ color: '#c97070' }}>✗:</span>
                <span>🌧️ 💔</span>
              </span>
            </div>
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              style={{
                display: 'block',
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                touchAction: 'none',
                userSelect: 'none',
              }}
            />

            {/* In-game ticker banner */}
            {leaderboard.length > 0 && (
              <>
                <style>{`
                  @keyframes game-ticker {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                `}</style>
                <div style={{
                  marginTop: '0.6rem',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: C.primary,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <div style={{
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 0.7rem',
                    background: C.accent,
                    color: '#fff',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    whiteSpace: 'nowrap',
                  }}>
                    TOP 5
                  </div>
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{
                      display: 'inline-flex',
                      whiteSpace: 'nowrap',
                      animation: `game-ticker ${leaderboard.slice(0, 5).length * 6}s linear infinite`,
                    }}>
                      {[0, 1].map(copy => (
                        <span key={copy}>
                          {leaderboard.slice(0, 5).map((entry, i) => (
                            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.38rem 0' }}>
                              <span style={{ color: C.accent, fontSize: '0.72rem', fontWeight: 700, marginLeft: '1.2rem' }}>
                                {i + 1}.
                              </span>
                              <span style={{ color: '#fff', fontSize: '0.72rem', marginLeft: '0.3rem' }}>
                                {entry.name}
                              </span>
                              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginLeft: '0.35rem' }}>
                                {entry.score}
                              </span>
                              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', marginLeft: '1.2rem' }}>
                                ✦
                              </span>
                            </span>
                          ))}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Game Over */}
        {phase === 'gameover' && (
          <div style={{ textAlign: 'center', maxWidth: '340px', width: '90%' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', color: C.primary, marginBottom: '0.2rem' }}>
              Game Over
            </div>
            <div style={{ fontSize: '0.75rem', color: '#aaa', letterSpacing: '2px', marginBottom: '0.3rem' }}>
              PISTEET
            </div>
            <div style={{ fontSize: '3.8rem', fontWeight: 700, color: C.accent, lineHeight: 1, marginBottom: '2rem' }}>
              {displayScore}
            </div>

            <label style={{ display: 'block', color: '#666', fontSize: '0.94rem', marginBottom: '0.5rem' }}>
              Nimesi tulostauluun (<strong>ps. parhaat palkitaan</strong>)
            </label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Nimi"
              maxLength={20}
              autoFocus
              style={{
                width: '100%', padding: '0.75rem',
                border: `1px solid ${C.border}`, borderRadius: '4px',
                fontSize: '1rem', fontFamily: "'Montserrat', sans-serif",
                textAlign: 'center', marginBottom: '1rem', outline: 'none',
                background: '#fff',
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={!playerName.trim() || submitting}
              style={btn(
                !playerName.trim() || submitting ? '#bbb' : C.primary,
                '#fff',
                { marginBottom: '0.75rem', cursor: !playerName.trim() || submitting ? 'not-allowed' : 'pointer' }
              )}
            >
              {submitting ? 'Lähetetään...' : 'Katso tulokset'}
            </button>

            <button onClick={playAgain} style={btn('none', C.primary)}>
              Pelaa uudelleen
            </button>
          </div>
        )}

        {/* Leaderboard */}
        {phase === 'leaderboard' && (
          <div style={{ textAlign: 'center', maxWidth: '380px', width: '90%' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: C.primary, marginBottom: '0.1rem' }}>
              Tulostaulukko
            </div>
            <div style={{ color: C.accent, fontSize: '0.75rem', letterSpacing: '3px', marginBottom: '1.5rem' }}>
              TOP 10
            </div>

            {fetchError && (
              <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: '1rem' }}>
                Tuloksia ei voitu ladata
              </p>
            )}

            {leaderboard.length === 0 && !fetchError ? (
              <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
                Ei vielä tuloksia
              </p>
            ) : (
              <div style={{
                marginBottom: '1.5rem',
                border: `1px solid ${C.border}`,
                borderRadius: '6px',
                overflow: 'hidden',
              }}>
                {leaderboard.map((entry, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.65rem 1rem',
                      background: i % 2 === 0 ? 'rgba(44,95,93,0.05)' : '#fff',
                      borderBottom: i < leaderboard.length - 1 ? `1px solid ${C.border}` : 'none',
                    }}
                  >
                    <span style={{ color: i === 0 ? C.accent : '#ccc', width: '1.4rem', flexShrink: 0, fontWeight: 600 }}>
                      {i + 1}.
                    </span>
                    <span style={{ flex: 1, textAlign: 'left', color: C.text }}>{entry.name}</span>
                    <span style={{ fontWeight: 600, color: C.primary }}>{entry.score}</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={playAgain} style={btn(C.primary, '#fff')}>
              Pelaa uudelleen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
