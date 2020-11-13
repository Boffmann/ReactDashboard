import React from 'react';
import GridContainer from '../components/Grid/GridContainer'
import GridItem from '../components/Grid/GridItem'
import Card from '../components/Card/Card'
import CardHeader from '../components/Card/CardHeader'
import CardBody from '../components/Card/CardBody'
import KeyValueGrid from '../components/Card/KeyValueGrid'
import Graph from '../components/Graph/Graph'
import State from '../../common/state'
import GraphLine from '../components/Graph/GraphLine'
import { timestampToDate } from '../../common/TimeFormater'
import '../app/App.css'

class TestsVsPositive {
  public yearAndKW: string[];
  public tests: number[];
  public positive: number[];
  public ratio: number[];

  constructor() {
    this.yearAndKW = [];
    this.tests = [];
    this.positive = [];
    this.ratio = [];
  }
}

class CasesVsDeath {
  public yearAndKW: string[];
  public cases: number[];
  public death: number[];

  constructor() {
    this.yearAndKW = [];
    this.cases = [];
    this.death = [];
  }
}

class CoronaView extends React.Component {
  state = {
    Leer: new State(),
    Leer_Previous: new State(),
    NDS: new State(),
    NDS_Previous: new State(),
    HH: new State(),
    HH_Previous: new State(),
    Germany: new State(),
    Germany_Previous: new State(),
    TvP: new TestsVsPositive()
  };

  private parseAPIDataToState(data: any): State {
      var newState = new State();

      newState.timestamp = data.states[0].timestamp;
      newState.name = data.states[0].name;
      newState.count = data.states[0].count;
      newState.difference = data.states[0].difference;
      newState.weekDifference = data.states[0].weekDifference;
      newState.weekIncidence = data.states[0].weekIncidence;
      newState.casesPer100k = data.states[0].casesPer100k;
      newState.deaths = data.states[0].deaths;

      newState.weekIncidence = newState.weekIncidenceRounded();
      newState.casesPer100k = newState.casesPer100kRounded();

      return newState;
  }

  private parseAPIDataToTestsVsPositive(data: any): TestsVsPositive {
    var TvP = new TestsVsPositive();

    for (var index = 0; index < data.tests.length; ++index) {
      const test = data.tests[index];
      console.log(`Test: ${test}`);
      // newTvP.yearAndKW = test.year.toString() + "/" + test.kw.toString();
      TvP.yearAndKW.push(test.kw);
      TvP.tests.push(test.number);
      TvP.positive.push(test.positive);
      TvP.ratio.push(test.ratio);
    }

    return TvP;
  }

  private async updateData() {
    var response = await fetch('/api/corona/cases/previous?region=Niedersachsen&number=1');
    var body = await response.json();
    this.setState({NDS_Previous: this.parseAPIDataToState(body)});

    var response = await fetch('/api/corona/cases/previous?region=Hamburg&number=1');
    var body = await response.json();
    this.setState({HH_Previous: this.parseAPIDataToState(body)});

    var response = await fetch('/api/corona/cases/previous?region=LK%20Leer&number=1');
    var body = await response.json();
    this.setState({Leer_Previous: this.parseAPIDataToState(body)});

    var response = await fetch('/api/corona/cases/previous?region=Deutschland&number=1');
    var body = await response.json();
    this.setState({Germany_Previous: this.parseAPIDataToState(body)});

    response = await fetch('/api/corona/cases?region=Niedersachsen&type=State');
    body = await response.json();
    this.setState({NDS: this.parseAPIDataToState(body)});

    response = await fetch('/api/corona/cases?region=Hamburg&type=State');
    body = await response.json();
    this.setState({HH: this.parseAPIDataToState(body)});

    response = await fetch('/api/corona/cases?region=Leer&type=Region');
    body = await response.json();
    this.setState({Leer: this.parseAPIDataToState(body)});

    response = await fetch('/api/corona/cases?region=germany&type=Country');
    body = await response.json();
    var germany = this.parseAPIDataToState(body);
    germany.RValue = body.states[0].RValue;
    this.setState({Germany: germany});

    // var response = await fetch('/api/corona/tests?number=10');
    // var body = await response.json();
    // this.setState({TvP: this.parseAPIDataToTestsVsPositive(body)});

  }

  componentDidMount() {
    // this.updateData();

    var tvp = new TestsVsPositive();
    tvp.yearAndKW = ["1", "2", "3", "4", "5", "6", "7"];
    tvp.tests = [10000, 250000, 300000, 40000, 5000000, 560000, 910000];
    tvp.positive = [1000, 200, 3000, 400000, 5000, 600, 70];
    tvp.ratio = [5.123, 17.987, 13.0, 40.12, 11.123, 15.123, 18.123];
    
    this.setState({TvP: tvp});
  }

