// interface ITest {
//     year: number,
//     kw: number,
//     number: number,
//     positive: number,
//     ratio: number,
//     lab_num: number
// }

export default class Test {
    public year: number;
    public kw: number;
    public number: number;
    public positive: number;
    public ratio: number;
    public lab_num: number;

    constructor() {
        this.year = 1970;
        this.kw = 0;
        this.number = 0;
        this.positive = 0;
        this.ratio = 0;
        this.lab_num = 0;
    }
}