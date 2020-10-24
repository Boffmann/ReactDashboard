import React from 'react';

interface WeatherProps {}

const Weather = (props: WeatherProps) => {

    const sunrise = 1;
    const sunset = 10;
    const sunPositionX = 0;
    const sunPositionY = 1;


    return(
    <div className='sunCycle'>
        <span className='sunrise'>
            <img src={require('../../images/sunrise.svg')} alt='Sunrise'/>
            <span className='sunriseTime'>{sunrise}</span>
        </span>
        <span className='sunset'>
            <img src={require('../../images/sunset.svg')} alt='Sunset'/>
            <span className='sunsetTime'>{sunset}</span>
        </span>
        <span className='sun'>
            <img
                src={require('../../images/sun.svg')}
                alt='Sun'
                style={{
                    left: `calc(${sunPositionX} * 50% - 23px)`,
                    bottom: `calc((${sunPositionY} * 100%) - 12px)`
                }}
            />
        </span>
    </div>
    );

};

export default Weather;