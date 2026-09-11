/* 대사를 추가하려면 steps에 { phase, visual, text }를 추가하세요.
 * phase: DIALOGUE | SILHOUETTE | REVEAL | ITEM_DESCRIPTION | TEAM_MEMBER
 * visual: none | silhouette | object | opening | empty | reveal
 * 이미지 경로가 null이면 명시적인 임시 표시를 사용합니다. 실제 사진을 생성하지 않습니다.
 * 각 이미지의 투명 배경 PNG/WebP 사용을 권장합니다.
 */
globalThis.GAME_DATA = {
  scene: { image: 'assets/main/main-image-v4.png', width: 1108, height: 831, bakedHighlights: true },
  required: ['glasses', 'bicycle', 'box', 'bottle'],
  items: {
    box: {
      id: 'box', name: '상자', hotspot: { x: 53.2, y: 73.4, w: 41.5, h: 26 }, zoom: 1.55,
      member: null, silhouette: null, revealImage: null,
      crop: { x: 32.2, y: 59.8, w: 42, h: 26 },
      steps: [
        { phase: 'DIALOGUE', visual: 'object', text: '이것은,, 남교수님의 애착템 3종세트…?!' },
        { phase: 'REVEAL', visual: 'opening', text: '으앗… 눈 부셔…!' },
        { phase: 'REVEAL', visual: 'empty', text: '비어있음' },
        { phase: 'ITEM_DESCRIPTION', visual: 'empty', text: '..오잉? 비어있네' }
      ],
      revisit: [
        { phase: 'REVEAL', visual: 'empty', text: '비어있음' },
        { phase: 'ITEM_DESCRIPTION', visual: 'empty', text: '..오잉? 비어있네' }
      ]
    },
    bicycle: {
      id: 'bicycle', name: '자전거', hotspot: { x: 12, y: 50.8, w: 24, h: 29 }, zoom: 1.65,
      member: null, silhouette: 'assets/items/bicycle-cutout.png', revealImage: null,
      objectImage: 'assets/items/bicycle-cutout.png',
      crop: { x: 0, y: 36.2, w: 24, h: 29 },
      steps: [
        { phase: 'SILHOUETTE', visual: 'silhouette', text: '어라..?' },
        { phase: 'DIALOGUE', visual: 'silhouette', text: '자전거인가..?' },
        { phase: 'REVEAL', visual: 'object', text: '이것은 남교수님이 52억에 샀다는 자전거..?!!' },
        { phase: 'ITEM_DESCRIPTION', visual: 'object', text: '이것 때문에 엑싯 하셨다는 소문이 있다고 . .' }
      ]
    },
    glasses: {
      id: 'glasses', name: '안경', hotspot: { x: 60.8, y: 27, w: 18, h: 8.5 }, zoom: 2.1,
      member: { name: '성다희', role: '디자인 / 개발' }, silhouette: null, revealImage: 'assets/items/dahui-1.jpg',
      crop: { x: 51.5, y: 22.7, w: 18.5, h: 9 },
      steps: [
        { phase: 'DIALOGUE', visual: 'object', image: 'assets/items/glasses-1.png', text: '이것은,, ' },
        { phase: 'DIALOGUE', visual: 'object', image: 'assets/items/glasses-1.png', text: '남교수님의 본체인 안경..?' },
        { phase: 'DIALOGUE', visual: 'object', image: 'assets/items/glasses-1.png', text: '이거 없으면 아무도 못알아본다던데…' },
        { phase: 'DIALOGUE', visual: 'object', image: 'assets/items/glasses-2.png', text: '(눈 비비며) 음..? 뭐지..?' },
        { phase: 'DIALOGUE', visual: 'object', image: 'assets/items/glasses-3.png', text: '(눈 비비며) 음..? 뭐지..?' },
        { phase: 'REVEAL', visual: 'reveal', image: 'assets/items/dahui-1.jpg', text: '어랏.. 너는 그 유명한 AI 비서 성다희..??!' },
        { phase: 'TEAM_MEMBER', visual: 'reveal', image: 'assets/items/dahui-2.jpg', text: '“하핫,, 날 알아보다니,, 너도 이 바닥에서 많이 굴렀구나..”' }
      ],
      revisit: [
        { phase: 'REVEAL', visual: 'reveal', image: 'assets/items/dahui-1.jpg', text: '어랏.. 너는 그 유명한 AI 비서 성다희..??!' },
        { phase: 'ITEM_DESCRIPTION', visual: 'reveal', image: 'assets/items/dahui-1.jpg', text: '이 안경 너머로 성다희를 발견했다.' },
        { phase: 'TEAM_MEMBER', visual: 'reveal', image: 'assets/items/dahui-2.jpg', text: '“하핫,, 날 알아보다니,, 너도 이 바닥에서 많이 굴렀구나..”' }
      ]
    },
    dean: {
      id: 'dean', name: '문가의 학장님', hotspot: { x: 28.9, y: 36.6, w: 5, h: 19 }, zoom: 1.9,
      crop: { x: 26.5, y: 26.8, w: 5, h: 19.5 },
      steps: [
        { phase: 'DIALOGUE', visual: 'none', text: '학장님께서 여기 왜 . . .' },
        { phase: 'DIALOGUE', visual: 'none', text: '엇, 학장님 발 밑에 무언가 반짝인다 .' }
      ]
    },
    bottle: {
      id: 'bottle', name: '문 아래의 빛', hotspot: { x: 29.5, y: 49.5, w: 4, h: 6 }, zoom: 2.3,
      member: { name: '이동준', role: '개발 / 기획' }, silhouette: 'assets/items/dongjun-silhouette-1.png', revealImage: 'assets/items/dongjun-1.png',
      steps: [
        { phase: 'SILHOUETTE', visual: 'silhouette', text: '설마 남교수님의 보물 26호 발렌타인 30년산 ?!' },
        { phase: 'REVEAL', visual: 'reveal', text: '버릇은 나쁘지만 술버릇은 좋은 이동준이였다!!' },
        { phase: 'ITEM_DESCRIPTION', visual: 'reveal', text: '왜인지 모르게 INFP 냄새가 나는 듯하다 . . .' }
      ]
    },
    finger: {
      id: 'finger', name: '위로 세운 엄지', hotspot: { x: 85.2, y: 48.2, w: 4.8, h: 9 }, zoom: 2.35,
      member: { name: '송우진', role: '기획 / 디자인' }, silhouette: null, revealImage: 'assets/items/woojin-1.png',
      crop: { x: 72, y: 32, w: 25, h: 34 },
      steps: [
        { phase: 'DIALOGUE', visual: 'object', cropImage: 'assets/main/finger-ready-screen.png', text: '김남주 교수님 손가락이 어딘가 이상하다..?' },
        { phase: 'REVEAL', visual: 'reveal', image: 'assets/items/woojin-1.png', text: '김남주 교수님의 손가락은 알고보니 아픈 손가락 송우진 이었다!' },
        { phase: 'ITEM_DESCRIPTION', visual: 'reveal', image: 'assets/items/woojin-1.png', text: '교수님에게 욕먹는것을 좋아하는 상당히 아픈손가락 송우진이다!' },
        { phase: 'ITEM_DESCRIPTION', visual: 'reveal', image: 'assets/items/woojin-1.png', text: '취미: 남교수님에게 욕먹기' },
        { phase: 'ITEM_DESCRIPTION', visual: 'reveal', image: 'assets/items/woojin-1.png', text: '좋아하는 것: 남교수님에게 욕먹기' },
        { phase: 'TEAM_MEMBER', visual: 'reveal', image: 'assets/items/woojin-1.png', text: '싫어하는 것: "피드백 할 말이 없네요"라는 말 듣기' }
      ]
    }
  }
};
