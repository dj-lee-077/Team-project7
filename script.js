(() => {
  'use strict';
  const data = globalThis.GAME_DATA;
  const state = globalThis.createGameState(data);
  const $ = id => document.getElementById(id);
  const game = $('game'), scene = $('scene'), event = $('event');
  const visual = $('visual'), dialogue = $('dialogue');
  const buttons = new Map();
  const audio = globalThis.createGameAudio();
  let zoomTimer;
  let returnTarget;
  let lastVisual = '';
  let seekBottle = false;
  let replaying = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const writer = globalThis.createDialogueWriter({
    update: text => {
      if (text.length === $('line').textContent.length + 1 && text.trim()) audio.play('tick');
      $('line').textContent = text;
    },
    complete: () => {
      dialogue.classList.remove('typing');
      updateNextLabel();
    }
  });
  reducedMotion.addEventListener('change', e => { if (e.matches) writer.finish(); });

  // 물체의 선을 그리지 않고 영역 안에서 빛가루가 각각 흩날립니다.
  function dustFor(item) {
    const dust = document.createElement('span');
    dust.className = 'fairy-dust';
    dust.setAttribute('aria-hidden', 'true');
    const intensity = 2; // 기본 대비 100% 증가: 동시에 흩날리는 입자 수를 두 배로.
    const count = (['box', 'bicycle'].includes(item.id) ? 22 : item.id === 'finger' ? 16 : 11) * intensity;
    for (let i = 0; i < count; i++) {
      const grain = document.createElement('i');
      grain.className = 'dust-grain';
      const phase = i * 2.39996;
      const radius = 12 + (i * 17 % 32);
      grain.style.cssText = `--x:${50 + Math.cos(phase) * radius}%;--y:${54 + Math.sin(phase) * radius}%;--size:${1.4 + (i % 4) * .55}px;--dx:${Math.sin(phase) * 19}px;--rise:${18 + i % 5 * 6}px;--duration:${3.2 + (i % 7) * .38}s;--delay:-${i * .73}s`;
      dust.append(grain);
    }
    return dust;
  }

  for (const item of Object.values(data.items)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hotspot';
    button.dataset.item = item.id;
    button.setAttribute('aria-label', `${item.name} 살펴보기`);
    const p = item.hotspot;
    Object.assign(button.style, { left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` });
    if (!data.scene.bakedHighlights || item.id === 'bottle') button.append(globalThis.createHotspotGlow(item));
    button.append(dustFor(item));
    button.addEventListener('click', () => open(item.id));
    $('hotspots').append(button);
    buttons.set(item.id, button);
  }

  function updateHotspots() {
    // 단순 클릭이 아니라 네 아이템의 대사 완료 상태로 장면과 마지막 이벤트를 함께 전환합니다.
    scene.classList.toggle('finger-unlocked', state.fingerUnlocked);
    $('main-image').setAttribute('aria-hidden', String(state.fingerUnlocked));
    $('final-scene-image').setAttribute('aria-hidden', String(!state.fingerUnlocked));
    for (const [id, button] of buttons) {
      button.hidden = (id === 'bottle' && !state.bottleUnlocked) || (id === 'finger' && !state.fingerUnlocked);
      button.classList.toggle('discovered', state.has(id) || (id === 'dean' && state.bottleUnlocked));
      button.classList.toggle('final', id === 'finger' && state.fingerUnlocked);
      button.setAttribute('aria-label', `${data.items[id].name} ${state.has(id) ? '다시 보기' : '살펴보기'}`);
    }
  }

  function zoom(item, scale = item.zoom) {
    scene.style.transformOrigin = `${item.hotspot.x}% ${item.hotspot.y}%`;
    scene.style.transform = `scale(${scale})`;
  }

  function open(id) {
    if (!$('intro').hidden) return;
    const isReplay = state.has(id);
    if (!state.open(id)) return;
    audio.unlock();
    audio.stop();
    audio.play(id === 'finger' ? 'secret' : 'click');
    replaying = isReplay;
    writer.cancel();
    clearTimeout(zoomTimer);
    returnTarget = buttons.get(id);
    seekBottle = false;
    scene.inert = true;
    event.hidden = false;
    event.classList.add('zooming');
    event.classList.toggle('final-event', id === 'finger');
    game.classList.add('in-event');
    lastVisual = '';
    visual.replaceChildren();
    $('speaker').textContent = '살펴보기';
    $('line').textContent = '';
    dialogue.removeAttribute('aria-label');
    dialogue.classList.remove('typing');
    dialogue.disabled = true;
    $('close').focus();
    zoom(state.active);
    zoomTimer = setTimeout(() => {
      state.start();
      event.classList.remove('zooming');
      dialogue.disabled = false;
      render();
      dialogue.focus();
    }, reducedMotion.matches ? 0 : 650);
  }

  function placeholder(silhouette, label) {
    const holder = document.createElement('div');
    holder.className = 'placeholder';
    const title = document.createElement('span');
    title.className = silhouette ? 'unknown' : 'pending-name';
    title.textContent = silhouette ? '?' : label;
    const note = document.createElement('small');
    note.textContent = silhouette ? '[실루엣 이미지 준비 중]' : '[팀 제공 합성 이미지 준비 중]';
    holder.append(title, note);
    return holder;
  }

  function crop(item) {
    const holder = document.createElement('div');
    holder.className = 'crop';
    const p = item.crop;
    const imageRatio = data.scene.width / data.scene.height;
    holder.style.aspectRatio = `${p.w * imageRatio} / ${p.h}`;
    holder.style.setProperty('--crop-ratio', p.w * imageRatio / p.h);
    const img = document.createElement('img');
    img.src = data.scene.image;
    img.alt = '';
    Object.assign(img.style, { width: `${10000 / p.w}%`, left: `${-p.x / p.w * 100}%`, top: `${-p.y / p.h * 100}%` });
    holder.append(img);
    return holder;
  }

  function renderVisual(item, mode) {
    const key = `${item.id}:${mode}`;
    if (lastVisual === key) return;
    lastVisual = key;
    visual.replaceChildren();
    visual.className = 'visual';
    if (mode === 'none') return;
    const silhouette = mode === 'silhouette';
    if (!replaying && state.step.phase === 'REVEAL') {
      if (mode === 'empty') audio.play('empty');
      else if (['object', 'reveal'].includes(mode)) audio.play(['bottle', 'finger'].includes(item.id) ? 'secret' : 'reveal');
    }
    if (silhouette) visual.classList.add('silhouette-arrival');
    if (!replaying && state.step.phase === 'REVEAL' && item.id !== 'box' && ['object', 'reveal'].includes(mode)) {
      visual.classList.add('reveal-pop');
      if (['bottle', 'finger'].includes(item.id)) visual.classList.add('reveal-secret');
    }
    const assetPath = silhouette ? item.silhouette : mode === 'reveal' ? item.revealImage : mode === 'object' ? item.objectImage : null;
    if (assetPath) {
      const img = document.createElement('img');
      img.className = `asset${silhouette ? ' silhouette' : ''}`;
      img.alt = '';
      img.addEventListener('error', () => {
        // 이전 단계의 지연된 이미지 실패가 현재 화면을 덮어쓰지 않게 합니다.
        if (lastVisual === key) visual.replaceChildren(placeholder(silhouette, item.member?.name || item.name));
      }, { once: true });
      img.src = assetPath;
      visual.append(img);
    } else if (silhouette || mode === 'reveal') {
      visual.append(placeholder(silhouette, item.member?.name || item.name));
    } else if (mode === 'empty') {
      const label = document.createElement('div');
      label.className = 'empty-label';
      label.textContent = '비어있음';
      visual.append(label);
    } else if (item.crop) {
      if (mode === 'opening') visual.classList.add('box-opening');
      visual.append(crop(item));
    }
  }

  function render() {
    const item = state.active;
    const step = state.step;
    if (!item || !step) return;
    $('speaker').textContent = step.phase === 'TEAM_MEMBER' && item.member
      ? `${item.member.name} · ${item.member.role}` : '살펴보기';
    // 화면 읽기 프로그램은 매 글자 대신 완성된 문장을 버튼 이름으로 읽습니다.
    dialogue.setAttribute('aria-label', step.text);
    dialogue.classList.add('typing');
    $('next-label').textContent = '문장 완성';
    writer.start(step.text, { instant: reducedMotion.matches });
    renderVisual(item, step.visual);
  }

  function updateNextLabel() {
    if (!state.active) return;
    $('next-label').replaceChildren(document.createTextNode(state.isLast ? '탐색으로 ' : '다음 '));
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '▼';
    $('next-label').append(arrow);
  }

  function returnToScene(result = {}) {
    audio.stop();
    audio.play(result.fingerJustUnlocked ? 'unlock' : result.id === 'dean' ? 'secret' : result.completed && !replaying ? 'found' : 'close');
    clearTimeout(zoomTimer);
    writer.cancel();
    dialogue.classList.remove('typing');
    state.close();
    lastVisual = '';
    event.hidden = true;
    scene.inert = false;
    game.classList.remove('in-event');
    visual.replaceChildren();
    updateHotspots();
    if (result.id === 'dean') {
      seekBottle = true;
      zoom(data.items.bottle, 1.5);
      $('hint').textContent = '문 아래에서 새로운 빛이 보인다.';
      $('hint').hidden = false;
      $('announcement').textContent = '문 아래에 새로운 탐색 지점이 열렸습니다.';
      buttons.get('bottle').focus({ preventScroll: true });
    } else {
      scene.style.transform = '';
      $('hint').textContent = result.fingerJustUnlocked
        ? '[교수님의 엄지가 빛나기 시작하는 대사]' : '반짝이는 곳을 살펴보자.';
      $('hint').hidden = false;
      if (result.fingerJustUnlocked) $('announcement').textContent = '교수님의 위로 세운 엄지에 새로운 빛이 나타났습니다.';
      returnTarget?.focus({ preventScroll: true });
    }
  }

  function advance() {
    if (!state.active || state.phase === 'ZOOM') return;
    audio.unlock();
    audio.play('next');
    // 출력 중 첫 입력은 문장을 완성하고, 다음 입력부터 진행 상태를 바꿉니다.
    if (writer.finish()) return;
    const result = state.advance();
    if (result.completed) returnToScene(result);
    else render();
  }

  dialogue.addEventListener('click', advance);
  $('close').addEventListener('click', () => returnToScene());
  document.addEventListener('keydown', e => {
    if (!$('intro').hidden) {
      if (e.key === 'Tab') { e.preventDefault(); $('start').focus(); }
      if (e.repeat && (e.key === 'Enter' || e.key === ' ')) e.preventDefault();
      return;
    }
    if (!event.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); returnToScene(); }
      // 버튼의 기본 키보드 동작을 사용하여 대사가 두 번 넘어가지 않게 합니다.
      else if ((e.key === 'Enter' || e.key === ' ') && e.repeat) e.preventDefault();
      else if ((e.key === 'Enter' || e.key === ' ') && ![dialogue, $('close')].includes(document.activeElement)) {
        e.preventDefault(); advance();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const controls = [$('close'), dialogue].filter(button => !button.disabled);
        const index = controls.indexOf(document.activeElement);
        controls[(index + (e.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
      }
    } else if (e.key === 'Escape' && seekBottle) {
      seekBottle = false;
      scene.style.transform = '';
      $('hint').textContent = '반짝이는 곳을 살펴보자.';
      $('hint').hidden = false;
    }
  });
  scene.inert = true;
  $('start').addEventListener('click', () => {
    audio.unlock();
    audio.play('start');
    $('intro').hidden = true;
    scene.inert = false;
    // 시작 직후 상자가 선택된 것처럼 보이던 자동 포커스 테두리를 제거합니다.
    scene.tabIndex = -1;
    scene.focus({ preventScroll: true });
  });
  $('start').focus();
  updateHotspots();
})();
