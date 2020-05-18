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
document.querySelectorAll("i[data-url]").forEach(function (i) {
  i.addEventListener("click", function () {
    let url = this.dataset.url;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/admin/status", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        alert(res.message);
        if (res.code === 1) location.reload();
      }
    };
    xhr.send(JSON.stringify({ path: url }));
  });
});
//  작업현황 temps 업로드
document.querySelector('input[name="status"]').addEventListener("change", function () {
  let formData = new FormData();
  let files = document.querySelector('input[name="status"]').files;
  for (var key in files) {
    formData.append("status[]", files[key]);
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/status", true);
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        document.querySelector('input[name="path"]').value = res.filename
          .map(function (v) {
            return v.path;
          })
          .join(",");
      }
    }
  };
  xhr.send(formData);
});
//  작업현황  temps -> status_imgs 폴더 이동
function fnUploadStatus() {
  let path = document.querySelector('input[name="path"]');
  if (path.value === "") {
    alert("등록된 파일이 없습니다.");
    return false;
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/upload/status", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) location.reload();
    }
  };
  xhr.send(JSON.stringify({ path: path.value }));
}
