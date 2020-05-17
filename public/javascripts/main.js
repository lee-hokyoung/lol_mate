const sound = new Howl({
  src: ["/media/main.mp3"],
});
document.addEventListener("DOMContentLoaded", function () {
  // 오디오 플레이어가 로딩될 때 이벤트
  sound.once("load", function () {
    sound.play();
    document.querySelector("#audio-wrap").classList.remove("d-none");
  });
  document.querySelectorAll("#audio-wrap i").forEach(function (i) {
    i.addEventListener("click", function () {
      let audio = document.querySelector("#audio-wrap");
      let play = audio.dataset.play;
      audio.dataset.play = play === "false";
      if (play === "false") sound.play();
      else sound.pause();
    });
  });
});
