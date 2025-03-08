const capsWarning = document.getElementById('capsWarning');

// Функция для обновления состояния Caps Lock
function updateCapsLockState(event) {
    const isCapsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    capsWarning.style.display = isCapsLockOn ? 'block' : 'none';
}

// Проверка при нажатии клавиши
document.addEventListener('keydown', function (event) {
    updateCapsLockState(event);
});

// Проверка при отпускании клавиши
document.addEventListener('keyup', function (event) {
    updateCapsLockState(event);
});

// Инициализация состояния при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    // Создаем фиктивное событие для проверки начального состояния
    const event = new KeyboardEvent('keydown');
    updateCapsLockState(event);
});

// Проверка при клике (для случаев, когда Caps Lock изменяется без клавиш)
document.addEventListener('click', function (event) {
    updateCapsLockState(event);
});

function togglePassword() {
    const passwordField = document.getElementById("password");
    const toggleIcon = document.querySelector(".toggle-password i");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}
