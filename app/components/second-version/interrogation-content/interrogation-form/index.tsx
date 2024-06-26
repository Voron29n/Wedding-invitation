import {useEffect, useState} from 'react';
import {Button, Form, FormProps} from "antd";
import Radio from 'antd/lib/radio';
import {SelectProps} from "antd/lib";
import {alcoholicDrinks} from "@/app/constant/constant";
import s from "./interrogation-form.module.scss";
import './interrogation-form.css'
import {surveyResponse} from "@/app/service/api/invitePreload.api";
import {presentInitialValue} from "./utils";
import {PresentGuestComponent, PresentOnSecondDayComponent, RadioInput, SelectInputItem} from "@components";
import {InterrogationFormProps} from '../types';

export const InterrogationForm = ({
                                      inviteInfo,
                                      inviteId,
                                      onRespForm,
                                      singleGuest
                                  }: InterrogationFormProps) => {
    const [firstDayList, setFirstDayList] = useState('');
    const [secondDayList, setSecondDayList] = useState('');
    const [show, setShow] = useState<boolean>(!!inviteInfo.surveyResponses && !!inviteInfo.surveyResponses?.presentGuests.length);
    const [disabled, setDisabled] = useState(true);
    const [surveyCompleted, setSurveyCompleted] = useState(!inviteInfo.surveyResponses);
    const [form] = Form.useForm();

    const guestGroup = inviteInfo.guests;

    const options: SelectProps['options'] = guestGroup?.map((item: any) => {
        return {
            label: item.firstName,
            value: item.id,
        }
    });

    const onShowAllQuestion = (e: any) => {
        if (e.target.value === 'no') {
            setShow(false)
            setDisabled(false)
        } else {
            setShow(true)
        }
    };

    const onFirstDayList = (e: any) => {
        setFirstDayList(e.target.value);
        onShowAllQuestion(e);
    };

    const onSecondDayListChange = (e: any) => {
        setSecondDayList(e.target.value);
    };

    const onFinish: FormProps['onFinish'] = async (value: any) => {

        if (value.presentGuests === 'no') {
            const answer = {
                inviteId: inviteId,
                presentGuests: [],
            }
            const surveyResp = await surveyResponse(answer);
            onRespForm(!surveyResp.error, false);

        } else {
            const allGuests = options?.map(({value}) => value);
            const answer = {
                inviteId: inviteId,
                presentGuests: ['yes', 'noAlone'].includes(value.presentGuests)
                    ? allGuests
                    : Array.isArray(value.presentGuestsSelect)
                        ? value.presentGuestsSelect
                        : [value.presentGuestsSelect],
                noAlonePresent: 'noAlone' === value.presentOnSecondDay,
                startPlace: value.startPlace,
                isPrivateTransport: value.isPrivateTransport,
                presentOnSecondDay: ['yes', 'noAlone'].includes(value.presentOnSecondDay)
                    ? allGuests
                    : value.presentOnSecondDay === 'no' ? []
                        : Array.isArray(value.presentOnSecondDaySelect)
                            ? value.presentOnSecondDaySelect
                            : [value.presentOnSecondDaySelect],
                noAloneOnSecondDay: 'noAlone' === value.presentOnSecondDay,
                needSleepPlace: value.needSleepPlace,
                likeDrinks: Array.isArray(value.likeDrinks) ? value.likeDrinks : [value.likeDrinks]
            }
            const surveyResp = await surveyResponse(answer);
            onRespForm(!surveyResp.error, true);
        }

        setSurveyCompleted(false);
    };

    const onFormValueChange = () => {
        if (form.getFieldsValue().presentGuests === 'no') {
            setDisabled(false)
        } else {
            setDisabled(checkFields(form.getFieldsValue()));
        }
    };

    const checkFields = (obj: any) => Object.values(obj).some(value => value === undefined || value === '');

    const onChangeCompletedSurvey = () => {
        setSurveyCompleted(true)
        setDisabled(false)
    };

    useEffect(() => {
        setFirstDayList(presentInitialValue(inviteInfo, 'presentGuests', 'noAlonePresent'))
        setSecondDayList(presentInitialValue(inviteInfo, 'presentOnSecondDay', 'noAloneOnSecondDay'))
    }, []);

    const presentGuestInit = presentInitialValue(inviteInfo, 'presentGuests', 'noAlonePresent');
    const presentOnSecondDayInit = presentInitialValue(inviteInfo, 'presentOnSecondDay', 'noAloneOnSecondDay');

    return (
        <section className={s.section_container} id={'survey'}>
            <div className={s.container}>
                {surveyCompleted
                    ? <h2 className={s.section_title}>Ответьте на несколько вопросов</h2>
                    : <div className={s.completed_content_wrapper}>
                        <h2 className={s.section_title}>Вы уже ответили на вопросы, но можете
                            изменить свой ответ</h2>
                        <Button className={s.description_button} onClick={onChangeCompletedSurvey}>Изменить
                            ответ</Button>
                    </div>}
                {surveyCompleted &&
                    <Form form={form} className={s.section_form} onFinish={onFinish} onChange={onFormValueChange}>
                        <PresentGuestComponent singleGuest={singleGuest}
                                               presentGuestInit={presentGuestInit}
                                               show={show}
                                               options={options}
                                               onShowAllQuestion={onShowAllQuestion}
                                               inviteInfo={inviteInfo}
                                               onFirstDayList={onFirstDayList}
                                               onFormValueChange={onFormValueChange}
                                               needOneMorePlace={inviteInfo.invitation?.needOneMorePlace}
                                               firstDayList={firstDayList}/>
                        {show &&
                            <>
                                <h3 className={s.item_title}>Будете ли вы присутствовать на венчании или же сразу
                                    отправитесь на банкет?</h3>
                                <RadioInput initialValue={inviteInfo?.surveyResponses?.startPlace}
                                            requiredValue={show}
                                            requiredMessage={'Пожалуйста, выберете вариант'}
                                            itemName={'startPlace'}>
                                    <Radio.Button value="church">{singleGuest ? 'Буду' : 'Будем'} присутствовать на
                                        венчании</Radio.Button>
                                    <Radio.Button value="manor">Сразу {singleGuest ? 'отправлюсь' : 'отправимся'} на
                                        банкет</Radio.Button>
                                </RadioInput>
                                {inviteInfo?.invitation?.checkTransport &&
                                    <>
                                        <h3 className={s.item_title}>Как Вы планируете добираться?</h3>
                                        <RadioInput initialValue={inviteInfo?.surveyResponses?.isPrivateTransport}
                                                    requiredValue={show}
                                                    requiredMessage={'Пожалуйста, выберете вариант'}
                                                    itemName={'isPrivateTransport'}>
                                            <Radio.Button value={false}>Транспортом молодых на венчание,
                                                а затем на банкет</Radio.Button>
                                            <Radio.Button value={true}>Личным транспортом</Radio.Button>
                                        </RadioInput>
                                    </>}
                                <PresentOnSecondDayComponent inviteInfo={inviteInfo}
                                                             presentOnSecondDayInit={presentOnSecondDayInit}
                                                             secondDayList={secondDayList}
                                                             options={options}
                                                             needOneMorePlace={inviteInfo.invitation?.needOneMorePlace}
                                                             onSecondDayListChange={onSecondDayListChange}
                                                             onFormValueChange={onFormValueChange}
                                                             show={show}

                                                             singleGuest={singleGuest}/>
                                <h3 className={s.item_title}>{singleGuest ? 'Какой напиток' : 'Какие напитки'} Вы
                                    предпочитаете?</h3>
                                <SelectInputItem itemName={"likeDrinks"}
                                                 maxCountValue={inviteInfo?.guests.length}
                                                 initialValue={inviteInfo?.surveyResponses?.likeDrinks}
                                                 requiredValue={true}
                                                 optionsValue={alcoholicDrinks}
                                                 onFormValueChange={onFormValueChange}
                                                 requiredMessage={'Пожалуйста, выберете вариант'}
                                                 placeholderValue={`Пожалуйста выберете ${singleGuest ? 'напиток' : 'напитки'}`}
                                />
                                {inviteInfo.invitation?.checkSlip &&
                                    <>
                                        <h3 className={s.item_title}>Нужен ли ночлег?</h3>
                                        <RadioInput initialValue={inviteInfo?.surveyResponses?.needSleepPlace}
                                                    requiredValue={true}
                                                    requiredMessage={'Пожалуйста, выберете вариант'}
                                                    callback={onSecondDayListChange}
                                                    itemName={'needSleepPlace'}>
                                            <Radio.Button value={true}>Нужен</Radio.Button>
                                            <Radio.Button value={false}>Не нужен</Radio.Button>
                                        </RadioInput>
                                    </>}
                            </>}
                        <div className={s.button_wrapper}>
                            <Form.Item>
                                <Button className={s.description_button} htmlType="submit"
                                        disabled={disabled}>Сохранить</Button>
                            </Form.Item>
                        </div>
                    </Form>}
            </div>
        </section>
    );
};
