import './App.css';
import React, {useEffect, useState, useMemo} from "react";
import axios from "axios";
import {WorkingWindow} from "./working_window";

function App() {

  const FinishedModelsNum = 10;
  const api_url = "http://localhost:8000/api/model_"

  const ModelIsShowInitState = () => {
    const InitList = [true];
    if (localStorage.getItem("ModelShow"))
      return JSON.parse(localStorage.getItem("ModelShow"));
    else
      for (let i = 1; i < FinishedModelsNum; i++) InitList.push(false);
      return InitList;
  }

  const ModelShow = modelIndex => {
    const ModelIsShowState = [];
    for (let i = 0; i < FinishedModelsNum; i++) {
      ModelIsShowState[i] = false;
      if (i === modelIndex)
        ModelIsShowState[i] = true;
    }
    localStorage.setItem("ModelShow", JSON.stringify(ModelIsShowState));
    ModelSetIsShown(ModelIsShowState);
  }

  const [ModelIsShown, ModelSetIsShown] = useState(() => {
    return ModelIsShowInitState();
  });

  const [modelsAvailable, setModelsAvailable] = useState(() => []);

  const btnTextColor = (modelIndex, disabled = false) => {
    if (disabled) return "#666666"
    return ModelIsShown[modelIndex] ? "#f2e19e" : "#F2F2F2"
  }

  const PromiseArr = useMemo(() => [], []);

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
        <button name="model_1" onClick={() => ModelShow(0)} style={{color: btnTextColor(0)}}>1. Распределение контактного давления валков</button>
        <button name="model_2" onClick={() => ModelShow(1)} style={{color: btnTextColor(1)}}>2. Профиль валков (по Целикову) изгиб валков</button>
        <button name="model_3" onClick={() => ModelShow(2)} style={{color: btnTextColor(2)}}>3. Смещение валков от (оси полосы или начального положения)</button>
        <button name="model_4" onClick={() => ModelShow(3)} style={{color: btnTextColor(3)}}>4. Зазор (исходный)</button>
        <button name="model_5" onClick={() => ModelShow(4)} style={{color: btnTextColor(4, !modelsAvailable[4])}} disabled={!modelsAvailable[4]}>5. Износ профиля валков</button>
        <button name="model_6" onClick={() => ModelShow(5)} style={{color: btnTextColor(5, !modelsAvailable[5])}} disabled={!modelsAvailable[5]}>6. Износ + зазоры</button>
        <button name="model_7" onClick={() => ModelShow(6)} style={{color: btnTextColor(6)}}>7. Модель распределения температур в валке</button>
        <button name="model_8" onClick={() => ModelShow(7)} style={{color: btnTextColor(7, !modelsAvailable[7])}} disabled={!modelsAvailable[7]}>8. Растяжение (деформация) в валках</button>
        <button name="model_9" onClick={() => ModelShow(8)} style={{color: btnTextColor(8, !modelsAvailable[8])}} disabled={!modelsAvailable[8]}>9. Растяжение (расширение) полосы</button>
        <button name="model_10" onClick={() => ModelShow(9)} style={{color: btnTextColor(9, !modelsAvailable[9])}} disabled={!modelsAvailable[9]}>10. Модель профиля полосы без износа валков</button>
        <button name="model_11" disabled={true}>11.	Износ валка</button>
        <button name="model_12" disabled={true}>12.	Модель расчета кромок полосы</button>
        <button name="model_13" disabled={true}>13.	Расчет профиля полосы</button>
        <button name="model_14" disabled={true}>14.	Модель текущего сдвига</button>
        <button name="model_15" disabled={true}>15. Переменная сдвижка</button>
        <button name="model_16" disabled={true}>16. Оценка точности модели профиля</button>
        <button name="model_17" disabled={true}>17. Модель качества профиля</button>
        <button name="model_18" disabled={true}>18. Модель расчета оптимальной сдвижки</button>
      </div>
      <WorkingWindow ModelIsShown={ModelIsShown}/>
    </div>
  );
}

export default App;