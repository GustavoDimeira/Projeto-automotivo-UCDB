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

    if (schedule) { // se sim, ve se le ja possui horario de entrada
      if (schedule.out !== 'null') { // se sim, não adiciona nada
        this.crr_response.msg = {
          message: "horario de hoje já contabilizado"
        }
        this.crr_response.code = 400
      } else { // se não, adiciona horario de saida
        schedule = await this.model.addExit(schedule.id)
        this.crr_response.msg = {
          message: `Horario de saída adicionado: ${schedule.out}`,
          schedule
        }
        this.crr_response.code = 202
      }
    } else {
      schedule = await this.model.addSchedule(RA) // se não, cria um novo
      this.crr_response.msg = {
        message: `Horario de entrada adicionado: ${schedule.in}`,
        schedule
      }
      this.crr_response.code = 201
    }

    return this.crr_response
  }
}

module.exports = { ScheduleService }