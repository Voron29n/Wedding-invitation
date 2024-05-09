import React from 'react';
import Image from "next/image";
import fon from '../../../../Accets/images/CHEM9353_resized.jpeg';
import s from './schedule-header.module.scss'

export const ScheduleHeaderComponent = () => {
    return (
        <section className={s.section_container}>
            <div className={s.container}>
                <div className={s.section_wrapper}>
                    <div className={s.content_wrapper}>
                        <p className={s.section_first_text}>Суббота, 27 Июля | Щучин</p>
                        <h2 className={s.section_title}>Мы будем рады видеть вас!</h2>
                        <p className={s.section_second_text}>Пожалуйста, ответьте до пятницы</p>
                        <button className={s.description_button}>Опрос</button>
                    </div>
                    <Image src={fon} alt={'mare'} className={s.image}/>
                </div>
            </div>
        </section>
    );
};