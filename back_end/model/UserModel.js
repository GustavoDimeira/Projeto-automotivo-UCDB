const fs = require('fs');
const csv = require('csv-parser');

class UserModel {
  constructor() {
    this.csv_path = "back_end/data_base/users.csv"
  }

  async getByRA(RA) {
    return new Promise((resolve, reject) => {
      let response = null
      fs.createReadStream(this.csv_path)
        .pipe(csv())
        .on('data', (row) => {
          if (row.RA === String(RA)) {
            response = row
          }
        })
        .on('end', () => {
          resolve(response);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
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

  async addUser(RA, name) {
    const new_user = { RA, name, role: 'user' }
    
    const new_user_data = `\n${new_user.RA},${new_user.name},${new_user.role}`;
    const new_user_buffer = Buffer.from(new_user_data);

    const content_buffer = fs.readFileSync(this.csv_path);

    const new_content = Buffer.concat([content_buffer, new_user_buffer]);

    fs.writeFileSync(this.csv_path, new_content);

    return new_user;
  }

}

module.exports = { UserModel }
