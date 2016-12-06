import { Router, Request, Response, NextFunction } from 'express';
import Temperature from '../temperature';
import Humidity from '../humidity';

//const temperatures: Array<Temperature> = new Array<Temperature>();
let humidities: Humidity[] = [];
let temperatures : Temperature[] = [];

export class WeatherRouter {
    router: Router;

    x: number = 0.0;
    y: number = 0.0;


    constructor() {
        this.router = Router();
        this.createNewTemperature();
        this.createNewHumidity();
        this.init();
        setInterval(() => { this.createNewTemperature() }, 10000);
        setInterval(() => { this.createNewHumidity() }, 10000);
    }

    init() {
        this.router.get('/temperature', this.getNewTemperature);
        this.router.get('/temperatures/:count', this.getLastTemperatures);
        this.router.get('/humidity', this.getNewHumidity);
        this.router.get('/humidities/:count', this.getLastHumidities);
    }

    public getNewHumidity(req: Request, res: Response, next: NextFunction) {
        let latest = humidities[humidities.length - 1];
        res.status(200).send(latest);
    }

    public getNewTemperature(req: Request, res: Response, next: NextFunction) {
        let latest = temperatures[temperatures.length - 1];
        res.status(200).send(latest);
    }

    public getLastHumidities(req: Request, res: Response, next: NextFunction) {
        let count = parseInt(req.params.count);

        if(humidities.length >=count) {
            let values =  humidities.slice(humidities.length-1-count, humidities.length-1);
            res.status(200).send({status: res.status, values});
        } else {
            let values = humidities;
            res.status(200).send({status: res.status, values});

        }
    }

    public getLastTemperatures(req: Request, res: Response, next: NextFunction) {
        let count = parseInt(req.params.count);

        if(temperatures.length >=count) {
            let values =  temperatures.slice(temperatures.length-1-count, temperatures.length-1);
            res.status(200).send({status: res.status, values});
        } else {
            let values = temperatures;
            res.status(200).send({status: res.status, values});
        }
    }

    createNewTemperature(): void {
        let value = this.calculateTemperature(this.x);
        let temp = new Temperature(value, new Date(Date.now()));
        temperatures = temperatures.slice(-50).concat([temp]);
        this.x += 0.1 % 26;
    }

    createNewHumidity(): void {
        let value = this.calculateHumidity(this.y);
        let humidity = new Humidity(value, new Date(Date.now()));
        
        humidities = humidities.slice(-50).concat([humidity]);
        this.y += 0.1 % 26;
    }

    private calculateHumidity(xValue: number): number {
        return (6 * Math.sin(xValue / 4.0) + 4.0 * Math.cos(xValue / 3.0 + Math.PI / 4.0)) + 50;
    }

    private calculateTemperature(yValue: number): number {
        return (5 * Math.sin(yValue / 4.0) + 4.0 * Math.cos(yValue / 2.0 + Math.PI / 3.0)) + 5;
    }
}

const weatherRoutes = new WeatherRouter();
weatherRoutes.init();

export default weatherRoutes.router;
