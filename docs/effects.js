/* 진행 상태를 변경하지 않는 대사 출력 효과. 닫기/다음 대사 시 cancel로 정리합니다. */
globalThis.createDialogueWriter = function createDialogueWriter({
  update, complete = () => {}, schedule = setTimeout, unschedule = clearTimeout
}) {
  let timer = null;
  let generation = 0;
  let characters = [];
  let index = 0;
  let active = false;

  function cancel() {
    generation += 1;
    if (timer !== null) unschedule(timer);
    timer = null;
    active = false;
  }

  function finish() {
    if (!active) return false;
    cancel();
    index = characters.length;
    update(characters.join(''));
    complete();
    return true;
  }

  return {
    get active() { return active; },
    cancel,
    finish,
    start(text, { instant = false, interval = 35 } = {}) {
      cancel();
      characters = Array.from(text);
      index = 0;
      active = true;
      if (instant || characters.length === 0) { finish(); return; }
      update('');
      const token = generation;
      function tick() {
        if (token !== generation || !active) return;
        timer = null;
        index += 1;
        update(characters.slice(0, index).join(''));
        if (index >= characters.length) {
          active = false;
          complete();
        } else timer = schedule(tick, interval);
      }
      timer = schedule(tick, interval);
    }
  };
};
