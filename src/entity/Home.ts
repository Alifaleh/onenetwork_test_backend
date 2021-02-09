import { Entity, PrimaryGeneratedColumn, Column, Generated} from 'typeorm';


@Entity()
export class Home{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Generated()
    serial:number;

    @Column()
    temperature:number;

    @Column()
    humidity:number;

    @Column()
    preasure:number;

    @Column()
    gasResestance:number;

    @Column()
    batteryVoltage:number;
}