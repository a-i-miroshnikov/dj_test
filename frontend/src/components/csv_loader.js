import './csv_loader.css'
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Model1} from "./models";

const CsvLoader = () => {

  const csv_url = "http://localhost:8000/api/csv/";

  const [beginUpload, setBeginUpload] = useState(true);
  axios
    .get(csv_url)
    .then(res => {
      if (res.data.length) setBeginUpload(false);
    })
  const [techData, setTechData] = useState(beginUpload ? false : true);
  const [strip, setStrip] = useState(beginUpload ? false : true);
  const [swath, setSwath] = useState(beginUpload ? false : true);

  const CsvInitState = () => {
    axios
      .get(csv_url)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data) {
            setTechData(csv_url + i.tech_data);
            setStrip(csv_url + i.strip);
            setSwath(csv_url + i.swath);
          }
        }
      })
  }

  CsvInitState();


  const CsvCleaner = () => {
    axios
      .get(csv_url)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(csv_url + i.id);
        }
        console.log("Старые csv файлы очищены.");
      })
  }

  const handleSubmit = () => {
    if (!(techData && strip && swath)) {
      alert("Загрузите все необходимые файлы!");
      return false;
    }

    if (!window.confirm("Загрузить выбранные файлы?"))
      return false

    const csv_url = "http://localhost:8000/api/csv/";
    const formData = new FormData();
    formData.append("tech_data", techData);
    formData.append("strip", strip);
    formData.append("swath", swath);

    CsvCleaner();

    axios
      .post(csv_url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        }
      })
      .then(res => {
        alert("Файлы csv успешно загружены!");
        setBeginUpload(false);
      })
  };

  return (
    <div className="csv_load_window">
      {beginUpload && <p className="warning">⚠ Сперва загрузите необходимые файлы!</p>}
      {!beginUpload && <p className="warning">Необходимые файлы загружены.</p>}
      <div className="techData">
        <h2>Данные о технологии</h2>
        <input className="tech_data_input" type="file" onChange={e => setTechData(e.target.files[0])}/>
      </div>
      <div className="strip">
        <h2>Профиль полосы</h2>
        <input className="strip_input" type="file" onChange={e => setStrip(e.target.files[0])}/>
      </div>
      <div className="swath">
        <h2>Профиль валка</h2>
        <input className="swath_input" type="file" onChange={e => setSwath(e.target.files[0])}/>
      </div>
      <button className="savecsv" onClick={handleSubmit}>Сохранить</button>
    </div>
  );
}

export{CsvLoader};