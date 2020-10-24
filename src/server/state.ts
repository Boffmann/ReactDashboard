
export default class State {
    public name: string;
    public count: number;
    public difference: number;
    public weekDifference: number;
    public weekIncidence: number;
    public casesPer100k: number;
    public deaths: number;

    constructor() {
        this.name = "";
        this.count = 0;
        this.difference = 0;
        this.weekDifference = 0;
        this.weekIncidence = 0;
        this.casesPer100k = 0;
        this.deaths = 0;
    }
}
