const URL = "http://localhost:3000"

// body background-img
const body = document.querySelector('body');

img_index = Math.ceil(Math.random() * 12).toString().padStart(2, '0');
img_src = `https://accounts.ucdb.br/img/background${img_index}.JPG`;

body.style.backgroundImage = `url("${img_src}")`;

// change section buttons
const shedule_section = document.querySelector("#addShedule")
const register_section = document.querySelector("#register")

const shedule_scr_btn = document.querySelector("#shedule-btn")
const register_scr_btn = document.querySelector("#register-btn")

shedule_scr_btn.addEventListener('click', () => {
  shedule_section.classList.remove("unselected")
  register_section.classList.add("unselected")

  shedule_scr_btn.classList.add("pressed")
  register_scr_btn.classList.remove("pressed")
})

register_scr_btn.addEventListener('click', () => {
  register_section.classList.remove("unselected")
  shedule_section.classList.add("unselected")

  register_scr_btn.classList.add("pressed")
  shedule_scr_btn.classList.remove("pressed")
})

// add shedule section
const ra_input = document.querySelector("#addShedule input");
const clear_addShedule = document.querySelector("#addShedule .clear-btn");
const addShedule_btn = document.querySelector("#addShedule .submit-btn");

clear_addShedule.addEventListener('click', () => ra_input.value = '');

addShedule_btn.addEventListener('click', async () => {
  newData = {
    token: 1,
    RA: ra_input.value
  }
  fetch(`${URL}/shedules`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newData)
  })
    .then(async (response) => {
      if (response.status === 404) {
        alert('RA não registrado no sistema, voce pode adicionalo na tela: "Registro de RA"')
        ra_input_register.value = ra_input.value
        register_scr_btn.click();

        return false
      }
      if (response.status >= 400) {
        const message_stringify = await response.text()
        const msg = JSON.parse(message_stringify).message

        alert(msg)
        
        return false
      }

      return response.json()
    })
    .then((json) => {
      if (json) alert(json.message)
    });
});

// register section
const name_input_register = document.querySelector("#register .name input");
const ra_input_register = document.querySelector("#register .RA_register input");
const clear_register = document.querySelector("#register .clear-btn");
const register_btn = document.querySelector("#register .submit-btn");

clear_register.addEventListener('click', () => {
  ra_input_register.value = '';
  name_input_register.value = '';
});

register_btn.addEventListener('click', () => {
  const newData = {
    token: 1,
    RA: ra_input_register.value,
    name: name_input_register.value,
  }
  fetch(`${URL}/users`,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newData)
  })
    .then(async (response) => {
      if (response.status >= 400) {
        const message_stringify = await response.text();
        const msg = JSON.parse(message_stringify).message;

        alert(msg);
        return false;
      }

      return response.json();
    })
    .then((data) => {
      if (data) {
        alert('RA registrado com sucesso, pode registrar seu horario agora')
        ra_input.value = ra_input_register.value
        shedule_scr_btn.click();
      }
    });
});
