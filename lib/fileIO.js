const fs = require("fs");

class FileIO {
    constructor (encoding = "utf8") {
        this.encoding = encoding;
    }

    read (path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, this.encoding, (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    };

    write (path, file_contents) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, file_contents, this.encoding, err => {
                if (err) {
                    reject(err);
                }

                resolve("Success");
            });
        });
    };

    append (path, file_contents) {
        return new Promise((resolve, reject) => {
            fs.appendFile(path, file_contents, this.encoding, err => {
                if (err) {
                    reject(err);
                }

                resolve("Success");
            });
        });
    };
}

module.exports = FileIO;

