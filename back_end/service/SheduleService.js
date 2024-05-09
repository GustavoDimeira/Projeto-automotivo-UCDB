class SheduleService {
  constructor(sheduleModel) {
    this.model = sheduleModel
    this.crr_response = {
      msg: {},
      code: -1
    }
  }

  async getAll() {
    const shedules = await this.model.getAll()

    this.crr_response.msg = {
      Itens: shedules.length,
      shedules
    }
    this.crr_response.code = 200

    return this.crr_response
  }

  async getByRA(RA) {
    const shedules = await this.model.getByRA(RA)

    this.crr_response.msg = {
      Itens: shedules.length,
      shedules
    }
    this.crr_response.code = 200

    return this.crr_response
  }

  async addShedule(RA) {
    let shedule = await this.model.getFromTodayByRA(RA) // ve se ja existe um horario nesse dia

    if (shedule) { // se sim, adiciona o horario de saida
      if (shedule.out !== 'null') { // caso ja tenha horario de entrada e saida adicionados para hoje
        this.crr_response.msg = {
          message: "horario de hj ja contabilizado"
        }
        this.crr_response.code = 400
      } else {
        shedule = await this.model.addExit(shedule.id)
        this.crr_response.msg = {
          message: "Horario de saida adicionado",
          shedule
        }
        this.crr_response.code = 202
      }
    } else {
      shedule = await this.model.addShedule(RA) // se não, cria um novo
      this.crr_response.msg = {
        message: "Horario de etrada adicionado",
        shedule
      }
      this.crr_response.code = 201
    }

    return this.crr_response
  }
}

module.exports = { SheduleService }