# 남사모 탐색 인터페이스 — 첫 구현

원본 README.md와 INTERFACE.md는 보존했습니다. 이 문서는 인터뷰에서 확정된 변경 사항과 현재 구현의 교체 지점을 기록합니다.

## 실행

index.html을 브라우저로 열면 실행됩니다. 설치하거나 빌드할 라이브러리가 없는 HTML/CSS/JavaScript입니다. 정적 웹 서버에서도 그대로 사용할 수 있습니다.

## 확정된 동작

- 상자, 자전거, 안경, 학장님은 순서 제한 없이 탐색합니다.
- 상자에는 실루엣이 없습니다. 원본 상자 부분을 확대하고 회전시키는 임시 개봉 연출 뒤 `비어있음`을 표시합니다.
- 자전거는 자전거로 공개됩니다. 팀원 연결은 없습니다.
- 안경은 실루엣 → 안경 → 렌즈에 비친 성다희 순서입니다.
- 학장님 대화를 마치면 문 아래 빛이 활성화됩니다. 이를 별도로 눌러야 술병 이벤트가 시작됩니다.
- 술병은 실루엣 → 술병 모양으로 꾸겨 넣은 이동준 이미지입니다.
- 상자·자전거·안경·술병을 모두 완료하면 화면 오른쪽의 위로 세운 엄지가 활성화됩니다.
- 엄지는 실루엣 → 엄지 모양의 송우진 얼굴로 공개됩니다. 별도의 엔딩은 만들지 않았습니다.
- 닫기 / Escape로 중단하면 발견 처리하지 않습니다. 마지막 대사에서 `탐색으로`를 눌러야 완료됩니다.
- 발견한 아이템 재방문 시 공개 이미지와 설명/소개만 표시합니다.
- 발견 숫자는 표시하지 않습니다. 물체 주변에서 작은 빛가루가 흩날리며 완료 후에도 계속 유지됩니다. 완료한 물체는 빛 색상만 연두색으로 바뀝니다.
- 시작 시 궁서체 입체 글자로 `남교수님의 애착아이템을 소개합니다.`를 크게 보여주며 입장 버튼으로 탐색을 시작합니다.
- 새로고침하면 진행이 초기화됩니다. state.js의 snapshot 및 initial 인자로 향후 저장 기능을 연결할 수 있습니다.

## 대사 수정

data.js의 각 아이템 steps 배열에서 text를 바꿉니다. 단계를 추가하면 클릭할 때 한 줄씩 진행합니다.

```js
{ phase: 'DIALOGUE', visual: 'silhouette', text: '여기에 대사를 입력' }
```

phase는 DIALOGUE, SILHOUETTE, REVEAL, ITEM_DESCRIPTION, TEAM_MEMBER를 사용합니다.
visual은 none, silhouette, object, opening, empty, reveal을 사용합니다.
별도 revisit 배열이 있는 아이템은 재방문 대사도 함께 수정하세요. 없는 경우 REVEAL/ITEM_DESCRIPTION/TEAM_MEMBER만 자동 추출합니다.

## 팀에서 제공할 이미지

| 아이템 | silhouette 경로 예시 | revealImage 경로 예시 |
| --- | --- | --- |
| 자전거 | assets/items/bicycle-cutout.png | objectImage에 같은 투명 이미지 사용 |
| 안경 | assets/silhouettes/glasses.png | assets/items/glasses-dahui.png |
| 술병 | assets/silhouettes/bottle.png | assets/items/bottle-dongjun.png |
| 엄지 | assets/silhouettes/finger.png | assets/items/finger-woojin.png |

파일을 넣고 해당 아이템의 silhouette 또는 revealImage 값 null을 실제 경로 문자열로 바꾸세요. 경로는 index.html 기준입니다. 파일명만 맞추어 넣어도 자동으로 바뀌지는 않습니다.

실루엣에는 투명 배경 PNG/WebP가 필요합니다. CSS가 이미지를 검게 처리하므로 투명 배경의 대상 외곽이 드러납니다. 불투명한 사각 사진을 넣으면 사각 실루엣이 됩니다. 안경 revealImage는 안경과 렌즈 속 성다희를 함께 합성한 이미지로 준비하면 됩니다.

