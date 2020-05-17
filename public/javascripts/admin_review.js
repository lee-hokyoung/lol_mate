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
