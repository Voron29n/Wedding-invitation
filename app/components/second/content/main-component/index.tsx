import React, {useEffect} from 'react';
import s from './main-section.module.scss';
import image from '../../../../Accets/second/main_image.jpg'
import Image from "next/image";

export const MainSectionComponent = () => {

    useEffect(() => {
        const movingElement = document.querySelector(`.${s.image}`) as HTMLElement;

        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.scrollY + window.innerHeight;
            const scrollPercentage = scrollPosition / scrollHeight;
            movingElement.style.right = (100 - (scrollPercentage * 100)) + '%';
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <section className={s.section_container}>
            <div className={s.container}>
                <h4 className={s.section_title}>Мы женимся</h4>
                <h2 className={s.section_text}>Алина & Павел</h2>
                <div className={s.section_wrapper}>
                    <div className={s.description_wrapper}>
                        <p className={s.section_description}>Суббота, 27 Июля, 2024<br/> Усадьба Долина Заречная, Щучин
                        </p>
                        <button className={s.description_button}>Расписание</button>
                    </div>
                    <div className={s.image_wrapper}>
                        <Image src={image} alt={'foto'} className={s.image}/>
                    </div>
                </div>
            </div>
        </section>
    );
};