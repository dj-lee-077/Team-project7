# 문송합니다 UI 수정 — 2026-09-11

- 사이트 제목, 팀명, 인트로의 팀 표기를 문송합니다로 변경했습니다.
- 상단 문구는 애착템을 찾아보자!로 변경했습니다.
- 소리 버튼 및 음소거 분기를 제거했습니다. 브라우저 재생 정책에 따라 입장 클릭 후 효과음이 켜집니다.
- 메인 술병 표시는 둥근 어깨와 바닥 곡선으로 수정했습니다. 기존 stroke-width 2 → 1.25, 번짐 4/12px → 2/5px로 낮춰 사진에 포함된 다른 물체의 노란 강조에 맞췄습니다.
- 사진에 포함된 자막을 제거하고 사진 아래 전용 공간에 자막을 표시합니다. PC에서 기준 18px의 150%인 27px, 모바일에서는 기준 16px의 150%인 24px입니다.
- 새 이미지 파일: assets/main/main-image-v3.png (1448×1086). 원본 v2는 보존합니다.

## 이미지 편집

내장 image_gen 도구로 하단 중앙의 자막만 제거하도록 편집했습니다. 최종 프롬프트:

> Edit the supplied image ONLY to remove the small black subtitle box and white Korean caption at bottom center below the rainbow gift box (approximately x=606..870, y=921..966 in this 1448x1086 source). Fill that small region naturally with the existing white tabletop and any obscured hand continuation. Preserve everything else unchanged: exact composition, camera angle, people and faces, glasses and their yellow glow, bicycle, doorway person, raised hand, colorful gift box with Korean text 애착템 3종 세트, ribbon, lighting, all object positions. Keep full 4:3 frame and original framing. No other edits. No replacement caption or text. This is a minimal localized caption removal for the existing website background.

생성 이미지를 확인하여 자막 제거와 4:3 크기를 검증했습니다. JavaScript 구문 및 대사 출력·중단·재방문·발견·해금 검사를 통과했습니다.
