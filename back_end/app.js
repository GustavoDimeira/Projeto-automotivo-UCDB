require("dotenv").config()
const express = require('express');

const PORT = process.env.port

const { roles, validateToken, validateName, validateRA, errors } = require('./utils');

const { UserService } = require('./service/UserService')
const { UserModel } = require("./model/UserModel")

const { ScheduleService } = require('./service/ScheduleService')
const { ScheduleModel } = require("./model/ScheduleModel")

const scheduleModel = new ScheduleModel()
const scheduleService = new ScheduleService(scheduleModel)

const userModel = new UserModel()
const userService = new UserService(userModel)

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permitir solicitações de qualquer origem
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json("Hello World, it's WORKING !!!")
})

// para retornar um usuario.
app.get('/users/:RA', async (req, res) => {
  const RA = req.params.RA;
  const { token } = req.body

  if (validateToken(token, roles.user)) {
    if (validateRA(RA)) {
      try {
        const { msg, code } = await userService.getByRA(RA)
        res.status(code).json(msg)
      } catch(error) {
        res.status(500).json({message: errors["500"], error})
      }

    } else {
      res.status(400).json(errors["400"])
    }
  } else {
    res.status(403).json(errors["403"])
  }
});

// para listar todos os usuários.
app.get('/users', async (req, res) => {
  const { token } = req.body

  if (validateToken(token, roles.admin)) {
    try {
      const { msg, code } = await userService.getAll()
      res.status(code).json(msg)
    } catch(error) {
      res.status(500).json({message: errors["500"], error})
    }

  } else {
    res.status(403).json(errors["403"])
  }
});

// para listar todos os horários.
app.get('/schedules', async (req, res) => {
  const { token } = req.body

  if (validateToken(token, roles.admin)) {
    try {
      const { msg, code } = await scheduleService.getAll()
      res.status(code).json(msg)
    } catch(error) {
      res.status(500).json({message: errors["500"], error})
    }

  } else {
    res.status(403).json(errors["403"])
  }
});

// para adicionar um novo "usuário" ao sistema.
app.post('/users', async (req, res) => {
  const { token, RA, name } = req.body

  if (validateToken(token, roles.user)) {
    if (validateName(name) && validateRA(RA)) {
      try {
        const { msg, code } = await userService.addUser(RA, name)
        res.status(code).json(msg)
      } catch(error) {
        res.status(500).json({message: errors["500"], error})
      }

    } else {
      res.status(400).json(errors["400"])
    }
  } else {
    res.status(403).json(errors["403"])
  }
});

// para adicionar as presenças, atrelando-as ao RA, (seja entrada ou saida).
app.post('/schedules', async (req, res) => {
  const { token, RA } = req.body

  if (validateToken(token, roles.user)) {
    if (validateRA(RA)) {
      try {
        const user = await userModel.getByRA(RA)

        if (user) {
          const { msg, code } = await scheduleService.addSchedule(RA)
          res.status(code).json(msg)
        } else {
          res.status(404).json(errors["404"])
        }
      } catch(error) {
        res.status(500).json({...errors["500"], error})
      }

    } else {
      res.status(400).json(errors["400"])
    }
  } else {
    res.status(403).json(errors["403"])
  }
});

// para retornar a lista de presenças por RA
app.get('/schedules/:RA', async (req, res) => {
  const RA = req.params.RA;
  const { token } = req.body

  if (validateToken(token, roles.user)) {
    if (validateRA(RA)) {
      try {
        const user = await userModel.getByRA(RA)

        if (user) {
          const { msg, code } = await scheduleService.getByRA(RA)
          res.status(code).json(msg)
        } else {
          res.status(404).json(errors["404"])
        }
      } catch(error) {
        res.status(500).json({...errors["500"], error})
      }

    } else {
      res.status(400).json(errors["400"])
    }
  } else {
    res.status(403).json(errors["403"])
  }
});

// para o trombeta remover algum horário
app.delete('/schedules/:RA', async (req, res) => {
  const { token, RA } = req.body

  if (validateToken(token, roles.admin)) {
    if (validateRA(RA)) {
      try {
        const { msg, code } = await scheduleService.removeSchedule(RA)
        res.status(code).json(msg)
      } catch(error) {
        res.status(500).json({message: errors["500"], error})
      }

    } else {
      res.status(400).json(errors["400"])
    }
  } else {
    res.status(403).json(errors["403"])
  }
});

module.exports = { app }
