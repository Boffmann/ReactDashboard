import React from 'react';
import GridContainer from '../components/Grid/GridContainer'
import GridItem from '../components/Grid/GridItem'
import Card from '../components/Card/Card'
import CardHeader from '../components/Card/CardHeader'
import CardBody from '../components/Card/CardBody'
import Graph from '../components/Graph/Graph'
import State from '../../common/state'

class TestsVsPositive {
  public yearAndKW: string;
  public tests: number;
  public positive: number

  constructor() {
    this.yearAndKW = "";
    this.tests = 0;
    this.positive = 0;
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
    NDS: new State(),
    HH: new State(),
    Germany: new State(),
    TvP: [new TestsVsPositive()]
  };

  private parseAPIDataToState(data: any): State {
      var newState = new State();

      newState.name = data.states[0].name;
      newState.count = data.states[0].count;
      newState.difference = data.states[0].difference;
      newState.weekDifference = data.states[0].weekDifference;
      newState.weekIncidence = data.states[0].weekIncidence;
      newState.casesPer100k = data.states[0].casesPer100k;
      newState.deaths = data.states[0].deaths;

      return newState;
  }

  private parseAPIDataToTestsVsPositive(data: any): TestsVsPositive[] {
    var TvP: TestsVsPositive[] = [];

    for (var index = 0; index < data.tests.length; ++index) {
      const test = data.tests[index];
      console.log(`Test: ${test}`);
      var newTvP = new TestsVsPositive();
      // newTvP.yearAndKW = test.year.toString() + "/" + test.kw.toString();
      newTvP.yearAndKW = test.kw.toString();
      newTvP.tests = test.number;
      newTvP.positive = test.positive;

      TvP.push(newTvP);
    }

    return TvP;
  }

  private async updateData() {
    var response = await fetch('/api/corona/cases?region=Niedersachsen&type=State');
    var body = await response.json();
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
    germany.R_Wert = body.states[0].R_Wert;
    this.setState({Germany: germany});

    // var tmp: TestsVsPositive[] = [];
    // for (var index = 0; index < 10; ++index) {
    //   var newTmp = new TestsVsPositive();
    //   newTmp.yearAndKW = index.toString();
    //   newTmp.tests = index;
    //   tmp.push(newTmp);
    // }
    // console.log(tmp);
    // this.setState({TvP: tmp});

    response = await fetch('/api/corona/tests?number=10');
    body = await response.json();
    this.setState({TvP: this.parseAPIDataToTestsVsPositive(body)});

  }

  componentDidMount() {
    // this.updateData();
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

    var numberOfTestsOverTime: {x: string, y: number}[] = [];
    var numberOfPositiveOverTime: {x: string, y: number}[] = [];
    for (var tvp of this.state.TvP) {
      numberOfTestsOverTime.push({x: tvp.yearAndKW, y: tvp.tests});
      numberOfPositiveOverTime.push({x: tvp.yearAndKW, y: tvp.positive});
    }
    // var tvpData = [numberOfTestsOverTime, numberOfPositiveOverTime];
    var tvpData = [];
    tvpData[0] = numberOfTestsOverTime;
    tvpData[1] = numberOfPositiveOverTime;
    console.log(tvpData);


    return (
      <div style={{height: '100%'}}>
        <GridContainer height="20%">
          <GridItem xs={3}>
            <Card>
              <CardHeader>
                  <h4>{this.state.NDS.name}</h4>
              </CardHeader>
              <CardBody>
                  <ul>
                    <li>Fälle gesamt: {this.state.NDS.count} </li>
                    <li>Wocheninzidenz: {this.state.NDS.weekIncidence} </li>
                    <li>Fälle pro 100k: {this.state.NDS.casesPer100k} </li>
                    <li>Tote: {this.state.NDS.deaths} </li>
                  </ul>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={3}>
            <Card>
              <CardHeader>
                  <h4>{this.state.HH.name}</h4>
              </CardHeader>
              <CardBody>
                  <ul>
                    <li>Fälle gesamt: {this.state.HH.count} </li>
                    <li>Wocheninzidenz: {this.state.HH.weekIncidence} </li>
                    <li>Fälle pro 100k: {this.state.HH.casesPer100k} </li>
                    <li>Tote: {this.state.HH.deaths} </li>
                  </ul>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={3}>
            <Card>
              <CardHeader>
                  <h4>{this.state.Leer.name}</h4>
              </CardHeader>
              <CardBody>
                  <ul>
                    <li>Fälle gesamt: {this.state.Leer.count} </li>
                    <li>Wocheninzidenz: {this.state.Leer.weekIncidence} </li>
                    <li>Fälle pro 100k: {this.state.Leer.casesPer100k} </li>
                    <li>Tote: {this.state.Leer.deaths} </li>
                  </ul>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={3}>
            <Card>
              <CardHeader>
                  <h4>{this.state.Germany.name}</h4>
              </CardHeader>
              <CardBody>
                  <ul>
                    <li>Fälle gesamt: {this.state.Germany.count} </li>
                    <li>Wocheninzidenz: {this.state.Germany.R_Wert} </li>
                    <li>Fälle pro 100k: {this.state.Germany.casesPer100k} </li>
                    <li>Tote: {this.state.Germany.deaths} </li>
                  </ul>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <div style={{height: "10%"}}></div>
        <GridContainer height="50%">
          <GridItem xs={6}>
            <Graph data = {tvpData}/>
          </GridItem>
          <GridItem xs={6}>
            <Graph data = {tvpData}/>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default CoronaView;