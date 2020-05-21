//  삭제 버튼 클릭 이벤트
document.querySelectorAll('button[data-role="deleteReview"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (!confirm("삭제하시겠습니까?")) return false;
    let id = this.dataset.id;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/admin/review/" + id);
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send();
  });
});
//  가격표 수정
function fnSaveGame(gameName) {
  let formData = {};
  let obj = {};
  let inps = document.querySelectorAll('tbody[data-title="' + gameName + '"] input');
  inps.forEach(function (inp) {
    if (!obj[inp.name]) {
      obj[inp.name] = [inp.value];
    } else {
      obj[inp.name].push(inp.value);
    }
  });
  formData[gameName] = obj;
  for (var key in formData[gameName]) {
    if (formData[gameName][key].length === 1) {
      formData[gameName][key] = formData[gameName][key][0];
    }
  }
  let xhr = new XMLHttpRequest();
  xhr.open("PATCH", "/admin/price/" + gameName, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send(JSON.stringify(formData));
}
//  작업현황 삭제
