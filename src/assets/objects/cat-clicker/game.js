let treats = 0;
const score = document.getElementById('score');
document.getElementById('cat').addEventListener('click', () => {
  treats += 1;
  score.textContent = 'Treats: ' + treats;
});
