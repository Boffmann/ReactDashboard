import axios from 'axios';
import fs from 'fs';
import { Response, Request } from 'express'
import cheerio from 'cheerio'
import xlsxFile from 'read-excel-file/node'
import State from '../../../common/state'
import Test from '../../../common/test'
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


const xlsxFilePath: string = "/home/hendrik/Documents/tests.xlsx";
const inhabitantsGermany = 81495937;

async function getCasesPerRegion(region: string): Promise<State> {

    var promise = new Promise<State>(async (resolve, reject) => {
        let res_state: State = new State();
        const url = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/ArcGIS/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=county+LIKE+%27LK+Leer%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=county%2C+cases%2C+deaths%2C+cases_per_100k%2C+last_update%2C+cases7_per_100k&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";
        //(Landkreis = 'LK Leer' OR Landkreis = 'SK Flensburg') AND Meldedatum >= '20201025 00:00:00.000'
        const response = await axios.get(url);
        const apiData: APIDataRegion = response.data;

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
                state.timestamp = feature.attributes.Aktualisierung;
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

async function getRValueForGermany(): Promise<number> {

    var promise = new Promise<number>(async (resolve, reject) => {

        const response = await axios.get("https://www.corona-in-zahlen.de/r-wert/");
        const $ = cheerio.load(response.data);
        const RValueElement = $(".card-title").eq(1);
        const RValue = RValueElement.text().replace(/,/,'.');

        resolve(parseFloat(RValue));
    });

    return promise;
}

async function getCasesForGermany(): Promise<State> {

    var promise = new Promise<State>(async (resolve, reject) => {
        var res_state = new State();
        const response = await axios.get("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_GEN,LAN_ew_EWZ,Fallzahl,Aktualisierung,faelle_100000_EW,Death,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json");
        const apiData: APIDataState = response.data;

        if (apiData.features && apiData.features.length !== 0) {
            res_state.timestamp = apiData.features[0].attributes.Aktualisierung;
            res_state.name = "Deutschland";

            for (const feature of apiData.features) {
                res_state.count += feature.attributes.Fallzahl;
                res_state.deaths += feature.attributes.Death;
            }

            const RValue = await getRValueForGermany();
            res_state.RValue = RValue;

            res_state.casesPer100k = (res_state.count / inhabitantsGermany) * 100000;
        }

        resolve(res_state);
    });

    return promise;
}

function parseRKITestFile(): Promise<Test[]> {

    var year: number = 1970;
    var tests: Test[] = [];

    var promise = new Promise<Test[]>((resolve, reject) => {
        xlsxFile(xlsxFilePath, {sheet: 'Testzahlen'})
            .then ((rows: string[][]) => {
                console.log("Parse XLSX");

                const yearMatch = rows[0][0].match(/(\d){4}/);
                if (yearMatch) {
                    year = parseInt(yearMatch[0]);
                }
                
                for (var row = 2; row < rows.length - 1; ++row) {
                    const test: Test = {
                        year: year,
                        kw: parseInt(rows[row][0]),
                        number: parseInt(rows[row][1]),
                        positive: parseInt(rows[row][2]),
                        ratio: parseFloat(rows[row][3]),
                        lab_num: parseInt(rows[row][4]),
                    };
                    tests.push(test);
                }

                resolve(tests);
            }) .catch((err: Error) => {
                reject(err);
            })

    });

    return promise;
}

function getNewRKITestFile(): Promise<void> {

    var promise = new Promise<void>((resolve, reject) => {
        axios({
            url: "https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Testzahlen-gesamt.xlsx?__blob=publicationFile",
            method: 'GET',
            responseType: 'stream'
        }).then((response) => {
            response.data.pipe(fs.createWriteStream(xlsxFilePath));
            resolve();
        })
        .catch((error: Error) => {
            reject(error);
        }) 
    })


    return promise;
}

router.get('/tests', async function(req: Request, res: Response) {
    const queryObject = url.parse(req.url, true).query;
    const number: number = queryObject.number;

    getNewRKITestFile()
        .then (() => {
            parseRKITestFile()
                .then((tests) => {
                    const tests_length = tests.length;
                    console.log(`Length: ${tests_length}`);
                    if (tests_length === 0) {
                        res.json({success: true, tests: []});
                        return;
                    }
                    var result_tests: Test[] = [];
                    if (tests.length >= number) {
                        for (var index = tests_length - number; index < tests_length; ++index) {
                            result_tests.push(tests[index]);
                        }
                    } else {
                        const missing_elements = number - tests_length;
                        const first_kw = tests[0].kw;
                        for (var index = 0; index < missing_elements; ++index) {
                            var newTest = new Test();
                            newTest.year = tests[0].year;
                            newTest.kw = first_kw - missing_elements + index;
                            newTest.number = 0;
                            newTest.positive = 0;
                            newTest.ratio = 0;
                            newTest.lab_num = 0;
                            result_tests.push(newTest);
                        }
                        tests.forEach(test => result_tests.push(test));
                    }
                    // result_tests.forEach(test => CoronaDB.insertTest(test));
                    res.json({success: true, tests: result_tests});
                }) .catch ((err: Error) => {
                    console.log(err.message);
                    res.json({success: false, tests: []});
                })
        }) .catch((err: Error) => {
            console.log(err);
            res.json({success: false, tests: []});
        }) 
})

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
            case "Country":
                states = [await getCasesForGermany()];
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
    const requested_num_elems: number = queryObject.number;
    var result: string[] = []

    const states = await CoronaDB.getRecentStatesByName(region, requested_num_elems);

    const missingNumberOfElems = requested_num_elems - states.length;

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
    
    res.json({states: result});
})

router.get('/test', async function(req: Request, res: Response) {
    const r = await getRValueForGermany();
    res.json({success: true, R: r});
})

module.exports = router
