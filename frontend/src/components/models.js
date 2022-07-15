import './models.css'
var Latex = require("react-latex");

const Model1 = () => {
  const W12_averageShow = "$$W12_{average}$$";

  return (
    <div className="modelwindow">
      <br/>
      <h2 style={{textDecoration: "underline"}}>1. Распределение контактного давления валков</h2>
      <div className="modelinputs">
        <h1>Задаваемые пользователями параметры:</h1>
        <div name="x">
          <Latex>$$x$$</Latex>
          <input type="number" name="x_input"/>
        </div>
        <div name="w">
          <Latex>$$w$$</Latex>
          <input type="number" name="w_input"/>
        </div>
        <div name="xi_p">
          <Latex>$$\xi_p$$</Latex>
          <input type="number" name="xi_p_input"/>
        </div>
        <div name="xi_c">
          <Latex>$$\xi_c$$</Latex>
          <input type="number" name="xi_c_input"/>
        </div>
        <div name="xi_m">
          <Latex>$$\xi_m$$</Latex>
          <input type="number" name="xi_m_input"/>
        </div>
        <div name="z_0">
          <Latex>$$z_0$$</Latex>
          <input type="number" name="z_0_input"/>
        </div>
        <div name="z_p">
          <Latex>$$z_p$$</Latex>
          <input type="number" name="z_p_input"/>
        </div>
        <div name="z_c">
          <Latex>$$z_c$$</Latex>
          <input type="number" name="z_c_input"/>
        </div>
        <div name="z_m">
          <Latex>$$z_m$$</Latex>
          <input type="number" name="z_m_input"/>
        </div>
        <div name="z_e">
          <Latex>$$z_e$$</Latex>
          <input type="number" name="z_e_input"/>
        </div>
        <div name="W12_average">
          <Latex>{W12_averageShow}</Latex>
          <input type="checkbox" name="W12_average_input"/>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs">Сохранить</button>
          <button className="loadmodel">Загрузить</button>
        </div>
      </div>
    </div>
  );
}

const Model2 = () => {
  const L_buShow = "$$L_{bu}$$";
  const L_conicShow = "$$L_{conic}$$";
  const D_buShow = "$$D_{bu}$$";
  const L_ckShow = "$$L_{ck}$$";
  const W12_averageShow = "$$W12_{average}$$";
  const P12_averageShow = "$$P12_{average}$$";

  return (
    <div className="modelwindow">
      <br/>
      <h2 style={{textDecoration: "underline"}}>2. Профиль валков (по Целикову) изгиб валков</h2>
      <div className="modelinputs">
        <h1>Задаваемые пользователями параметры:</h1>
        <div name="S_x">
          <Latex>$$S_x$$</Latex>
          <input type="number" name="S_x_input"/>
        </div>
        <div name="L_bu">
          <Latex>{L_buShow}</Latex>
          <input type="number" name="L_bu_input"/>
        </div>
        <div name="L_conic">
          <Latex>{L_conicShow}</Latex>
          <input type="number" name="L_conic_input"/>
        </div>
        <div name="Yu">
          <Latex>Yu</Latex>
          <input type="number" name="Yu_input"/>
        </div>
        <div name="mu">
          <Latex>$$\mu$$</Latex>
          <input type="number" name="mu_input"/>
        </div>
        <div name="D_bu">
          <Latex>{D_buShow}</Latex>
          <input type="number" name="D_bu_input"/>
        </div>
        <div name="L_ck">
          <Latex>{L_ckShow}</Latex>
          <input type="number" name="L_ck_input"/>
        </div>
        <div name="W12_average">
          <Latex>{W12_averageShow}</Latex>
          <input type="checkbox" name="W12_average_input"/>
        </div>
        <div name="P12_average">
          <Latex>{P12_averageShow}</Latex>
          <input type="checkbox" name="P12_average_input"/>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs">Сохранить</button>
          <button className="loadmodel">Загрузить</button>
        </div>
      </div>
    </div>
  );
}

const Model3 = () => {
  return (
    <div className="modelwindow">
      <br/>
      <h2 style={{textDecoration: "underline"}}>3. Смещение валков от (оси полосы или начального положения)</h2>
      <div className="modelinputs">
        <h1>Задаваемые пользователями параметры:</h1>
        <div name="b1">
          <Latex>$$b_1$$</Latex>
          <input type="number" name="b1_input"/>
        </div>
        <div name="b2">
          <Latex>$$b_2$$</Latex>
          <input type="number" name="b2_input"/>
        </div>
        <div name="b3">
          <Latex>$$b_3$$</Latex>
          <input type="number" name="b3_input"/>
        </div>
        <div name="z">
          <Latex>$$z$$</Latex>
          <input type="number" name="z_input"/>
        </div>
        <div name="sh">
          <Latex>$$sh$$</Latex>
          <input type="number" name="sh_input"/>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs">Сохранить</button>
          <button className="loadmodel">Загрузить</button>
        </div>
      </div>
    </div>
  );
}

const Model4 = () => {
  const L_wrShow = "$$L_{wr}$$";
  const Sh12_averageShow = "$$Sh12_{average}$$";

  return (
    <div className="modelwindow">
      <br/>
      <h2 style={{textDecoration: "underline"}}>4. Зазор (исходный)</h2>
      <div className="modelinputs">
        <h1>Задаваемые пользователями параметры:</h1>
        <div name="L_wr">
          <Latex>{L_wrShow}</Latex>
          <input type="number" name="L_wr_input"/>
        </div>
        <div name="S_x">
          <Latex>$$S_x$$</Latex>
          <input type="number" name="S_x_input"/>
        </div>
        <div name="Sh12_average">
          <Latex>{Sh12_averageShow}</Latex>
          <input type="checkbox" name="Sh12_average_input"/>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs">Сохранить</button>
          <button className="loadmodel">Загрузить</button>
        </div>
      </div>
    </div>
  );
}

const Model5 = () => {
  const W12_averageShow = "$$W12_{average}$$";

  return (
    <div className="modelwindow">
      <br/>
      <h2 style={{textDecoration: "underline"}}>5. Износ профиля валков</h2>
      <div className="modelinputs">
        <h1>Задаваемые пользователями параметры:</h1>
        <div name="x">
          <Latex>$$x$$</Latex>
          <input type="number" name="x_input"/>
        </div>
        <div name="sh">
          <Latex>$$sh$$</Latex>
          <input type="number" name="sh_input"/>
        </div>
        <div name="S_x">
          <Latex>$$S_x$$</Latex>
          <input type="number" name="S_x_input"/>
        </div>
        <div name="W12_average">
          <Latex>{W12_averageShow}</Latex>
          <input type="checkbox" name="W12_average_input"/>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs">Сохранить</button>
          <button className="loadmodel">Загрузить</button>
        </div>
      </div>
    </div>
  );
}

const Model6 = () => {
  const L_wrShow = "$$L_{wr}$$";

  return (
    <div className="modelwindow">
      <br/>
      <h2 style={{textDecoration: "underline"}}>6. Износ + зазоры</h2>
      <div className="modelinputs">
        <h1>Задаваемые пользователями параметры:</h1>
        <div name="L_wr">
          <Latex>{L_wrShow}</Latex>
          <input type="number" name="L_wr_input"/>
        </div>
        <div name="z">
          <Latex>$$z$$</Latex>
          <input type="number" name="z_input"/>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs">Сохранить</button>
          <button className="loadmodel">Загрузить</button>
        </div>
      </div>
    </div>
  );
}

export{Model1, Model2, Model3, Model4, Model5, Model6};