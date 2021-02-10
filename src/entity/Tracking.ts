import {Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';


@Entity()
export class Tracking{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Generated('increment')
    serial: number;

    @Column("decimal")
    lon:number;

    @Column("decimal")
    lat:number;

    @Column("decimal")
    alt:number;

    @Column()
    date:Date;

    @Column("decimal")
    batteryVoltage:number;

    @Column("decimal")
    accelerometerX:number;

    @Column("decimal")
    accelerometerY:number;

    @Column("decimal")
    accelerometerZ:number;

    @Column("decimal")
    gyrometerX:number;

    @Column("decimal")
    gyrometerY:number;

    @Column("decimal")
    gyrometerZ:number;

}