
export default class State {
    public timestamp: number;
    public name: string;
    public count: number;
    public difference: number;
    public weekDifference: number;
    public weekIncidence: number;
    public casesPer100k: number;
    public deaths: number;
    public RValue: number;

    constructor() {
        this.timestamp = 0;
        this.name = "";
        this.count = 0;
        this.difference = 0;
        this.weekDifference = 0;
        this.weekIncidence = 0;
        this.casesPer100k = 0;
        this.deaths = 0;
        this.RValue = 0;
    }

    weekIncidenceRounded(): number {
        return Math.round(this.weekIncidence * 100) / 100;
    }

    casesPer100kRounded(): number {
        return Math.round(this.casesPer100k * 100) / 100;
    }
}
