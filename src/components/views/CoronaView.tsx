import React from 'react';
import GridContainer from '../Grid/GridContainer'
import GridItem from '../Grid/GridItem'
import Card from '../Card/Card'
import CardHeader from '../Card/CardHeader'
import CardBody from '../Card/CardBody'
import State from '../../server/state'


class CoronaView extends React.Component {
  state = {
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

  private updateData() {
    this.callApi("Niedersachsen")
      .then(res => {

        this.setState({NDS: this.parseDataToState(res)});

      })
      .catch(err => console.log(err));

    this.callApi("Hamburg")
      .then(res => {

        this.setState({HH: this.parseDataToState(res)});

      })
      .catch(err => console.log(err));
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
          <GridItem xs={4}>
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
          <GridItem xs={4}>
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
          <GridItem xs={4}>
            <Card>
              <CardHeader>
                This is 3
              </CardHeader>
              <CardBody>
                Body 3
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
    );
  }
}

export default CoronaView;