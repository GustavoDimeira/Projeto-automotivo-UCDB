const fs = require('fs');
const csv = require('csv-parser');

class SheduleModel {
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
    const now = new Date()
    const data = fs.readFileSync(this.csv_path).toString().split("\n");

    const line = data.slice().reverse().find((line) => {
      let [id, checkIn, out, _RA] = line.split(',');

      return (_RA == RA && out === 'null')
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
    out = new Date().toISOString()

    data[id] = [_id, checkIn, out, RA].join(',')

    const new_content = Buffer.from(data.join("\n"))
    fs.writeFileSync(this.csv_path, new_content);

    return {id, in: checkIn, out, RA};
  }

  async addShedule(RA) {
    const content_buffer = fs.readFileSync(this.csv_path);

    const id = content_buffer.toString().split("\n").length
    const new_shedule = { id, in: new Date().toISOString(), out: null, RA }

    const new_shedule_data = `\n${new_shedule.id},${new_shedule.in},${new_shedule.out},${new_shedule.RA}`;
    const new_shedule_buffer = Buffer.from(new_shedule_data);

    const new_content = Buffer.concat([content_buffer, new_shedule_buffer]);

    fs.writeFileSync(this.csv_path, new_content);

    return new_shedule
  }
}

module.exports = { SheduleModel }
