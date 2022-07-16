import './models.css'
var Latex = require("react-latex");

const Model1 = () => {
  const W12_averageShow = "$$W12_{average}$$";

  return (
    <div className="modelwindow">
      <h2 style={{textDecoration: "underline"}}>1. Распределение контактного давления валков</h2>
      <form className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="latexsymbols">
            <Latex>$$x$$</Latex>
            <Latex>$$w$$</Latex>
            <Latex>$$\xi_p$$</Latex>
            <Latex>$$\xi_c$$</Latex>
            <Latex>$$\xi_m$$</Latex>
            <Latex>$$z_0$$</Latex>
            <Latex>$$z_p$$</Latex>
            <Latex>$$z_c$$</Latex>
            <Latex>$$z_m$$</Latex>
            <Latex>$$z_e$$</Latex>
            <Latex>{W12_averageShow}</Latex>
          </div>
          <div className="inputs">
            <input type="number" name="x_input"/>
            <input type="number" name="w_input"/>
            <input type="number" name="xi_p_input"/>
            <input type="number" name="xi_c_input"/>
            <input type="number" name="xi_m_input"/>
            <input type="number" name="z_0_input"/>
            <input type="number" name="z_p_input"/>
            <input type="number" name="z_c_input"/>
            <input type="number" name="z_m_input"/>
            <input type="number" name="z_e_input"/>
            <input type="checkbox" name="W12_average_input"/>
          </div>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs">Сохранить</button>
          <button className="loadmodel">Загрузить</button>
        </div>
      </form>
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
      <h2 style={{textDecoration: "underline"}}>2. Профиль валков (по Целикову) изгиб валков</h2>
      <div className="modelinputswindow">
        <h1 >Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="latexsymbols">
            <Latex>$$S_x$$</Latex>
            <Latex>{L_buShow}</Latex>
            <Latex>{L_conicShow}</Latex>
            <Latex>Yu</Latex>
            <Latex>$$\mu$$</Latex>
            <Latex>{D_buShow}</Latex>
            <Latex>{L_ckShow}</Latex>
            <Latex>{W12_averageShow}</Latex>
            <Latex>{P12_averageShow}</Latex>
          </div>
          <div className="inputs">
            <input type="number" name="S_x_input"/>
            <input type="number" name="L_bu_input"/>
            <input type="number" name="L_conic_input"/>
            <input type="number" name="Yu_input"/>
            <input type="number" name="mu_input"/>
            <input type="number" name="D_bu_input"/>
            <input type="number" name="L_ck_input"/>
            <input type="checkbox" name="W12_average_input"/>
            <input type="checkbox" name="P12_average_input"/>
          </div>
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
      <h2 style={{textDecoration: "underline"}}>3. Смещение валков от (оси полосы или начального положения)</h2>
      <div className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="latexsymbols">
            <Latex>$$b_1$$</Latex>
            <Latex>$$b_2$$</Latex>
            <Latex>$$b_3$$</Latex>
            <Latex>$$z$$</Latex>
            <Latex>$$sh$$</Latex>
          </div>
          <div className="inputs">
            <input type="number" name="b1_input"/>
            <input type="number" name="b2_input"/>
            <input type="number" name="b3_input"/>
            <input type="number" name="z_input"/>
            <input type="number" name="sh_input"/>
          </div>
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
      <h2 style={{textDecoration: "underline"}}>4. Зазор (исходный)</h2>
      <div className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="latexsymbols">
            <Latex>{L_wrShow}</Latex>
            <Latex>$$S_x$$</Latex>
            <Latex>{Sh12_averageShow}</Latex>
          </div>
          <div className="inputs">
            <input type="number" name="L_wr_input"/>
            <input type="number" name="S_x_input"/>
            <input type="checkbox" name="Sh12_average_input"/>
          </div>
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
      <h2 style={{textDecoration: "underline"}}>5. Износ профиля валков</h2>
      <div className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="latexsymbols">
            <Latex>$$x$$</Latex>
            <Latex>$$sh$$</Latex>
            <Latex>$$S_x$$</Latex>
            <Latex>{W12_averageShow}</Latex>
          </div>
          <div className="inputs">
            <input type="number" name="x_input"/>
            <input type="number" name="sh_input"/>
            <input type="number" name="S_x_input"/>
            <input type="checkbox" name="W12_average_input"/>
          </div>
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
      <h2 style={{textDecoration: "underline"}}>6. Износ + зазоры</h2>
      <form className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="latexsymbols">
            <Latex>{L_wrShow}</Latex>
            <Latex>$$z$$</Latex>
          </div>
          <div className="inputs">
            <input type="number" name="L_wr_input"/>
            <input type="number" name="z_input"/>
          </div>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs">Сохранить</button>
          <button className="loadmodel">Загрузить</button>
        </div>
      </form>
    </div>
  );
}

const Model7 = () => {
  const T_scShow = "$$T_{sc}$$";
  const T_seShow = "$$T_{se}$$";
  const T_reShow = "$$T_{re}$$";
  const T_coolShow = "$$T_{cool}$$";
  const L_wrShow = "$$L_{wr}$$";
  const K_expanShow = "$$K_{expan}$$";
  const W12_averageShow = "$$W12_{average}$$";
  const D12bot_averageShow = "$$D12bot_{average}$$";
  const D12top_averageShow = "$$D12top_{average}$$";

  return (
    <div className="modelwindow">
      <h2 style={{textDecoration: "underline"}}>7. Модель распределения температур в валке</h2>
      <form className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="latexsymbols">
            <Latex>$$M_x$$</Latex>
            <Latex>{T_scShow}</Latex>
            <Latex>{T_seShow}</Latex>
            <Latex>{T_reShow}</Latex>
            <Latex>{T_coolShow}</Latex>
            <Latex>{L_wrShow}</Latex>
            <Latex>$$S_x$$</Latex>
            <Latex>{K_expanShow}</Latex>
            <Latex>{W12_averageShow}</Latex>
            <Latex>{D12bot_averageShow}</Latex>
            <Latex>{D12top_averageShow}</Latex>
          </div>
          <div className="inputs">
            <input type="number" name="M_x_input"/>
            <input type="number" name="T_sc_input"/>
            <input type="number" name="T_se_input"/>
            <input type="number" name="T_re_input"/>
            <input type="number" name="T_cool_input"/>
            <input type="number" name="L_wr_input"/>
            <input type="number" name="S_x_input"/>
            <input type="number" name="K_expan_input"/>
            <input type="checkbox" name="W12_average_input"/>
            <input type="checkbox" name="D12bot_average_input"/>
            <input type="checkbox" name="D12top_average_input"/>
          </div>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs">Сохранить</button>
          <button className="loadmodel">Загрузить</button>
        </div>
      </form>
    </div>
  );
}

export{Model1, Model2, Model3, Model4, Model5, Model6, Model7};