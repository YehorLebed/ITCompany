// Объявляем переменные с которыми будем работать

let body = document.querySelector('body');

// Checkbox бургер-меню
const burgerCheckbox = document.getElementById('menu-checkbox');
// Меню
const mainMenu = document.querySelector('.main-menu');
// Якорные ссылки меню
const anchors = mainMenu.querySelectorAll('a[href*="#"');

// Pop-Up меню
const popUp = document.querySelector('.pop-up');
const popUpCloseBtn = popUp.querySelector('.pop-up-close');
const popUpOkBtn = popUp.querySelector('.pop-up-info__btn');

// Офферные ссылки
const linksOffer = document.querySelectorAll('.btn-offer');

// Вкл/выкл бургер-меню
function toogleMenu() {
  burgerCheckbox.checked = burgerCheckbox.checked ? false : true;
}



// #### Функции для Pop-Up меню ####

// Добавляем слушатель событий для офферных ссылок
for (let i = 0; i < linksOffer.length; i++) {
  linksOffer[i].addEventListener('click', function (e) {
    e.preventDefault();
    popUpMenu();
  });
}

// Добавляем слушатель событий для кнопок Pop-Up меню
popUpCloseBtn.addEventListener('click', popUpMenu);
popUpOkBtn.addEventListener('click', popUpMenu);

// Функция вызова Pop-Up меню
function popUpMenu() {
  popUp.classList.toggle('pop-up__active');
  toggleOverflow();
}

// Функция, которая блокирует скролл страницы при открытом Pop-Up меню
function toggleOverflow() {
  if (body.querySelector('.pop-up__active')) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = 'visible';
  }
}


// #### Функции для плавной прокрутки ####

// Добавляем слушатель событий для якорных ссылок меню
for (let i = 0; i < anchors.length; i++) {
  // Вкл/выкл бургер-меню
  anchors[i].addEventListener('click', toogleMenu);
  // Плавная прокрутка по якорю
  anchors[i].addEventListener('click', function (e) {
    e.preventDefault();
    const blockId = anchors[i].getAttribute('href');
    // Плавный скролл к якорю
    document.querySelector('' + blockId).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  });
}


// #### Валидация полей формы ####

// Input fields
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const email = document.getElementById('email');
const agreement = document.getElementById('agreement');
// Form
const form = document.getElementById('signUpForm');
// Validation colors 
const GREEN_COLOR = '#2ECC71';
const RED_COLOR = '#E74C3C';


firstName.addEventListener('focusout', validateFirstName);
lastName.addEventListener('focusout', validateLastName);

password.addEventListener('focusout', validatePassword);
confirmPassword.addEventListener('focusout', validateConfirmPassword);

email.addEventListener('focusout', validateEmail);
// agreement.addEventListener('focusout', validateAgreement);

// Handle form
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (
    validateFirstName() &&
    validateLastName() &&
    validatePassword() &&
    validateConfirmPassword() &&
    validateEmail()
  ) {
    const name = firstName.value;
    const infoPanel = document.querySelector('.submit-panel');
    infoPanel.querySelector('.name').innerHTML = name;
    infoPanel.style.display = 'block';
  }
})


// Validate functions
function validateFirstName() {
  // If is empty
  if (checkIfEmpty(firstName)) return;
  // If it has only letters
  if (!checkIfOnlyLeters(firstName)) return;
  return true;
}

function validateLastName() {
  // If is empty
  if (checkIfEmpty(lastName)) return;
  // If it has only letters
  if (!checkIfOnlyLeters(lastName)) return;
  return true;
}

function validatePassword() {
  // If is empty
  if (checkIfEmpty(password)) return;
  // Must of certain lenght
  if (!meetLenght(password, 6, 100)) return;
  // Check password against our character set
  // 1 - a (only letters lower case)
  // 2 - a 1 (letters lower case + numbers)
  // 3 - A a 1 (letters lower + upper case + nombers)
  if (!containCharacters(password, 3)) return;
  return true;
}

function validateConfirmPassword() {
  if (password.className !== 'valid') {
    setInvalid(confirmPassword, 'Password must be valid');
    return;
  }
  // If they match
  if (password.value !== confirmPassword.value) {
    setInvalid(confirmPassword, 'Passwords must match');
    return;
  } else {
    setValid(confirmPassword);
  }
  return true;
}

function validateEmail() {
  if (checkIfEmpty(email)) return;
  if (!containCharacters(email, 4)) return;
  return true;
}


// Utility functions
function checkIfEmpty(field) {
  if (isEmpty(field.value.trim())) {
    // Set field invalid
    setInvalid(field, `${field.name} must not be empty`);
    return true
  } else {
    // set field valid
    setValid(field);
    return false;
  }
}

function isEmpty(value) {
  if (value === '') return true;
  return false;
}

function setInvalid(field, message) {
  field.className = 'invalid';
  field.nextElementSibling.innerHTML = message;
  field.nextElementSibling.style.color = RED_COLOR;
}

function setValid(field) {
  field.className = 'valid';
  field.nextElementSibling.innerHTML = '';
  // field.nextElementSibling.style.color = GREEN_COLOR;
}

function checkIfOnlyLeters(field) {
  if (/^[a-zA-Z ]+$/.test(field.value)) {
    setValid(field);
    return true;
  } else {
    setInvalid(field, `${field.name} must contain only letters`);
  }
}

function meetLenght(field, minLength, maxLength) {
  if (field.value.length >= minLength && field.value.length < maxLength) {
    setValid(field);
    return true;
  } else if (field.value.length < minLength) {
    setInvalid(field, `${field.name} must be at least ${minLength} charachters long`);
    return false;
  } else {
    setInvalid(field, `${field.name} must be shorter than ${maxLength} chachters`);
    return false;
  }
}

function containCharacters(field, code) {
  let regularExpression;
  switch (code) {
    case 1:
      // (only letters lower case)
      regularExpression = /(?=.*[a-zA-Z])/;
      return matchWithRegularExpression(regularExpression, field, 'Must contain at least one letter');
    case 2:
      // (letters lower case + numbers)
      regularExpression = /(?=.*\d)(?=.*[a-zA-Z])/;
      return matchWithRegularExpression(regularExpression, field, 'Must contain at least one letter and one number');
    case 3:
      // (letters lower + upper case + numbers)
      regularExpression = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
      return matchWithRegularExpression(regularExpression, field, 'Must contain at least one uppercase letter, one lowercase letter and one number');
    case 4:
      // Email
      regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return matchWithRegularExpression(regularExpression, field, 'Must be a valid mail address');
    default:
      return false;
  }
}

function matchWithRegularExpression(regularExpression, field, message) {
  if (field.value.match(regularExpression)) {
    setValid(field);
    return true;
  } else {
    setInvalid(field, message);
    return false;
  }
}

// #### Анимация блока при прокрутке ####
let show = true;
let animatedBlock = document.querySelector('.projects-wrapper');
window.addEventListener('scroll', function () {
  if (!show) return false;

  let windowFromTop = window.pageYOffset;
  let elemFromTop = getCoords(animatedBlock).top;

  if (windowFromTop >= elemFromTop - this.screen.height/2) {
    console.log('animation');
    elemMoveX(animatedBlock, 0, 1);

    show = false;
  }
})

function getCoords(elem) {
  // (1)
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docEl = document.documentElement;

  // (2)
  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  // (3)
  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

  // (4)
  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return {
    top: top,
    left: left
  };
}

function elemMoveX(element, position, transition) {
  element.setAttribute('style', 'transform:translateX(' + position + '%)');
  element.style.transition = '' + transition + 's';
}