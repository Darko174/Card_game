const setNicknameWrapper = document.querySelector(".setNicknameWrapper");
const submitNickname = document.querySelector(".submitNickname");
const inputNickname = document.querySelector(".inputNickname");

let userName = localStorage.getItem("userName") ? localStorage.getItem("userName") : checkUsername();

function checkUsername() {
    if(!localStorage.getItem("userName")) {
        setNicknameWrapper.classList.toggle("hidden");
    }
}
submitNickname.addEventListener("click", () => {
    if(inputNickname.value.length >= 3) {
        localStorage.setItem("userName", inputNickname.value.trim());
        setNicknameWrapper.classList.toggle("hidden");
        userName = inputNickname.value.trim();
    }
})
