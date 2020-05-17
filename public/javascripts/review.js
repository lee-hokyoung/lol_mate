if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) CKEDITOR.tools.enableHtml5Elements(document);

CKEDITOR.config.height = 300;
CKEDITOR.config.width = "auto";
CKEDITOR.config.extraPlugins = "image2";
var initSample = (function () {
  var wysiwygareaAvailable = isWysiwygareaAvailable(),
    isBBCodeBuiltIn = !!CKEDITOR.plugins.get("bbcode");

  return function () {
    var editorElement = CKEDITOR.document.getById("editor");

    if (isBBCodeBuiltIn) {
      editorElement.setHtml("Hello world!\n\n" + "I'm an instance of [url=https://ckeditor.com]CKEditor[/url].");
    }

    if (wysiwygareaAvailable) {
      CKEDITOR.replace("editor", {
        skin: "moono-lisa",
        filebrowserImageUploadUrl: "/upload/anonymous",
      });
    } else {
      editorElement.setAttribute("contenteditable", "true");
      CKEDITOR.inline("editor");
    }
  };

  function isWysiwygareaAvailable() {
    if (CKEDITOR.revision == "%RE" + "V%") {
      return true;
    }
    return !!CKEDITOR.plugins.get("wysiwygarea");
  }
})();

const read_content = document.querySelector("#read_content");
if (read_content) {
  document.addEventListener("DOMContentLoaded", function () {
    var contentElement = CKEDITOR.document.getById("read_content");
    contentElement.setHtml(content);
  });
} else {
  initSample();
}

const fnSubmitReview = function () {
  let title = document.querySelector('input[name="title"]');
  let writer = document.querySelector('input[name="writer"]');
  let email = document.querySelector('input[name="email"]');
  let password = document.querySelector('input[name="password"]');
  let password_chk = document.querySelector('input[name="password_chk"]');
  let content = CKEDITOR.instances.editor.getData();

  if (title.value === "") {
    alert("제목을 입력해주세요");
    title.focus();
    return false;
  }
  if (writer.value === "") {
    alert("글쓴이를 입력해주세요");
    writer.focus();
    return false;
  }
  if (email.value === "") {
    alert("이메일을 입력해주세요");
    email.focus();
    return false;
  }
  if (password.value === "" || password_chk.value === "") {
    alert("비밀번호를 입력해주세요");
    password.focus();
    return false;
  }
  if (password.value !== password_chk.value) {
    alert("입력한 비밀번호가 서로 다릅니다");
    password.focus();
    return false;
  }
  if (content === "") {
    alert("내용을 입력해 주세요");
    return false;
  }
  let formData = {};
  formData["title"] = title.value;
  formData["writer"] = writer.value;
  formData["email"] = email.value;
  formData["password"] = password.value;
  formData["content"] = content;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/review/register", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert(res.message);
      if (res.code === 1) {
        location.href = "/review/list";
      }
    }
  };
  xhr.send(JSON.stringify(formData));
  return false;
};

//  페이지 클릭 이벤트
