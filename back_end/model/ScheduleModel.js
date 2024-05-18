const fs = require('fs');
const csv = require('csv-parser');

class ScheduleModel {
  constructor() {
    this.csv_path = "back_end/data_base/schedules.csv"
  }

  async getAll() {
    return new Promise((resolve, reject) => {
      const itens = [];
      fs.createReadStream(this.csv_path)
        .pipe(csv())
        .on('data', (row) => {
          itens.push(row);
        })
        .on('end', () => {
          resolve(itens);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async getByRA(RA) {
    return new Promise((resolve, reject) => {
      const itens = [];
      fs.createReadStream(this.csv_path)
        .pipe(csv())
        .on('data', (row) => {
          if (row.RA == RA) {
            itens.push(row);
          }
        })
        .on('end', () => {
          resolve(itens);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async getFromTodayByRA(RA) {
    const now = new Date();

    now.setHours(now.getHours() - 4);

    const data = fs.readFileSync(this.csv_path).toString().split("\n");

    const line = data.slice().reverse().find((line) => {
      let [id, checkIn, out, _RA] = line.split(',');

      let checkInDate = new Date(checkIn);

      return (_RA == RA &&
        checkInDate.getUTCFullYear() === now.getUTCFullYear() &&
        checkInDate.getUTCMonth() === now.getUTCMonth() &&
        checkInDate.getUTCDate() === now.getUTCDate());
    });

    if (line) {
      let [id, checkIn, out, _RA] = line.split(',');

      return {
        id: parseInt(id), in: checkIn, out, RA,
      };
    }
    return null;
  }

  async addExit(id) {
    const data = fs.readFileSync(this.csv_path).toString().split("\n");

    let [_id, checkIn, out, RA] = data[id].split(',');
    const date = new Date();
    date.setHours(date.getHours() - 4);
    out = date.toISOString();

    data[id] = [_id, checkIn, out, RA].join(',')

    const new_content = Buffer.from(data.join("\n"))
    fs.writeFileSync(this.csv_path, new_content);

    return { id, in: checkIn, out, RA };
  }

  async addSchedule(RA) {
    const content_buffer = fs.readFileSync(this.csv_path);

    const id = content_buffer.toString().split("\n").length;
    const date = new Date();
    date.setHours(date.getHours() - 4);
    const new_schedule = { id, in: date.toISOString(), out: null, RA }

    const new_schedule_data = `\n${new_schedule.id},${new_schedule.in},${new_schedule.out},${new_schedule.RA}`;
    const new_schedule_buffer = Buffer.from(new_schedule_data);

    const new_content = Buffer.concat([content_buffer, new_schedule_buffer]);

    fs.writeFileSync(this.csv_path, new_content);

    return new_schedule
  }
}

module.exports = { ScheduleModel }
