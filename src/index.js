const commentsForm = document.querySelector(".comments__form");
const formTextarea = commentsForm.querySelector("textarea");
const fromDate = commentsForm.querySelector('[type="date"]');
const formName = commentsForm.querySelector('[name="name"]');
const commentsAmount = document.getElementById("comments__amount");
const commentsList = document.querySelector(".comments__comments");
let comments = [
  {
    author: "Barsik",
    text: "Лично мне нравится",
    date: "2023-02-01",
    likes: 119,
    id: 1,
    time: "13:56",
  },
  {
    author: "Kotik",
    text: "Всё нормально вышло",
    date: "2023-03-04",
    likes: 7,
    id: 2,
    time: "11:49",
  },
];
commentsAmount.innerText = comments.length;

function setDate(date, time) {
  const secondsInDay = 86400;
  const seconds = secondsSinceDate(date);
  console.log(seconds);
  if (seconds <= secondsInDay) {
    return `Сегодня, ${time}`;
  } else if (seconds > secondsInDay && seconds <= 2 * secondsInDay) {
    return `Вчера, ${time}`;
  } else {
    return `${date.split("-").reverse().join(".")}`;
  }
}

function addCommentToBoard(comment) {
  const commentWrapper = document.createElement("div");
  commentWrapper.classList.add("comments__comment");
  commentWrapper.classList.add("comment");
  commentWrapper.setAttribute("data-id", comment.id);

  const commentTitle = document.createElement("h3");
  commentTitle.classList.add("comment__title");

  const commentDate = document.createElement("span");
  commentDate.classList.add("comment__date");
  commentDate.innerText = setDate(comment.date, comment.time);
  commentTitle.innerHTML = comment.author;

  const commentText = document.createElement("p");
  commentText.classList.add("comment__text");
  commentText.innerText = comment.text;

  const likesAndDeleteWrapper = document.createElement("div");
  likesAndDeleteWrapper.classList.add("comment__likesAndDeleteWrapper");

  const likesBlock = document.createElement("div");
  likesBlock.classList.add("comment__likes-block");

  const likeIcon = document.createElement("img");
  likeIcon.setAttribute("src", "./icons/like.svg");
  likeIcon.setAttribute("alt", "like");
  likeIcon.classList.add("comment__like");

  const amountLikes = document.createElement("span");
  const deleteBlock = document.createElement("div");
  deleteBlock.classList.add("comment__delete");
  const deleteImg = document.createElement("img");
  deleteImg.classList.add("deleteIcon");
  deleteImg.setAttribute("src", "./icons/delete.svg");
  deleteImg.setAttribute("alt", "delete");
  const deleteLabel = document.createElement("span");
  deleteLabel.classList.add("deleteLabel");
  deleteLabel.innerText = "Удалить комментарий";
  amountLikes.classList.add("comment__likes-amount");
  deleteBlock.appendChild(deleteImg);
  deleteBlock.appendChild(deleteLabel);
  amountLikes.innerText = comment.likes;
  likesBlock.appendChild(likeIcon);
  likesBlock.appendChild(amountLikes);
  likesAndDeleteWrapper.appendChild(likesBlock);
  likesAndDeleteWrapper.appendChild(deleteBlock);
  commentTitle.appendChild(commentDate);
  commentWrapper.appendChild(commentTitle);
  commentWrapper.appendChild(commentText);
  commentWrapper.appendChild(likesAndDeleteWrapper);
  commentsList.appendChild(commentWrapper);
  deleteImg.addEventListener("click", (e) => {
    const id = getId(e);
    const commentToDelete = document.querySelector(`[data-id='${id}']`);
    commentToDelete.remove();
    comments = comments.filter((comm) => comm.id !== id);
    commentsAmount.innerText = comments.length;
  });
  likeIcon.addEventListener("click", (e) => {
    const arr = likeIcon.getAttribute("src").split("/");
    if (arr.includes("like.svg")) {
      likeIcon.setAttribute("src", "./icons/liked.svg");
      const id = getId(e);
      console.log(id);
      const idComment = document.querySelector(`[data-id='${id}']`);
      const likeCounter = idComment.querySelector(".comment__likes-amount");
      let likesAmount = +likeCounter.innerText;
      likeCounter.innerText = likesAmount + 1;
      comments.forEach((comment) => {
        comment.id === id ? comment.likes++ : null;
      });
    } else {
      likeIcon.setAttribute("src", "./icons/like.svg");
      const id = getId(e);
      const idComment = document.querySelector(`[data-id='${id}']`);
      const likeCounter = idComment.querySelector(".comment__likes-amount");
      let likesAmount = +likeCounter.innerText;
      likeCounter.innerText = likesAmount - 1;
      comments.forEach((comment) => {
        comment.id === id ? comment.likes-- : null;
      });
    }
  });
}

function getId(event) {
  return +event.target.parentElement.parentElement.parentElement.getAttribute(
    "data-id"
  );
}

(function mapComments() {
  comments.forEach((comment) => {
    addCommentToBoard(comment);
  });
})();

formTextarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitForm();
    console.log(e.target.value);
  }
});

commentsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitForm();
});

function submitForm() {
  const name = validateInput(formName.value.trim());
  const text = validateInput(formTextarea.value.trim());
  if (name && text) {
    let dateString =
      fromDate.value === "" ? createDateString() : fromDate.value;
    const time = `${getRightNumber(new Date().getHours())}:${getRightNumber(
      new Date().getMinutes()
    )}`;
    console.log(time);
    const newComment = {
      author: formName.value.trim(),
      text: formTextarea.value.trim(),
      date: dateString,
      likes: 0,
      id: Date.now(),
      time: time,
    };
    comments.push(newComment);
    console.log(comments);
    addCommentToBoard(newComment);
    commentsAmount.innerText = comments.length;
  } else {
    const errorPopup = document.querySelector(".error");
    errorPopup.classList.add("active");
    setInterval(() => {
      errorPopup.classList.remove("active");
    }, 1500);
  }
  commentsForm.reset();
}

function secondsSinceDate(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  return seconds;
}
function createDateString() {
  const date = new Date();

  return `${date.getFullYear()}-${getRightNumber(
    date.getMonth() + 1
  )}-${getRightNumber(date.getDate())}`;
}
function getRightNumber(date) {
  if (date < 10) {
    return `0${date}`;
  } else {
    return date;
  }
}
function validateInput(text) {
  if (text === "") {
    return false;
  }
  return true;
}
