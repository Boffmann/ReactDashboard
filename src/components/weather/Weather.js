import React from 'react';
import SunCycle from './SunCycle'

export default function Weather() {

    const temperatureMin = 9;
    const temperatureMax = 18;
    const temperatureNow = 11;

    return (

        <div className='todayWeather'>
            <SunCycle />
             <div className='tToday'>{temperatureMin} / {temperatureMax}&deg;C</div>
            <div className='tNow'>{temperatureNow}&deg;C
            </div>
        </div>

    )

}