$(function () {

  /* ══ STATE ══════════════════════════════════ */
  const COLORS = ['green', 'red', 'yellow', 'blue'];
  let sequence = [], playerIndex = 0;
  let round = 0, best = 0;
  let playing = false, playerTurn = false;

  /* ══ AUDIO ══════════════════════════════════ */
  let audioCtx;
  const FREQ = { green: 392, red: 330, yellow: 262, blue: 294 };

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playTone(color, dur = 0.35) {
    const ctx = getCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine'; osc.frequency.value = FREQ[color];
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  }

  function playError() {
    const ctx = getCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sawtooth'; osc.frequency.value = 100;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
    osc.start(); osc.stop(ctx.currentTime + 1.0);
  }

  /* ══ UI HELPERS ═════════════════════════════ */
  function setStatus(msg, cls) {
    $('#status-msg').attr('class', cls || '').text(msg);
  }

  function buildDots(n) {
    $('#progress-dots').empty();
    for (let i = 0; i < n; i++) $('#progress-dots').append($('<div class="dot">').attr('id', 'dot-' + i));
  }

  function markDot(i, state) { $('#dot-' + i).removeClass('done current wrong').addClass(state); }

  function lightPad(color, dur) {
    return new Promise(res => {
      playTone(color, dur / 1000);
      $('#pad-' + color).addClass('lit');
      setTimeout(() => { $('#pad-' + color).removeClass('lit'); setTimeout(res, 90); }, dur);
    });
  }

  function lockPads()   { $('.pad').css('pointer-events','none').removeClass('active'); }
  function unlockPads() { $('.pad').css('pointer-events','auto').addClass('active'); }

  /* ══════════════════════════════════════════════════════
     REQUIREMENT 1 ── START THE GAME
  ════════════════════════════════════════════════════════ */
  function startGame() {
    sequence = []; playerIndex = 0; round = 0;
    playing = true; playerTurn = false;

    $('#btn-start').prop('disabled', true);
    $('#btn-restart').removeClass('show');
    $('#disp-round').text('--');
    buildDots(0);
    setStatus('GET READY...', 'info');
    lockPads();

    setTimeout(addRound, 900);
  }

  function addRound() {
    round++;
    sequence.push(COLORS[Math.floor(Math.random() * 4)]);
    $('#disp-round').text(round);
    if (round > best) { best = round; $('#disp-best').text(best); }

    buildDots(sequence.length);
    setTimeout(playSequence, 700);
  }

  async function playSequence() {
    lockPads();
    setStatus('WATCH THE SEQUENCE...', 'info');
    const spd = round <= 5 ? 550 : round <= 9 ? 420 : round <= 13 ? 300 : 230;

    for (let i = 0; i < sequence.length; i++) {
      await lightPad(sequence[i], Math.floor(spd * 0.72));
      await new Promise(r => setTimeout(r, spd - Math.floor(spd * 0.72)));
    }

    playerIndex = 0; playerTurn = true;
    unlockPads();
    setStatus('YOUR TURN! (' + sequence.length + ' steps)', 'info');
    markDot(0, 'current');
  }

  /* ══════════════════════════════════════════════════════
     REQUIREMENT 2 ── CHECK USER'S ANSWER AGAINST SEQUENCE
  ════════════════════════════════════════════════════════ */
  function checkAnswer(color) {
    if (!playerTurn || !playing) return;

    playTone(color, 0.22);
    $('#pad-' + color).addClass('lit');
    setTimeout(() => $('#pad-' + color).removeClass('lit'), 220);

    const expected = sequence[playerIndex];

    if (color === expected) {
      markDot(playerIndex, 'done');
      playerIndex++;

      if (playerIndex < sequence.length) {
        markDot(playerIndex, 'current');
        setStatus('✓ CORRECT — KEEP GOING!', 'correct');
      } else {
        playerTurn = false;
        lockPads();
        setStatus('✓ SEQUENCE COMPLETE!', 'correct');
        setTimeout(addRound, 1000);
      }

    } else {
      markDot(playerIndex, 'wrong');
      playerTurn = false;
      lockPads();
      setStatus('✗ WRONG BUTTON!', 'wrong');
      playError();
      setTimeout(triggerGameOver, 1300);
    }
  }

  /* ══════════════════════════════════════════════════════
     REQUIREMENT 3 ── GAME OVER
  ════════════════════════════════════════════════════════ */
  function triggerGameOver() {
    playing = false;
    playerTurn = false;

    $('#go-round').text(round);
    $('#go-best').text(best);
    $('#overlay-gameover').addClass('show');
    $('#btn-restart').addClass('show');
    $('#btn-start').prop('disabled', false);

    setStatus('GAME OVER', 'gameover');
  }

  /* ══════════════════════════════════════════════════════
     REQUIREMENT 4 ── RESTART THE GAME
  ════════════════════════════════════════════════════════ */
  function restartGame() {
    $('#overlay-gameover').removeClass('show');
    $('#btn-restart').removeClass('show');
    $('#btn-start').prop('disabled', false);
    $('#disp-round').text('--');
    buildDots(0);
    setStatus('PRESS START TO PLAY');
    playing = false; playerTurn = false;
    sequence = []; round = 0; playerIndex = 0;
    lockPads();
  }

  /* ══ EVENT BINDINGS ═════════════════════════ */
  $('#btn-start').on('click', startGame);
  $('#btn-restart, #btn-play-again').on('click', restartGame);
  $('.pad').on('click', function () {
    checkAnswer($(this).data('color'));
  });

  /* ══ INIT ════════════════════════════════════ */
  lockPads();
  setStatus('PRESS START TO PLAY');
});
