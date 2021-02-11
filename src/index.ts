import "reflect-metadata";
import {createConnection} from "typeorm";
import bodyParser = require('body-parser');

import {addLocation, addHomeReading, getLastLocation, getHomeList, getHomeData} from './models/database';
import { Socket } from "dgram";

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


let newLocationRecieved:Boolean = true;
let newHomeReadingRecieved:Boolean = true;

let socketId = '';

createConnection().then(async connection => {


    app.get('/', (req,res)=>{
        res.send('Welcome to One network testing server')
    })






    app.post('/settracking', async (req, res) => {
        if(JSON.parse(req.body.objectJSON)['gpsLocation']){
            console.log('recieved location')
            const location = {lon:0.0, lat:0.0, alt:0.0}
            const gyrometer = {x:0.0, y:0.0, z:0.0}
            const accelerometer = {x:0.0, y:0.0, z:0.0}
            let trackingBattery = 0.0;
            let date :Date;
            location.lon = JSON.parse(req.body.objectJSON)['gpsLocation']['1']['longitude'];
            location.lat = JSON.parse(req.body.objectJSON)['gpsLocation']['1']['latitude'];
            location.alt = JSON.parse(req.body.objectJSON)['gpsLocation']['1']['altitude'];
            gyrometer.x = JSON.parse(req.body.objectJSON)['gyrometer']['5'].x;
            gyrometer.y = JSON.parse(req.body.objectJSON)['gyrometer']['5'].y;
            gyrometer.z = JSON.parse(req.body.objectJSON)['gyrometer']['5'].z;
            accelerometer.x = JSON.parse(req.body.objectJSON)['accelerometer']['3'].x;
            accelerometer.y = JSON.parse(req.body.objectJSON)['accelerometer']['3'].y;
            accelerometer.z = JSON.parse(req.body.objectJSON)['accelerometer']['3'].z;
            trackingBattery = JSON.parse(req.body.objectJSON)['analogInput']['8'];
            date = new Date(Date.now());
            await addLocation(location,gyrometer,accelerometer,trackingBattery, date);
            newLocationRecieved = true;

            let lastLocation = await getLastLocation();
            io.to(socketId).emit('setLocation', lastLocation);
            
        };

        res.sendStatus(200);
    });








    
    
    app.post('/sethome', async (req, res) => {
        let temperature = "0 C";
        let humidity = "0 %RH";
        let preassure = "0 hPa";
        let gasResestance = "0 kohms";
        let homeBattery = "0 V";
        let date:Date;

        if(req.body.objectJSON){
            console.log('recieved home readings');
            temperature = (JSON.parse(req.body.objectJSON)["temperatureSensor"]["2"]).toString()+" C";
            humidity = (JSON.parse(req.body.objectJSON)["humiditySensor"]["7"]).toString()+" %RH";
            preassure = (JSON.parse(req.body.objectJSON)["barometer"]["6"]).toString()+" hPa";
            gasResestance = (JSON.parse(req.body.objectJSON)["analogInput"]["4"]).toString()+" kohms";
            homeBattery = (JSON.parse(req.body.objectJSON)["analogInput"]["8"]).toString()+" V";
            date = new Date(Date.now());
            await addHomeReading(temperature, humidity, preassure, gasResestance, homeBattery, date);
            newHomeReadingRecieved = true;
            setTimeout(async ()=>{
                let homeList = await getHomeList();
                homeList[0].date = Math.floor(+homeList[0].date / 1000);
                io.to(socketId).emit('addNewReading',homeList[0])
            }, 500)
        }

    })


    io.on('connection', (socket) => {
        socket.emit('connect', 'connect');
        console.log('a user connected');
        socketId = socket.id;
        socket.on('getLocation', async (data)=>{
            let lastLocation = await getLastLocation();
            lastLocation.date = Math.floor(+lastLocation.date / 1000);
            socket.emit('setLocation', lastLocation);
        })

        socket.on('getHomeList', async(data) => {
            let homeList = await getHomeList();
            homeList.forEach((reading,index)=>{
                homeList[index].date = Math.floor(+homeList[index].date / 1000);
            })
            socket.emit('setHomeList', homeList);
        })

        socket.on('getHomeData', async data => {
            let homeData = await getHomeData(data);
            homeData.date = Math.floor(+homeData.date / 1000);
            socket.emit('setHomeData', homeData);
        })

    });



    http.listen(port, ()=>{
        console.log(`Server is up at port ${port}`)
    })



}).catch(error => console.log(error));