자전거는 투명 배경 이미지를 검게 처리한 실루엣에서 동일 이미지의 원래 색상으로 공개됩니다. 다른 실루엣은 물음표와 준비 중 표시이며, 인물 반전은 이름과 이미지 준비 중 표시입니다. 인물 합성 결과를 대신 만들지 않았습니다. 이미지 로드 실패 시에도 준비 중 표시를 사용합니다.

## 2차 시각 수정

- 궁서/바탕 계열 시스템 글꼴, 다색 입체 인트로, 회색 ridge 테두리와 보라색 제목표를 적용했습니다. 추가 라이브러리나 외부 글꼴 요청은 없습니다.
- 외곽선 표시는 제거했습니다. 각 클릭 영역 안에 크기·위치·이동 방향·주기가 다른 빛가루를 배치합니다. script.js의 dustFor와 style.css의 dust-drift에서 조정할 수 있습니다.
- 빛가루의 입자 수는 최초 효과 대비 두 배입니다. 시작 직후 상자에 자동으로 초점을 주던 동작을 제거하여 상자의 별도 강조 테두리가 나타나지 않습니다. 키보드 Tab 탐색 시에는 접근성을 위한 포커스 표시를 유지합니다.
- 자전거 공개 화면은 확대된 사각 사진 대신 분리된 자전거를 사용합니다. 표시 영역 안에서 object-fit: contain으로 종횡비를 유지합니다. 다른 사진 크롭도 높이 제한에 의해 비율이 깨지지 않게 수정했습니다.
- 자전거 에셋은 내장 image_gen 도구로 원본을 참고해 배경 분리를 생성한 이미지입니다. 원본의 픽셀 단위 추출은 아니므로 세부 형태에 차이가 있을 수 있습니다. 메인 이미지에는 이 생성 이미지를 겹치지 않습니다.
- 저장 경로: assets/items/bicycle-cutout.png
- 생성 프롬프트: “Use case: background-extraction. Input is edit target. Extract ONLY the red road bicycle visible at the left of this photograph as one photorealistic transparent PNG game item. Preserve precisely its red frame, black drop handlebars, black saddle, both wheels, spokes, perspective and original orientation. Remove every bit of room, floor, people, furniture and background, including inside wheel spokes and frame triangles; actual transparent alpha background, no checkerboard painted in. Center the complete bicycle in a square canvas with small even transparent margins, bicycle occupying 90% of canvas, no cropping of wheels. No other objects, no stand, no text, no UI. This same cutout will be shown first as a black alpha silhouette then in original colors.”

메인 이미지에서 학장님의 발이 가려져 있어 술병 발견 위치는 문 아래로 임시 배치했습니다. 상세 발 주변 이미지가 전달되면 좌표와 장면을 보정해야 합니다. 상자 내부 역시 실제 이미지가 없는 상태의 임시 CSS 연출입니다.

## 파일 역할

- index.html: 하나의 탐색 장면과 공통 대화 인터페이스
- style.css: B급 대화창, 상대 좌표, 줌, 반짝임, 반응형, 모션 감소 설정
- data.js: 좌표, 대사, 실루엣/반전 이미지 경로, 팀원 연결
- state.js: 발견 완료, 중단, 재방문, 술병·엄지 잠금 조건
- script.js: 장면 렌더링, 키보드/터치/포커스, 이미지 오류 대응
- effects.js: 글자별 대사 출력, 즉시 완성, 타이머 취소. 타이핑 중 첫 입력은 문장을 완성하고 다음 입력부터 대사를 진행합니다.
- EFFECT_REVIEW.md: EFFECT_SCENARIO와의 비교, 이번 효과 적용 범위, 후속 우선순위

이번 버전은 이미지와 실제 대사를 교체하기 위한 로컬 프로토타입입니다. 사운드와 손가락 이후 엔딩은 미정이며 포함하지 않았습니다.
