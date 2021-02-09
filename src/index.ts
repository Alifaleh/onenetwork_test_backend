import "reflect-metadata";
import {createConnection} from "typeorm";
import bodyParser = require('body-parser');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


createConnection().then(async connection => {


    app.get('/', (req,res)=>{
        res.send('Welcome to One network testing server')
    })




    const location = {lon:0.0, lat:0.0, alt:0.0}
    const gyrometer = {x:0.0, y:0.0, z:0.0}
    const accelerometer = {x:0.0, y:0.0, z:0.0}
    let trackingBattery = 0.0;
    let trackingTime = "no time";

    app.post('/settracking', (req, res) => {
        console.log(req.body)
        if(JSON.parse(req.body.objectJSON)['gpsLocation']){
            location.lon = JSON.parse(req.body.objectJSON)['gpsLocation']['1']['longitude'];
            location.lat = JSON.parse(req.body.objectJSON)['gpsLocation']['1']['latitude'];
            location.alt = JSON.parse(req.body.objectJSON)['gpsLocation']['1']['altitude'];
        };
        gyrometer.x = JSON.parse(req.body.objectJSON)['gyrometer']['5'].x;
        gyrometer.y = JSON.parse(req.body.objectJSON)['gyrometer']['5'].y;
        gyrometer.z = JSON.parse(req.body.objectJSON)['gyrometer']['5'].z;
        accelerometer.x = JSON.parse(req.body.objectJSON)['accelerometer']['3'].x;
        accelerometer.y = JSON.parse(req.body.objectJSON)['accelerometer']['3'].y;
        accelerometer.z = JSON.parse(req.body.objectJSON)['accelerometer']['3'].z;
        trackingBattery = JSON.parse(req.body.objectJSON)['analogInput']['8'];
        trackingTime = new Date(Date.now()).getHours().toString()+" : "+new Date(Date.now()).getMinutes().toString();
        if(JSON.parse(req.body.objectJSON)['gpsLocation'])
            console.log(gyrometer,accelerometer,location)
        else
            console.log(gyrometer, accelerometer)
        console.log('\n\n\n\n')
        res.sendStatus(200);
    });








    let temperature = "0 C";
    let humidity = "0 %RH";
    let preassure = "0 hPa";
    let gasResestance = "0 kohms";
    let homeBattery = "0 V";
    let homeTime = "no time";


    app.post('/sethome', (req, res) => {

        if(req.body.objectJSON){
            temperature = (JSON.parse(req.body.objectJSON)["temperatureSensor"]["2"]).toString()+" C";
            humidity = (JSON.parse(req.body.objectJSON)["humiditySensor"]["7"]).toString()+" %RH";
            preassure = (JSON.parse(req.body.objectJSON)["barometer"]["6"]).toString()+" hPa";
            gasResestance = (JSON.parse(req.body.objectJSON)["analogInput"]["4"]).toString()+" kohms";
            homeBattery = (JSON.parse(req.body.objectJSON)["analogInput"]["8"]).toString()+" V";
            homeTime = new Date(Date.now()).toString();
        }

    })




    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('getlocation',()=>{
            console.log('requested location');
        })
    });

    http.listen(port, ()=>{
        console.log(`Server is up at port ${port}`)
    })



}).catch(error => console.log(error));
