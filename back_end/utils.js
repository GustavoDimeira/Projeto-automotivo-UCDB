const roles = {
  user: {
    role: 'user',
    level: 0
  },
  admin: {
    role: 'admin',
    level: 1
  }
}

const errors = {
  "500": {
    code: 500,
    message: "Internal server error"
  },
  "400": {
    code: 400,
    message: 'informações passadas estão incorretas'
  },
  "404": {
    code: 404,
    message: 'Usuario não encontrado'
  },
  "403": {
    code: 403,
    message: 'acesso negado, permição insuficiente ou token invalido'
  },
}

const validateToken = (token, minimalRole) => {
  const [ role, isValid ] = getTokenMsg(token)

  return (isValid && minimalRole.level <= role.level) 
}

const validateRA = (RA) => {
  RA_int = parseInt(RA)
  RA_str = RA_int.toString()

  return RA_str && RA_str.length === 6 && RA_str === RA
}

const validateName = (name) => {
  return name && nam.length >= 3 && !name.includes(",")
}

const getTokenMsg = (token) => {
  // tem que descriptografar o token, e retornar as informações
  return [roles.admin, true]
}

module.exports = { roles, errors, validateToken, validateRA, validateName }