const assert = require('assert');

export default class GraphLine {

    public x_values: (string|number)[];
    public y_values: (string|number)[];
    public label: string;

    constructor(x: (string|number)[], y: (string|number)[], label: string) {

        assert.deepEqual(x.length, y.length);

        this.x_values = x;
        this.y_values = y;
        this.label = label;
    }

}