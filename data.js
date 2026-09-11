/* 대사를 추가하려면 steps에 { phase, visual, text }를 추가하세요.
 * phase: DIALOGUE | SILHOUETTE | REVEAL | ITEM_DESCRIPTION | TEAM_MEMBER
 * visual: none | silhouette | object | opening | empty | reveal
 * 이미지 경로가 null이면 명시적인 임시 표시를 사용합니다. 실제 사진을 생성하지 않습니다.
 * 각 이미지의 투명 배경 PNG/WebP 사용을 권장합니다.
 */
globalThis.GAME_DATA = {
  scene: { image: 'assets/main/main-image-v3.png', width: 1448, height: 1086, bakedHighlights: true },
  required: ['glasses', 'bicycle', 'box', 'bottle'],
  items: {
    box: {
      id: 'box', name: '상자', hotspot: { x: 53.2, y: 73.4, w: 41.5, h: 26 }, zoom: 1.55,
      member: null, silhouette: null, revealImage: null,
      crop: { x: 32.2, y: 59.8, w: 42, h: 26 },
      steps: [
        { phase: 'DIALOGUE', visual: 'object', text: '[상자를 열기 전 대사]' },
        { phase: 'REVEAL', visual: 'opening', text: '[상자를 여는 대사]' },
        { phase: 'REVEAL', visual: 'empty', text: '비어있음' },
        { phase: 'ITEM_DESCRIPTION', visual: 'empty', text: '[빈 상자 설명 대사]' }
      ],
      revisit: [
        { phase: 'REVEAL', visual: 'empty', text: '비어있음' },
        { phase: 'ITEM_DESCRIPTION', visual: 'empty', text: '[빈 상자 설명 대사]' }
      ]
    },
    bicycle: {
      id: 'bicycle', name: '자전거', hotspot: { x: 12, y: 50.8, w: 24, h: 29 }, zoom: 1.65,
      member: null, silhouette: 'assets/items/bicycle-cutout.png', revealImage: null,
      objectImage: 'assets/items/bicycle-cutout.png',
      crop: { x: 0, y: 36.2, w: 24, h: 29 },
      steps: [
        { phase: 'SILHOUETTE', visual: 'silhouette', text: '[자전거 실루엣 대사]' },
        { phase: 'DIALOGUE', visual: 'silhouette', text: '[자전거 정답 예상 대사]' },
        { phase: 'REVEAL', visual: 'object', text: '[정말 자전거인 것을 확인하는 대사]' },
        { phase: 'ITEM_DESCRIPTION', visual: 'object', text: '[자전거 설명 대사]' }
      ]
    },
    glasses: {
      id: 'glasses', name: '안경', hotspot: { x: 60.8, y: 27, w: 18, h: 8.5 }, zoom: 2.1,
      member: { name: '성다희', role: '디자인 / 개발' }, silhouette: null, revealImage: null,
      crop: { x: 51.5, y: 22.7, w: 18.5, h: 9 },
      steps: [
        { phase: 'SILHOUETTE', visual: 'silhouette', text: '[안경 실루엣 대사]' },
        { phase: 'DIALOGUE', visual: 'silhouette', text: '[안경 정답 예상 대사]' },
        { phase: 'REVEAL', visual: 'object', text: '[안경 공개 대사]' },
        { phase: 'DIALOGUE', visual: 'object', text: '[안경에 비친 무언가를 발견하는 대사]' },
        { phase: 'REVEAL', visual: 'reveal', text: '[안경에 비친 성다희 등장 대사]' },
        { phase: 'ITEM_DESCRIPTION', visual: 'reveal', text: '[안경과 성다희를 연결하는 대사]' },
        { phase: 'TEAM_MEMBER', visual: 'reveal', text: '[성다희 소개 대사]' }
      ],
      revisit: [
        { phase: 'REVEAL', visual: 'reveal', text: '[안경에 비친 성다희 등장 대사]' },
        { phase: 'ITEM_DESCRIPTION', visual: 'reveal', text: '[안경과 성다희를 연결하는 대사]' },
        { phase: 'TEAM_MEMBER', visual: 'reveal', text: '[성다희 소개 대사]' }
      ]
    },
    dean: {
      id: 'dean', name: '문가의 학장님', hotspot: { x: 28.9, y: 36.6, w: 5, h: 19 }, zoom: 1.9,
      crop: { x: 26.5, y: 26.8, w: 5, h: 19.5 },
      steps: [
        { phase: 'DIALOGUE', visual: 'none', text: '[학장님 주변이 수상하다는 대사]' },
        { phase: 'DIALOGUE', visual: 'none', text: '[발 주변에서 새로운 빛을 발견하는 대사]' }
      ]
    },
    bottle: {
      id: 'bottle', name: '문 아래의 빛', hotspot: { x: 29.5, y: 49.5, w: 4, h: 6 }, zoom: 2.3,
      member: { name: '이동준', role: '개발 / 기획' }, silhouette: null, revealImage: null,
      steps: [
        { phase: 'SILHOUETTE', visual: 'silhouette', text: '[숨겨진 술병 실루엣 대사]' },
        { phase: 'DIALOGUE', visual: 'silhouette', text: '[술병이라고 예상하는 대사]' },
        { phase: 'REVEAL', visual: 'reveal', text: '[술병 모양으로 꾸겨 넣은 이동준 등장 대사]' },
        { phase: 'ITEM_DESCRIPTION', visual: 'reveal', text: '[술병과 이동준을 연결하는 대사]' },
        { phase: 'TEAM_MEMBER', visual: 'reveal', text: '[이동준 소개 대사]' }
      ]
    },
    finger: {
      id: 'finger', name: '위로 세운 엄지', hotspot: { x: 85.2, y: 48.2, w: 4.8, h: 9 }, zoom: 2.35,
      member: { name: '송우진', role: '기획 / 디자인' }, silhouette: null, revealImage: null,
      steps: [
        { phase: 'SILHOUETTE', visual: 'silhouette', text: '[빛나는 엄지 실루엣 대사]' },
        { phase: 'DIALOGUE', visual: 'silhouette', text: '[손가락이라고 예상하는 대사]' },
        { phase: 'REVEAL', visual: 'reveal', text: '[엄지 모양의 송우진 얼굴 등장 대사]' },
        { phase: 'ITEM_DESCRIPTION', visual: 'reveal', text: '[엄지와 송우진을 연결하는 대사]' },
        { phase: 'TEAM_MEMBER', visual: 'reveal', text: '[송우진 소개 대사]' }
      ]
    }
  }
};
