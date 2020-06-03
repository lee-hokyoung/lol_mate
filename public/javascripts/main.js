const sources = [
  "/media/main1.mp3",
  "/media/main2.mp3",
  "/media/main3.mp3",
  "/media/main4.mp3",
  "/media/main5.mp3",
  "/media/main6.mp3",
];
let howls = {};
sources.forEach(function (v, i) {
  howls[i] = new Howl({ src: v });
});

document.addEventListener("DOMContentLoaded", function () {
  let rnd = Math.floor(Math.random() * sources.length);
  let sound = howls[rnd];
  sound.once("load", function () {
    let isPlay = localStorage.getItem("play");
    if (isPlay === "false") {
      document.querySelector("#audio-wrap").dataset.play = "false";
    } else {
      sound.play();
      document.querySelector("#audio-wrap").dataset.play = "true";
    }
    document.querySelector("#audio-wrap").classList.remove("d-none");
  });
  document.querySelectorAll("#audio-wrap i").forEach(function (i) {
    i.addEventListener("click", function () {
      let audio = document.querySelector("#audio-wrap");
      let play = audio.dataset.play;
      audio.dataset.play = play === "false";
      if (play === "false") {
        sound.play();
        localStorage.setItem("play", true);
      } else {
        sound.pause();
        localStorage.setItem("play", false);
      }
    });
  });
});
