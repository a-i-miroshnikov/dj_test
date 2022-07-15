import './csv_loader.css'

const CsvLoader = () => {
  return (
    <div className="csv_load_window">
      <div className="techData">
        <h2>Данные о технологии</h2>
        <input className="tech_data_input" name="file" id="file" type="file"/>
      </div>
      <div className="strip">
        <h2>Профиль полосы</h2>
        <input className="strip_input" type="file"/>
      </div>
      <div className="swath">
        <h2>Профиль валка</h2>
        <input className="swath_input" type="file"/>
      </div>
      <button className="savecsv">Сохранить</button>
    </div>
  );
}

export{CsvLoader};