  callApi = async (regions: string) => {
    const response = await fetch('/api/corona/cases?region='+regions);
    const body = await response.json();

    return body;
  }

  handleSubmit = async (e: any) => {
      e.preventDefault();
  }
  
  render() {

    const updateDate = timestampToDate(this.state.Germany.timestamp);
    const updated = updateDate.toLocaleDateString() + " " + updateDate.toLocaleTimeString();


    const testLine = new GraphLine(
        this.state.TvP.yearAndKW,
        this.state.TvP.tests,
        "Tests"
    )
    const positiveLine = new GraphLine(
        this.state.TvP.yearAndKW,
        this.state.TvP.positive,
        "Positive"
    )
    const ratioLine = new GraphLine(
        this.state.TvP.yearAndKW,
        this.state.TvP.ratio,
        "TestPositiveRatio"
    )

    // TODO get cases for previous day, calculate difference and provide difference to KeyValueGrid


    return (
      <div className="screenView">
        <GridContainer height="40%">
          <GridItem xs={3}>
            <Card>
              <CardHeader>
                  <h4>{this.state.NDS.name}</h4>
              </CardHeader>
              <CardBody>
                  <KeyValueGrid entries={[
                    {key: 'Fälle gesamt:', value: this.state.NDS.count, difference: this.state.NDS.count - this.state.NDS_Previous.count},
                    {key: 'Wocheninzidenz:', value: this.state.NDS.weekIncidence, difference: this.state.NDS.weekIncidence - this.state.NDS_Previous.weekIncidence},
                    {key: 'Fälle pro 100k:', value: this.state.NDS.casesPer100k, difference: this.state.NDS.casesPer100k - this.state.NDS_Previous.casesPer100k},
                    {key: 'Tote:', value: this.state.NDS.deaths, difference: this.state.NDS.deaths - this.state.NDS_Previous.deaths},
                  ]} />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={3}>
            <Card>
              <CardHeader>
                  <h4>{this.state.HH.name}</h4>
              </CardHeader>
              <CardBody>
                  <KeyValueGrid entries={[
                    {key: 'Fälle gesamt:', value: this.state.HH.count, difference: this.state.HH.count - this.state.HH_Previous.count},
                    {key: 'Wocheninzidenz:', value: this.state.HH.weekIncidence, difference: this.state.HH.weekIncidence - this.state.HH_Previous.weekIncidence},
                    {key: 'Fälle pro 100k:', value: this.state.HH.casesPer100k, difference: this.state.HH.casesPer100k - this.state.HH_Previous.casesPer100k},
                    {key: 'Tote:', value: this.state.HH.deaths, difference: this.state.HH.deaths - this.state.HH_Previous.deaths},
                  ]} />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={3}>
            <Card>
              <CardHeader>
                  <h4>{this.state.Leer.name}</h4>
              </CardHeader>
              <CardBody>
                  <KeyValueGrid entries={[
                    {key: 'Fälle gesamt:', value: this.state.Leer.count, difference: this.state.Leer.count - this.state.Leer_Previous.count},
                    {key: 'Wocheninzidenz:', value: this.state.Leer.weekIncidence, difference: this.state.Leer.weekIncidence - this.state.Leer_Previous.weekIncidence},
                    {key: 'Fälle pro 100k:', value: this.state.Leer.casesPer100k, difference: this.state.Leer.casesPer100k - this.state.Leer_Previous.casesPer100k},
                    {key: 'Tote:', value: this.state.Leer.deaths, difference: this.state.Leer.deaths - this.state.Leer_Previous.deaths},
                  ]} />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={3}>
            <Card>
              <CardHeader>
                  <h4>{this.state.Germany.name}</h4>
              </CardHeader>
              <CardBody>
                  <KeyValueGrid entries={[
                    {key: 'Fälle gesamt:', value: this.state.Germany.count, difference: this.state.Germany.count - this.state.Germany_Previous.count},
                    {key: 'R-Wert:', value: this.state.Germany.RValue, difference: this.state.Germany.RValue - this.state.Germany_Previous.RValue},
                    {key: 'Fälle pro 100k:', value: this.state.Germany.casesPer100k, difference: this.state.Germany.casesPer100k - this.state.Germany_Previous.casesPer100k},
                    {key: 'Tote:', value: this.state.Germany.deaths, difference: this.state.Germany.deaths - this.state.Germany_Previous.deaths},
                  ]} />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <div style={{height: "5%"}}></div>
        <GridContainer height="50%">
          <GridItem xs={6}>
            <Graph lines = {[testLine, positiveLine]}/>
          </GridItem>
          <GridItem xs={6}>
            <Graph lines = {[ratioLine]}/>
          </GridItem>
        </GridContainer>
        <div style={{height: "5%", color: '#FFFFFF'}}>
          Last updated: {updated}
        </div>
      </div>
    );
  }
}

export default CoronaView;