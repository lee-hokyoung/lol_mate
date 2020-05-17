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
      editorElement.setHtml(
        "Hello world!\n\n" + "I'm an instance of [url=https://ckeditor.com]CKEditor[/url]."
      );
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
initSample();
document.addEventListener("DOMContentLoaded", function () {
  CKEDITOR.instances.editor.setData(content);
});
const fnSubmitReview = function (id) {
  let title = document.querySelector('input[name="title"]');
  let writer = document.querySelector('input[name="writer"]');
  let password = document.querySelector('input[name="password"]');
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
  if (password.value === "") {
    alert("비밀번호를 입력해주세요");
    password.focus();
    return false;
  }
  if (content === "") {
    alert("내용을 입력해 주세요");
    return false;
  }
  //  내용에서 img src 추출하기
  let img_urls = content
    .split("\n")
    .filter(function (v) {
      if (v.indexOf("<img") > -1) return v;
    })
    .map(function (w) {
      return $(w).find("img").attr("src");
    });
  let formData = {};
  formData["id"] = id;
  formData["title"] = title.value;
  formData["writer"] = writer.value;
  formData["password"] = password.value;
  formData["content"] = content;
  if (img_urls.length > 0) {
    formData["img_urls"] = img_urls;
  }
  let xhr = new XMLHttpRequest();
  xhr.open("PATCH", "/review/update", true);
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
