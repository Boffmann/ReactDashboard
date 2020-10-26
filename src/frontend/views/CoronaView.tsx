import React from 'react';
import GridContainer from '../components/Grid/GridContainer'
import GridItem from '../components/Grid/GridItem'
import Card from '../components/Card/Card'
import CardHeader from '../components/Card/CardHeader'
import CardBody from '../components/Card/CardBody'
import State from '../../common/state'


class CoronaView extends React.Component {
  state = {
    Leer: new State(),
    NDS: new State(),
    HH: new State()
  };

  private parseDataToState(data: any): State {
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

  private async updateData() {
    var response = await fetch('/api/corona/cases?region=Niedersachsen&type=State');
    var body = await response.json();
    this.setState({NDS: this.parseDataToState(body)});

    response = await fetch('/api/corona/cases?region=Hamburg&type=State');
    body = await response.json();
    this.setState({HH: this.parseDataToState(body)});

    response = await fetch('/api/corona/cases?region=Leer&type=Region');
    body = await response.json();
    this.setState({Leer: this.parseDataToState(body)});

  }

  componentDidMount() {
    this.updateData();
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
    return (
        <GridContainer>
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
                Deutchschalnd
              </CardHeader>
              <CardBody>
                TODO
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
    );
  }
}

export default CoronaView;