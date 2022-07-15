import '../App.css';
import './models_buttons.css';
import React, {useEffect, useState, useMemo} from "react";
import axios from "axios";
import {Model1, Model2, Model3, Model4, Model5, Model6} from "./models";
import {CsvLoader} from "./csv_loader";

const ModelsButtons = () => {

  const FinishedModelsNum = 10;

  const [Model1IsShown, Model1SetIsShown] = useState(true);
  const Model1Show = () => {
    Model1SetIsShown(true);
    Model2SetIsShown(false);
    Model3SetIsShown(false);
    Model4SetIsShown(false);
    Model5SetIsShown(false);
    Model6SetIsShown(false);
  };

  const [Model2IsShown, Model2SetIsShown] = useState(false);
  const Model2Show = () => {
    Model1SetIsShown(false);
    Model2SetIsShown(true);
    Model3SetIsShown(false);
    Model4SetIsShown(false);
    Model5SetIsShown(false);
    Model6SetIsShown(false);
  };

  const [Model3IsShown, Model3SetIsShown] = useState(false);
  const Model3Show = () => {
    Model1SetIsShown(false);
    Model2SetIsShown(false);
    Model3SetIsShown(true);
    Model4SetIsShown(false);
    Model5SetIsShown(false);
    Model6SetIsShown(false);
  };

  const [Model4IsShown, Model4SetIsShown] = useState(false);
  const Model4Show = () => {
    Model1SetIsShown(false);
    Model2SetIsShown(false);
    Model3SetIsShown(false);
    Model4SetIsShown(true);
    Model5SetIsShown(false);
    Model6SetIsShown(false);
  };

  const [Model5IsShown, Model5SetIsShown] = useState(false);
  const Model5Show = () => {
    Model1SetIsShown(false);
    Model2SetIsShown(false);
    Model3SetIsShown(false);
    Model4SetIsShown(false);
    Model5SetIsShown(true);
    Model6SetIsShown(false);
  };

  const [Model6IsShown, Model6SetIsShown] = useState(false);
  const Model6Show = () => {
    Model1SetIsShown(false);
    Model2SetIsShown(false);
    Model3SetIsShown(false);
    Model4SetIsShown(false);
    Model5SetIsShown(false);
    Model6SetIsShown(true);
  };

  const [modelsAvailable, setModelsAvailable] = useState([]);

  const PromiseArr = useMemo(() => [], []);
  const api_url = "http://localhost:8000/api/model_"

  for (let i = 1; i <= FinishedModelsNum; i++) {
    PromiseArr.push(
      axios
        .get(api_url + i)
        .then(result => new Promise(resolve => resolve(result.data.length ? true : false)))
    );
  }

  useEffect(() => {
    Promise.all(PromiseArr).then(res => setModelsAvailable(res))
  }, [PromiseArr]);

  if (!modelsAvailable[3]) {
    modelsAvailable[4] = !modelsAvailable[4] ? false : true;
    modelsAvailable[5] = !modelsAvailable[5] ? false : true;
  }

  if (!modelsAvailable[0] || !modelsAvailable[1] || !modelsAvailable[6])
    modelsAvailable[7] = !modelsAvailable[7] ? false : true;

  if (!modelsAvailable[7])
    modelsAvailable[8] = !modelsAvailable[8] ? false : true;

  if (!modelsAvailable[1] || !modelsAvailable[3] || !modelsAvailable[6] || !modelsAvailable[7])
    modelsAvailable[9] = !modelsAvailable[9] ? false : true;

  return (
    <div className="App">
      <div className="modelsbuttons">
        <button name="model_1" onClick={Model1Show} style={Model1IsShown ? {color: "#f2e19e"} : {color: "#F2F2F2"}}>1. Распределение контактного давления валков</button>
        <button name="model_2" onClick={Model2Show} style={Model2IsShown ? {color: "#f2e19e"} : {color: "#F2F2F2"}}>2. Профиль валков (по Целикову) изгиб валков</button>
        <button name="model_3" onClick={Model3Show} style={Model3IsShown ? {color: "#f2e19e"} : {color: "#F2F2F2"}}>3. Смещение валков от (оси полосы или начального положения)</button>
        <button name="model_4" onClick={Model4Show} style={Model4IsShown ? {color: "#f2e19e"} : {color: "#F2F2F2"}}>4. Зазор (исходный)</button>
        <button name="model_5" onClick={Model5Show} style={Model5IsShown ? {color: "#f2e19e"} : {color: "#F2F2F2"}} disabled={!modelsAvailable[4]}>5. Износ профиля валков</button>
        <button name="model_6" onClick={Model6Show} style={Model6IsShown ? {color: "#f2e19e"} : {color: "#F2F2F2"}} disabled={!modelsAvailable[5]}>6. Износ + зазоры</button>
        <button name="model_7">7. Модель распределения температур в валке</button>
        <button name="model_8" disabled={!modelsAvailable[7]}>8. Растяжение (деформация) в валках</button>
        <button name="model_9" disabled={!modelsAvailable[8]}>9. Растяжение (расширение) полосы</button>
        <button name="model_10" disabled={!modelsAvailable[9]}>10. Модель профиля полосы без износа валков</button>
        <button name="model_11" disabled={true}>11.	Износ валка</button>
        <button name="model_12" disabled={true}>12.	Модель расчета кромок полосы</button>
        <button name="model_13" disabled={true}>13.	Расчет профиля полосы</button>
        <button name="model_14" disabled={true}>14.	Модель текущего сдвига</button>
        <button name="model_15" disabled={true}>15. Переменная сдвижка</button>
        <button name="model_16" disabled={true}>16. Оценка точности модели профиля</button>
        <button name="model_17" disabled={true}>17. Модель качества профиля</button>
        <button name="model_18" disabled={true}>18. Модель расчета оптимальной сдвижки</button>
      </div>
      <div className='workingWindow'>
        {Model1IsShown && <Model1/>}
        {Model2IsShown && <Model2/>}
        {Model3IsShown && <Model3/>}
        {Model4IsShown && <Model4/>}
        {Model5IsShown && <Model5/>}
        {Model6IsShown && <Model6/>}
        <CsvLoader/>
        <br/>
        <br/>
        <br/>
      </div>
      <br/>
      <br/>
      <br/>
    </div>
  );
}

export{ModelsButtons};