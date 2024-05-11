const URL = `https://opulent-space-chainsaw-vxgq9w9pr92x4pp-5000.app.github.dev`

// body background-img
const body = document.querySelector('body');

img_index = Math.ceil(Math.random() * 12).toString().padStart(2, '0');
img_src = `https://accounts.ucdb.br/img/background${img_index}.JPG`;

body.style.backgroundImage = `url("${img_src}")`;

// change section buttons
const schedule_section = document.querySelector("#addSchedule")
const register_section = document.querySelector("#register")

const schedule_scr_btn = document.querySelector("#schedule-btn")
const register_scr_btn = document.querySelector("#register-btn")

schedule_scr_btn.addEventListener('click', () => {
  schedule_section.classList.remove("unselected")
  register_section.classList.add("unselected")

  schedule_scr_btn.classList.add("pressed")
  register_scr_btn.classList.remove("pressed")
})

register_scr_btn.addEventListener('click', () => {
  register_section.classList.remove("unselected")
  schedule_section.classList.add("unselected")

  register_scr_btn.classList.add("pressed")
  schedule_scr_btn.classList.remove("pressed")
})

// add schedule section
const ra_input = document.querySelector("#addSchedule input");
const clear_addSchedule = document.querySelector("#addSchedule .clear-btn");
const addSchedule_btn = document.querySelector("#addSchedule .submit-btn");

clear_addSchedule.addEventListener('click', () => ra_input.value = '');

addSchedule_btn.addEventListener('click', async () => {
  newData = {
    token: 1,
    RA: ra_input.value
  }
  fetch(`${URL}/schedules`, {
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
        schedule_scr_btn.click();
      }
    });
});
