// 외부 음원 없이 생성하는 짧은 게임 효과음. 사용자 입력 후에만 재생합니다.
globalThis.createGameAudio = function () {
  let context, master;
  const playing = new Set();
  let lastTick = 0;
  function unlock() {
    try {
      const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!Audio) return;
      if (!context) {
        context = new Audio(); master = context.createGain();
        master.gain.value = .14; master.connect(context.destination);
      }
      if (context.state === 'suspended') context.resume().catch(() => {});
    } catch { /* 소리 지원 여부와 무관하게 게임은 계속 진행합니다. */ }
  }
  const patterns = {
    start: [[523, .07], [659, .07], [784, .13]],
    click: [[880, .035], [1175, .045]],
    next: [[740, .04]],
    tick: [[440, .014]],
    reveal: [[392, .06], [523, .06], [784, .16]],
    secret: [[294, .07], [370, .07], [587, .09], [1175, .17]],
    empty: [[330, .1], [220, .18]],
    found: [[659, .07], [784, .07], [1047, .19]],
    unlock: [[523, .08], [784, .1], [1047, .11], [1568, .2]],
    close: [[587, .035], [392, .055]]
  };
  function play(name) {
    if (!context || context.state === 'closed') return;
    if (name === 'tick' && context.currentTime - lastTick < .095) return;
    if (name === 'tick') lastTick = context.currentTime;
    if (playing.size > 24) return;
    let at = context.currentTime;
    for (const [frequency, duration] of patterns[name] || []) {
      const osc = context.createOscillator(), gain = context.createGain();
      osc.type = name === 'tick' ? 'triangle' : 'square';
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(name === 'tick' ? .18 : .36, at + .004);
      gain.gain.exponentialRampToValueAtTime(.001, at + duration);
      osc.connect(gain); gain.connect(master); playing.add(osc);
      osc.onended = () => { playing.delete(osc); osc.disconnect(); gain.disconnect(); };
      osc.start(at); osc.stop(at + duration + .01); at += duration + .018;
    }
  }
  function stop() { for (const osc of playing) { try { osc.stop(); } catch {} } }
  return { unlock, play, stop };
};
