import React from 'react';
import GridContainer from '../components/Grid/GridContainer'
import GridItem from '../components/Grid/GridItem'
import Card from '../components/Card/Card'
import CardHeader from '../components/Card/CardHeader'
import CardBody from '../components/Card/CardBody'
import Graph from '../components/Graph/Graph'
import State from '../../common/state'
import GraphLine from '../components/Graph/GraphLine'

class TestsVsPositive {
  public yearAndKW: string[];
  public tests: number[];
  public positive: number[];

  constructor() {
    this.yearAndKW = [];
    this.tests = [];
    this.positive = [];
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
    TvP: new TestsVsPositive()
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

  private parseAPIDataToTestsVsPositive(data: any): TestsVsPositive {
    var TvP = new TestsVsPositive();

    for (var index = 0; index < data.tests.length; ++index) {
      const test = data.tests[index];
      console.log(`Test: ${test}`);
      // newTvP.yearAndKW = test.year.toString() + "/" + test.kw.toString();
      TvP.yearAndKW.push(test.kw);
      TvP.tests.push(test.number);
      TvP.positive.push(test.positive);
    }

    return TvP;
  }

  private async updateData() {
    // var response = await fetch('/api/corona/cases?region=Niedersachsen&type=State');
    // var body = await response.json();
    // this.setState({NDS: this.parseAPIDataToState(body)});


    // response = await fetch('/api/corona/cases?region=Hamburg&type=State');
    // body = await response.json();
    // this.setState({HH: this.parseAPIDataToState(body)});

    // response = await fetch('/api/corona/cases?region=Leer&type=Region');
    // body = await response.json();
    // this.setState({Leer: this.parseAPIDataToState(body)});

    // response = await fetch('/api/corona/cases?region=germany&type=Country');
    // body = await response.json();
    // var germany = this.parseAPIDataToState(body);
    // germany.R_Wert = body.states[0].R_Wert;
    // this.setState({Germany: germany});

    // var tmp: TestsVsPositive[] = [];
    // for (var index = 0; index < 10; ++index) {
    //   var newTmp = new TestsVsPositive();
    //   newTmp.yearAndKW = index.toString();
    //   newTmp.tests = index;
    //   tmp.push(newTmp);
    // }
    // console.log(tmp);
    // this.setState({TvP: tmp});

    // var response = await fetch('/api/corona/tests?number=10');
    // var body = await response.json();
    // this.setState({TvP: this.parseAPIDataToTestsVsPositive(body)});

  }

  componentDidMount() {
    // this.updateData();

    var tvp = new TestsVsPositive();
    tvp.yearAndKW = ["1", "2", "3", "4", "5", "6", "7"];
    tvp.tests = [10000, 250000, 300000, 40000, 5000000, 560000, 910000];
    tvp.positive = [1, 2, 3, 4, 5, 6, 7];
    
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
        <div style={{height: "5%"}}></div>
        <GridContainer height="60%">
          <GridItem xs={6}>
            <Graph lines = {[testLine]}/>
          </GridItem>
          <GridItem xs={6}>
            <Graph lines = {[positiveLine]}/>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default CoronaView;