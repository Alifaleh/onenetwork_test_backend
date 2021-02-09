import {Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';


@Entity()
export class Traking{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Generated('increment')
    serial: number;

    @Column()
    lan:number;

    @Column()
    lat:number;

    @Column()
    alt:number;

    @Column()
    date:Date;

    @Column()
    batteryVoltage:number;

    @Column()
    accelerometerX:number;

    @Column()
    accelerometerY:number;

    @Column()
    accelerometerZ:number;

    @Column()
    gyrometerX:number;

    @Column()
    gyrometerY:number;

    @Column()
    gyrometerZ:number;

}