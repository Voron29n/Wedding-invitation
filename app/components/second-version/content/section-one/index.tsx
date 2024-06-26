import s from './section-one.module.scss';
import Image from "next/image";
import fon1 from "@accets/images/CHEM7843_resized.jpg";
import fon2 from "@accets/images/CHEM8873_resized.jpg";
import fon3 from "@accets/images/CHEM8032_resized.jpg";
import {Fade} from "react-awesome-reveal";

export const SectionOneComponent = () => (
    <section className={s.section_container}>
        <div className={s.container}>
            <div className={s.image_wrapper}>
                <Fade triggerOnce={true} cascade={true} damping={0.3} direction={'up'}>
                    <div className={s.s}>
                        <Image src={fon1} alt={'image one'} className={s.image_one}/>
                    </div>
                    <div className={s.s}>
                        <Image src={fon2} alt={'image two'} className={s.image_two}/>
                    </div>
                    <div className={s.s}>
                        <Image src={fon3} alt={'image three'} className={s.image_three}/>
                    </div>
                </Fade>
            </div>
        </div>
    </section>
);
