// 원본 장면 좌표를 사용하는 클릭 영역 강조. 사진과 클릭 위치는 변경하지 않습니다.
globalThis.createHotspotGlow = function (item) {
  const paths = {
    bicycle: ['M123 526 C71 496 28 541 10 615 C-8 688 10 742 49 750 C94 758 135 710 148 641 C162 578 151 546 123 526 Z', 'M305 511 C266 494 225 532 212 586 C195 641 205 684 234 693 C276 707 322 664 344 607 C368 551 344 520 305 511 Z', 'M72 640 L125 481 L216 650 L259 493 L125 481 M216 650 L303 602 L259 493 L269 432 M126 480 L136 446 L65 441 M57 431 C54 446 33 481 39 487 M144 447 C158 445 164 472 153 488 L180 496 M233 423 Q265 432 292 420'],
    glasses: ['M788 307 L847 288 Q874 282 891 294 L900 309 Q902 339 867 351 Q831 366 807 344 Z M901 291 Q932 276 969 278 L993 287 L986 316 Q978 337 946 337 Q914 337 907 313 Z M891 296 Q900 290 908 294 M982 282 L1044 273'],
    box: ['M486 775 L576 729 L1102 748 L1110 965 L486 953 Z'],
    dean: ['M410 330 Q429 305 449 326 Q468 345 450 371 L463 398 L461 490 L408 528 L407 450 Q420 453 420 437 L407 428 L409 373 Q399 352 410 330 Z'],
    bottle: ['M441 535 L451 535 L452 548 Q461 551 461 563 L461 593 Q447 599 433 593 L433 563 Q433 551 441 548 Z'],
    finger: ['M1261 572 Q1250 552 1259 523 Q1266 498 1276 514 L1282 540 Q1308 560 1317 585 L1296 593 L1274 577 Z']
  };
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  const p = item.hotspot;
  svg.setAttribute('viewBox', `${(p.x-p.w/2)*15.36} ${(p.y-p.h/2)*10.24} ${p.w*15.36} ${p.h*10.24}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  if (item.id === 'bottle') svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('hotspot-glow');
  for (const d of item.id === 'bottle' ? ['M44 10 Q40 10 40 14 L40 29 C40 36 27 38 25 49 C23 59 24 74 24 84 Q24 92 32 93 Q50 96 68 93 Q76 92 76 84 C76 74 77 59 75 49 C73 38 60 36 60 29 L60 14 Q60 10 56 10 Z'] : paths[item.id] || []) {
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d); svg.append(path);
  }
  return svg;
};
