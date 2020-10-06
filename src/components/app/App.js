import React from 'react';
import Navigation from '../navigation/Navigation'
import GridContainer from '../Grid/GridContainer'
import GridItem from '../Grid/GridItem'
import Card from '../Card/Card'
import CardHeader from '../Card/CardHeader'
import CardBody from '../Card/CardBody'
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <Navigation /> */}
      {/* <TotalCases /> */}
        <GridContainer>
          <GridItem>
            <Card>
              <CardHeader>
                <h1>This is a Card</h1>
              </CardHeader>
              <CardBody>
                <h3>This is body</h3>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
    </div>
  );
}

export default App;
