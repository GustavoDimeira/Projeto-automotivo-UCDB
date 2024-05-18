class ScheduleService {
  constructor(scheduleModel) {
    this.model = scheduleModel
    this.crr_response = {
      msg: {},
      code: -1
    }
  }

  async getAll() {
    const schedules = await this.model.getAll()

    this.crr_response.msg = {
      Itens: schedules.length,
      schedules
    }
    this.crr_response.code = 200

    return this.crr_response
  }

  async getByRA(RA) {
    const schedules = await this.model.getByRA(RA)

    this.crr_response.msg = {
      Itens: schedules.length,
      schedules
    }
    this.crr_response.code = 200

    return this.crr_response
  }

  async addSchedule(RA) {
    let schedule = await this.model.getFromTodayByRA(RA) // ve se ja existe um horario nesse dia

    if (schedule) { // se sim, adiciona o horario de saida
      if (schedule.out !== 'null') { // caso ja tenha horario de entrada e saida adicionados para hoje
        this.crr_response.msg = {
          message: "horario de hoje ja contabilizado"
        }
        this.crr_response.code = 400
      } else {
        schedule = await this.model.addExit(schedule.id)
        this.crr_response.msg = {
          message: "Horario de saida adicionado",
          schedule
        }
        this.crr_response.code = 202
      }
    } else {
      schedule = await this.model.addSchedule(RA) // se não, cria um novo
      this.crr_response.msg = {
        message: "Horario de etrada adicionado",
        schedule
      }
      this.crr_response.code = 201
    }

    return this.crr_response
  }
}

module.exports = { ScheduleService }