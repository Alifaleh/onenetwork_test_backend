import { Entity, PrimaryGeneratedColumn, Column, Generated} from 'typeorm';


@Entity()
export class Home{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    @Generated('increment')
    serial:number;

    @Column()
    temperature:String;

    @Column()
    humidity:String;

    @Column()
    preasure:String;

    @Column()
    gasResestance:String;

    @Column()
    batteryVoltage:String;

    @Column()
    date:Date;
}