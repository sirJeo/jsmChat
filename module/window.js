'use strict';

let charm = require('charm')();
charm.pipe(process.stdout);
charm.reset();

class Window {
    constructor  () {
        this.width = 79;
        this.height = 22;
        this.reflection = [];

        for (var h = 0; h <= this.height; h++) {
            this.reflection[h] = [];
            for (var w = 0; w <= this.width; w++) {
                this.reflection[h][w] = {char:'', color:'white'};
            }
        }
        this.createBorder();
    }

    createBorder () {
        for (let w = 1; w < this.width; w++) {
            this.reflection[0][w].char = '═';
            this.reflection[this.height][w].char = '═';
            this.reflection[21][w].char = '═';
        }
        for (let h = 1; h < 21; h++) {
            this.reflection[h][0].char = '║';
            this.reflection[h][this.width].char = '║';
            this.reflection[h][59].char = '║';
        }
        this.reflection[0][59].char = '╦';
        this.reflection[21][59].char = '╩';
        this.reflection[0][0].char = '╔';
        this.reflection[0][this.width].char = '╗';
        this.reflection[21][0].char = '╚';
        this.reflection[21][this.width].char = '╝';

    }

    paintReflection () {
        for (let h = 0; h < this.height; h++) {
            charm
                .move(h, 0)
                .write(this.reflection[h].map((it) => it.char||' ').join(''));

            //for (let w = 0; w < this.width; w++) {
            //    let position = this.reflection[h][w];
            //    charm
            //        .foreground(position.color)
            //        .write(position.char||' ');
            //}
        }

        charm
            .move(0, 1).foreground('green');

    }

}
/*
 charm
 .move(1, dy)
 .foreground(color)
    .write(c)
*/

function create() {
    return new Window();
}

module.exports = create;