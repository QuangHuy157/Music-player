const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
isMusicPaused = true;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//prev music
function prevMusic() {
  musicIndex--;
  //nếu musicIndex nhỏ hơn 1 thì musicIndex sẽ là độ dài mảng để lần phát nhạc cuối cùng
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

//next music
function nextMusic() {
  musicIndex++;
  //nếu musicIndex lớn hơn độ dài mảng thì musicIndex sẽ là 1 nên lần phát nhạc đầu tiên
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

// play hoặc pause
playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  //nếu isPlayMusic là true thì gọi pauseMusic còn lại gọi playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//prev music
prevBtn.addEventListener("click", () => {
  prevMusic();
});

//next music
nextBtn.addEventListener("click", () => {
  nextMusic();
});

// cập nhật chiều rộng thanh tiến trình theo thời gian hiện tại của nhạc
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //đang phát bài hát hiện tại
  const duration = e.target.duration; // nhận tổng thời lượng phát bài hát
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    //cập nhật tổng thời lượng bài hát
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      //nếu giây nhỏ hơn 10 thì thêm 0 vào trước nó
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // cập nhật thời gian phát bài hát hiện tại
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    //nếu giây nhỏ hơn 10 thì thêm 0 vào trước nó
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//cập nhật phát bài hát hiện tại Thời gian bật theo chiều rộng thanh tiến trình
progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth; //nhận được chiều rộng của thanh tiến trình
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration; //nhận tổng thời lượng bài hát

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
  playingSong();
});

//thay đổi vòng lặp, xáo trộn, lặp lại biểu tượng onclick
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  // bài hát lặp lại sau đó thì sẽ lặp lại bài hát hiện tại
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //đặt thời gian hiện tại của âm thanh thành 0
      loadMusic(musicIndex); //gọi hàm loadMusic với đối số, trong đối số có chỉ mục của bài hát hiện tại
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1); //tạo số ngẫu nhiên với phạm vi độ dài mảng tối đa
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); //vòng lặp này chạy cho đến khi số ngẫu nhiên tiếp theo không giống với musicIndex hiện tại
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//hiển thị danh sách nhạc khi nhấp vao icon
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  // chuyển tên bài hát, nghệ sĩ từ mảng
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      //nếu giây nhỏ hơn 10 thì thêm 0 vào trước nó
      totalSec = `0${totalSec}`;
    }
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //vượt qua tổng thời lượng của bài hát
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //thêm thuộc tính thời lượng t với tổng giá trị thời lượng
  });
}

//phát bài hát khi nhấn vào thẻ li
function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //nếu chỉ mục thẻ li bằng musicIndex thì hãy play
    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//nhần vào thẻ list danh sách li
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //cập nhật chỉ mục bài hát hiện tại với chỉ mục li được nhấn
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
