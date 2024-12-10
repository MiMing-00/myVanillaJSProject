const fortuneResults = [
  '이래저래 잘 풀리는 날이니 매일 매일이 오늘과 같다면 누구도 부럽지 않을 거예요!',
  '양보가 가장 큰 미덕이자 무기가 되는 날입니다. 양보하면 그만큼 보답을 받을 수 있는 날이니 너그러운 마음이 필요해요!',
  '손길이 닿는 곳마다 행운이 깃들 것이니 어려움 없는 날이 되리라 기대해도 좋아요!',
  '당신의 능력이 빛을 발하게 될 것으로 보이는 날이에요!',
  '순간적인 변화가 당신을 유리한 위치에 세워줄 거예요! 적극적으로 도전해보세요.',
  '내게 힘을 주는 이가 많고 지원군이 많은 날이에요!',
];

function handleCardClick() {
  let randomFortune = fortuneResults[Math.floor(Math.random() * fortuneResults.length)];
  let result = document.querySelector('.result');
  let fortuneLoading = document.querySelector('.tarot-loading');

  // reset
  result.style.display = 'none';
  fortuneLoading.classList.add('rotate');

  setTimeout(() => {
    result.textContent = randomFortune;
    fortuneLoading.classList.remove('rotate');
    result.style.display = 'block';
  }, 2000);
}

document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('click', handleCardClick);
});
