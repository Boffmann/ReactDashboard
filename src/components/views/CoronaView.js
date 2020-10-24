import React from 'react';
import GridContainer from '../Grid/GridContainer'
import GridItem from '../Grid/GridItem'
import Card from '../Card/Card'
import CardHeader from '../Card/CardHeader'
import CardBody from '../Card/CardBody'


class CoronaView extends React.Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };

//   componentDidMount() {
//     this.callApi()
//       .then(res => this.setState({ response: res.express }))
//       .catch(err => console.log(err));
//   }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  handleSubmit = async e => {
      e.preventDefault();
      const response = await fetch('/api/world', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ post: this.state.post }),
      });
      const body = await response.text();

      this.setState({ responseToPost: body })
  }
  
  render() {
    return (
        <GridContainer>
          <GridItem xs={4}>
            <Card>
              <CardHeader>
                  Landkreis Leer
              </CardHeader>
              <CardBody>
                  <ul>
                      <li>Fälle gesamt</li>
                  </ul>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={4}>
            <Card>
              <CardHeader>
                  Card 2
              </CardHeader>
              <CardBody>
                Body 2
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