'use strict';
module.exports = () => {
    let argumenrs = {
        node: process.argv[0],
        script: process.argv[1]
    };

    for(let i = 2; i < process.argv.length; i++) {
        switch(process.argv[i]) {
            case '--port':
            case '-p':
            case '-P':
                let p = process.argv[i+1];
                if (p && parseInt(p) > 0) {
                    argumenrs.port = parseInt(p);
                    i++;
                }
                break;
            case '--host':
            case '-h':
            case '-H':
                let h = process.argv[i+1];
                if (h && h.length > 0) {
                    argumenrs.host = h;
                    i++;
                }
                break;
        }
    }
    return argumenrs;
};

