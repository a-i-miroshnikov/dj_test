import './csv_loader.css'
import React, {useState, useEffect, useRef} from "react";
import axios from "axios";

const CsvLoader = () => {

  const csv_url = "http://localhost:8000/api/csv/";
  const [beginUpload, setBeginUpload] = useState(true);

  useEffect(() => {
    axios
      .get(csv_url)
      .then(res => {
        if (res.data.length)
          setBeginUpload(false)
      })
      .catch(err => console.warn(err))
  }, []);

  const techData = useRef();
  const strip = useRef();
  const swath = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(techData.current.value && strip.current.value && swath.current.value)) {
      alert("Загрузите все необходимые файлы!");
      return;
    }
    if (!window.confirm("Загрузить выбранные файлы?")) return;

    const formData = new FormData();
    formData.append("tech_data", techData.current.files[0]);
    formData.append("strip", strip.current.files[0]);
    formData.append("swath", swath.current.files[0]);

    axios
      .get(csv_url)
      .then(async res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(csv_url + i.id);
        }
        console.log("Старые csv файлы очищены.");
      })
      .catch(err => console.warn(err))

    axios
      .post(csv_url, formData, {
        headers: {"Content-Type": "multipart/form-data"}
      })
      .then(res => {
        techData.current.value = null;
        strip.current.value = null;
        swath.current.value = null;
        setBeginUpload(false);
        console.log("Файлы csv успешно загружены!");
        alert("Файлы csv успешно загружены!");
      })
      .catch(err => console.warn(err))
  };

  return (
    <div className="csv_load_window">
      {beginUpload && <p className="warning">⚠ Сперва загрузите необходимые файлы!</p>}
      {!beginUpload && <p className="warning">Необходимые файлы загружены.</p>}
      <div className="techData">
        <h2>Данные о технологии</h2>
        <input ref={techData} className="tech_data_input" type="file"/>
      </div>
      <div className="strip">
        <h2>Профиль полосы</h2>
        <input ref={strip} className="strip_input" type="file"/>
      </div>
      <div className="swath">
        <h2>Профиль валка</h2>
        <input ref={swath} className="swath_input" type="file"/>
      </div>
      <button className="savecsv" onClick={e => handleSubmit(e)}>Сохранить</button>
    </div>
  );
}

export{CsvLoader};