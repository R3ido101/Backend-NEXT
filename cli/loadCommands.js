import fs from 'fs';
import path from 'path';

function walkSync(dir, filelist = []) {
    const files = fs.readdirSync(dir);

    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        } else {
            filelist.push(path.join(dir, file));
        }
    });

    return filelist;
}

export default function loadCommands(vantage) {
    const files = walkSync(path.join(__dirname, 'commands'));

    files.forEach((file) => {
        const command = require(file);

        vantage
            .command(command.default.command)
            .description(command.default.description)
            .action(command.default.action);
    });
}