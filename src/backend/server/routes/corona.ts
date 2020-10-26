import State from '../../../common/state'
import axios from 'axios';
import { Response, Request } from 'express'
import CoronaDB from '../../database/CoronaDB'
const url = require('url')
var express = require('express');
var router = express.Router();

interface APIData {
    features: Feature[]
}

interface Feature {
    attributes: {
        Fallzahl: number,
        Aktualisierung: number,
        faelle_100000_EW: number,
        cases7_bl_per_100k: number,
        Death: number,
        LAN_ew_GEN: string
    }
}

router.get('/cases', async function(req: Request, res: Response) {

    let states: State[] = []

    const response = await axios.get("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_GEN,LAN_ew_EWZ,Fallzahl,Aktualisierung,faelle_100000_EW,Death,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json");
    const apiData: APIData = response.data;

    const queryObject = url.parse(req.url, true).query;
    const regions_string: String = queryObject.region
    const regions: String[] = regions_string.split(" ");

    for (const feature of apiData.features) {
        const federation = feature.attributes.LAN_ew_GEN;
        if (regions.includes(federation)) {
            let state = new State();
            state.name = feature.attributes.LAN_ew_GEN;
            state.count = feature.attributes.Fallzahl;
            state.deaths = feature.attributes.Death;
            state.weekIncidence = feature.attributes.cases7_bl_per_100k;
            state.casesPer100k = feature.attributes.faelle_100000_EW;

            states.push(state);
        }
    }

    const timestamp = apiData.features[0].attributes.Aktualisierung.toString();
    states.forEach(state => CoronaDB.insertRowByTimeAndState(timestamp, state))

    res.json({lastUpdate: apiData.features[0].attributes.Aktualisierung, states: states })
})

module.exports = router