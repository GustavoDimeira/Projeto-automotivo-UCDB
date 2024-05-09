class UserService {
  constructor(userModel) {
    this.model = userModel
    this.crr_response = {
      msg: {},
      code: -1
    }
  }

  async getByRA(RA) {
    const user = await this.model.getByRA(RA)

    if (user) {
      this.crr_response.msg = user
      this.crr_response.code = 200
    } else {
      this.crr_response.msg = {
        message: 'Usuario não encontrado'
      }
      this.crr_response.code = 404
    }

    return this.crr_response
  }

  async getAll() {
    const users = await this.model.getAll()

    this.crr_response.msg = {
      Itens: users.length,
      users
    }
    this.crr_response.code = 200

    return this.crr_response
  }

  async addUser(RA, name) {
    await this.getByRA(RA)

    if (this.crr_response.code == 404) {
      const user = await this.model.addUser(RA, name)

      this.crr_response.msg = user
      this.crr_response.code = 201
    } else {
      this.crr_response.msg = { message: "RA ja existente" }
      this.crr_response.code = 409
    }

    return this.crr_response
  }
}

module.exports = { UserService }