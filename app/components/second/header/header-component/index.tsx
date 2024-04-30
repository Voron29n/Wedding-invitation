import React from 'react';
import {MENU_HEADER_LIST} from "@/app/constant/constant";
import s from './header-component.module.scss'

export const HeaderComponent = () => {
    return (
        <section className={s.header_container}>
            <div className={s.container}>
                <div className={s.header_logo}>А&П</div>
                <div className={s.header_menu_wrapper}>
                    {MENU_HEADER_LIST.map((item) => {
                        return (
                            <a key={item.href} className={s.menu_link}>
                            <span>
                                {item.title}
                            </span>
                            </a>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};