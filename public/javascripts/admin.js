function fnLogin() {
  let formData = {};
  let user_id = document.querySelector('input[name="user_id"]');
  let user_pw = document.querySelector('input[name="user_pw"]');
  if (user_id.value === "") {
    alert("아이디를 입력해주세요");
    user_id.focus();
    return false;
  }
  if (user_pw.value === "") {
    alert("아이디를 입력해주세요");
    user_pw.focus();
    return false;
  }
  formData["user_id"] = user_id.value;
  formData["user_pw"] = user_pw.value;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code === 1) {
        location.href = "/admin";
      } else {
        alert(res.message);
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}
