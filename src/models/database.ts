import {getConnection, createQueryBuilder, getRepository} from 'typeorm';
import {Tracking} from '../entity/Tracking';
import {Home} from '../entity/Home';

export const addLocation = async (location, gyrometer, accelerometer, battery, date)=>{
    const trackingRepo = getRepository(Tracking)
    const newLocation = trackingRepo.create({
        lon:location.lon,
        lat:location.lat,
        alt:location.alt,
        date:date,
        batteryVoltage:battery,
        gyrometerX:gyrometer.x,
        gyrometerY:gyrometer.y,
        gyrometerZ:gyrometer.z,
        accelerometerX:accelerometer.x,
        accelerometerY:accelerometer.y,
        accelerometerZ:accelerometer.z,
    })

    await trackingRepo.save(newLocation)
}


export const addHomeReading = async (temperature, humidity, preassure, gasResestance, homeBattery, date) => {
    const homeRepo = getRepository(Home);
    const newData = homeRepo.create({
        temperature:temperature,
        humidity: humidity,
        preasure: preassure,
        gasResestance: gasResestance,
        batteryVoltage: homeBattery,
        date:date,
    });

    homeRepo.save(newData);
}


export const getLastLocation = async () => {
    const lastLocation = await getConnection()
    .createQueryBuilder()
    .from(Tracking, 'tracking')
    .where('tracking.serial = (select max(serial) from tracking)')
    .getRawOne();
    return lastLocation;
}


export const getHomeList = async () => {
    const homelist = await getConnection()
    .createQueryBuilder()
    .select(['id', 'date'])
    .from(Home, 'home')
    .orderBy('date', 'DESC')
    .getRawMany();
    return homelist;
}


export const getHomeData = async (id) => {
    const homeData = await getConnection()
    .createQueryBuilder()
    .select()
    .from(Home, 'home')
    .where(`id = '${id}'`)
    .getRawOne()

    console.log(homeData);
    return homeData;
}