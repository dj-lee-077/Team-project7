/* 화면과 분리된 진행 상태. 추후 저장은 snapshot()과 생성자 initial로 연결합니다. */
globalThis.createGameState = function createGameState(data, initial = {}) {
  const discovered = new Set(initial.discovered || []);
  let bottleUnlocked = Boolean(initial.bottleUnlocked || discovered.has('bottle'));
  let active = null;
  let steps = [];
  let index = 0;
  let phase = 'IDLE';
  const fingerUnlocked = () => data.required.every(id => discovered.has(id));
  return {
    get active() { return active; },
    get phase() { return phase; },
    get step() { return steps[index] || null; },
    get isLast() { return index === steps.length - 1; },
    get bottleUnlocked() { return bottleUnlocked; },
    get fingerUnlocked() { return fingerUnlocked(); },
    has: id => discovered.has(id),
    canOpen(id) {
      return Boolean(data.items[id]) && !active &&
        (id !== 'bottle' || bottleUnlocked) && (id !== 'finger' || fingerUnlocked());
    },
    open(id) {
      if (!this.canOpen(id)) return false;
      active = data.items[id];
      steps = discovered.has(id)
        ? active.revisit || active.steps.filter(s => ['REVEAL', 'ITEM_DESCRIPTION', 'TEAM_MEMBER'].includes(s.phase))
        : active.steps;
      index = 0;
      phase = 'ZOOM';
      return true;
    },
    start() {
      if (active && phase === 'ZOOM') phase = steps[index].phase;
    },
    advance() {
      if (!active || phase === 'ZOOM') return { completed: false };
      if (index < steps.length - 1) {
        index += 1;
        phase = steps[index].phase;
        return { completed: false };
      }
      const id = active.id;
      const wasUnlocked = fingerUnlocked();
      if (id === 'dean') bottleUnlocked = true;
      else discovered.add(id);
      this.close();
      return { completed: true, id, fingerJustUnlocked: !wasUnlocked && fingerUnlocked() };
    },
    close() { active = null; steps = []; index = 0; phase = 'IDLE'; },
    snapshot() { return { discovered: [...discovered], bottleUnlocked }; }
  };
};
