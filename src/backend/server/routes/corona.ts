import State from '../../../common/state'
import axios from 'axios';
import { Response, Request, query } from 'express'
import CoronaDB from '../../database/CoronaDB'
import { getTimestampForDate, germanDateFormatToTimestamp } from '../../../common/TimeFormater'
const url = require('url')
var express = require('express');
var router = express.Router();

interface APIDataRegion {
    features: FeatureRegion[]
}

interface APIDataState {
    features: FeatureState[]
}

interface FeatureRegion {
    attributes: {
        last_update: string,
        county: string,
        cases: number,
        deaths: number
        cases_per_100k: number,
        cases7_per_100k: number
    }
}

interface FeatureState {
    attributes: {
        Fallzahl: number,
        Aktualisierung: number,
        faelle_100000_EW: number,
        cases7_bl_per_100k: number,
        Death: number,
        LAN_ew_GEN: string
    }
}

async function getCasesPerRegion(region: string): Promise<State> {

    var promise = new Promise<State>(async (resolve, reject) => {
        let res_state: State = new State();
        const url = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/ArcGIS/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=county+LIKE+%27LK+Leer%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=county%2C+cases%2C+deaths%2C+cases_per_100k%2C+last_update%2C+cases7_per_100k&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";
        //(Landkreis = 'LK Leer' OR Landkreis = 'SK Flensburg') AND Meldedatum >= '20201025 00:00:00.000'
        const response = await axios.get(url);
        const apiData: APIDataRegion = response.data;
        console.log(url);

        if (apiData.features.length !== 0) {
            const feature = apiData.features[0];
            res_state.timestamp = germanDateFormatToTimestamp(feature.attributes.last_update);
            res_state.name = feature.attributes.county;
            res_state.count = feature.attributes.cases;
            res_state.deaths = feature.attributes.deaths;
            res_state.weekIncidence = feature.attributes.cases7_per_100k;
            res_state.casesPer100k = feature.attributes.cases_per_100k;
        }

        resolve(res_state);
    });

    return promise;
}

async function getCasesPerState(states: string[]): Promise<State[]> {

    var promise = new Promise<State[]>(async (resolve, reject) => {
        let res_states: State[] = []
        const response = await axios.get("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_GEN,LAN_ew_EWZ,Fallzahl,Aktualisierung,faelle_100000_EW,Death,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json");
        const apiData: APIDataState = response.data;

        for (const feature of apiData.features) {
            const federation = feature.attributes.LAN_ew_GEN;
            if (states.includes(federation)) {
                let state = new State();
                state.timestamp = feature.attributes.Aktualisierung.toString();
                state.name = feature.attributes.LAN_ew_GEN;
                state.count = feature.attributes.Fallzahl;
                state.deaths = feature.attributes.Death;
                state.weekIncidence = feature.attributes.cases7_bl_per_100k;
                state.casesPer100k = feature.attributes.faelle_100000_EW;

                res_states.push(state);
            }
        }
        resolve(res_states);
    });


    return promise;
}

router.get('/cases', async function(req: Request, res: Response) {
    const queryObject = url.parse(req.url, true).query;
    const regions_string: string = queryObject.region;
    const queryType: string = queryObject.type;
    const regions: string[] = regions_string.split(" ");
    var states: State[] = [];

    if (regions !== undefined && regions.length !== 0) {
        switch (queryType) {
            case "Region":
                states.push(await(getCasesPerRegion(regions[0])));
                break;
            case "State":
                states = await getCasesPerState(regions);
                break;
            default:
                res.json({error: "Selected Type not supported. Use either Region, State or Country"});
        }
    }

    states.forEach(state => CoronaDB.insertState(state))

    res.json({states: states })
})

/**
 * Returns the last `number` of items in the dataase for a specific region.
 * The result is ordered from older to newer results.
 * If less entries than requested are found, the missing are filled up with zero values
 */
router.get('/cases/previous', async function(req: Request, res: Response) {
    const queryObject = url.parse(req.url, true).query;
    const region: string = queryObject.region;
    const requested_num_elems: string = queryObject.number;
    var result: string[] = []

    const states = await CoronaDB.getRecentRowsByState(region, requested_num_elems);

    const missingNumberOfElems = parseInt(requested_num_elems) - states.length;

    for (var i = 0; i < missingNumberOfElems; ++i) {
        const item: any = {
            timestamp: getTimestampForDate("01/01/2020"),
            state: region,
            cases: '0',
            weekIncidence: '0',
            casesPer100k: '0',
            death: '0'
        }

        result.push(item);
    }


    states.reverse()
        .forEach((item) => {
            result.push(item)
    });
    
    res.json({result: result});
})

module.exports = router