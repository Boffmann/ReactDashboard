import React from 'react';
import GridContainer from '../Grid/GridContainer'
import GridItem from '../Grid/GridItem'
import Card from '../Card/Card'
import CardHeader from '../Card/CardHeader'
import CardBody from '../Card/CardBody'


function CoronaView() {
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
                This is 2
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

export default CoronaView;