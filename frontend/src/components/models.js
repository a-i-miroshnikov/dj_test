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
          <div className="inputcell">
            <Latex>$$x$$</Latex>
            <input type="number" id="x_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$w$$</Latex>
            <input type="number" id="w_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$\xi_p$$</Latex>
            <input type="number" id="xi_p_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$\xi_c$$</Latex>
            <input type="number" id="xi_c_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$\xi_m$$</Latex>
            <input type="number" id="xi_m_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_0$$</Latex>
            <input type="number" id="z_0_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_p$$</Latex>
            <input type="number" id="z_p_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_c$$</Latex>
            <input type="number" id="z_c_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_m$$</Latex>
            <input type="number" id="z_m_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_e$$</Latex>
            <input type="number" id="z_e_input"/>
          </div>
          <div className="inputcell">
            <Latex>{W12_averageShow}</Latex>
            <input type="checkbox" id="W12_average_input"/>
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
          <div className="inputcell">
            <Latex>$$S_x$$</Latex>
            <input type="number" id="S_x_input"/>
          </div>
          <div className="inputcell">
            <Latex>{L_buShow}</Latex>
            <input type="number" id="L_bu_input"/>
          </div>
          <div className="inputcell">
            <Latex>{L_conicShow}</Latex>
            <input type="number" id="L_conic_input"/>
          </div>
          <div className="inputcell">
            <Latex>Yu</Latex>
            <input type="number" id="Yu_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$\mu$$</Latex>
            <input type="number" id="mu_input"/>
          </div>
          <div className="inputcell">
            <Latex>{D_buShow}</Latex>
            <input type="number" id="D_bu_input"/>
          </div>
          <div className="inputcell">
            <Latex>{L_ckShow}</Latex>
            <input type="number" id="L_ck_input"/>
          </div>
          <div className="inputcell">
            <Latex>{W12_averageShow}</Latex>
            <input type="checkbox" id="W12_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{P12_averageShow}</Latex>
            <input type="checkbox" id="P12_average_input"/>
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
          <div className="inputcell">
            <Latex>$$b_1$$</Latex>
            <input type="number" id="b1_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$b_2$$</Latex>
            <input type="number" id="b2_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$b_3$$</Latex>
            <input type="number" id="b3_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z$$</Latex>
            <input type="number" id="z_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$sh$$</Latex>
            <input type="number" id="sh_input"/>
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
          <div className="inputcell">
            <Latex>{L_wrShow}</Latex>
            <input type="number" id="L_wr_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$S_x$$</Latex>
            <input type="number" id="S_x_input"/>
          </div>
          <div className="inputcell">
            <Latex>{Sh12_averageShow}</Latex>
            <input type="number" id="Sh12_average_input"/>
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
          <div className="inputcell">
            <Latex>$$x$$</Latex>
            <input type="number" id="x_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$sh$$</Latex>
            <input type="number" id="sh_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$S_x$$</Latex>
            <input type="number" id="S_x_input"/>
          </div>
          <div className="inputcell">
            <Latex>{W12_averageShow}</Latex>
            <input type="checkbox" id="W12_average_input"/>
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
          <div className="inputcell">
            <Latex>{L_wrShow}</Latex>
            <input type="number" id="L_wr_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z$$</Latex>
            <input type="number" id="z_input"/>
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
          <div className="inputcell">
            <Latex>$$M_x$$</Latex>
            <input type="number" id="M_x_input"/>
          </div>
          <div className="inputcell">
            <Latex>{T_scShow}</Latex>
            <input type="number" id="T_sc_input"/>
          </div>
          <div className="inputcell">
            <Latex>{T_seShow}</Latex>
            <input type="number" id="T_se_input"/>
          </div>
          <div className="inputcell">
            <Latex>{T_reShow}</Latex>
            <input type="number" id="T_re_input"/>
          </div>
          <div className="inputcell">
            <Latex>{T_coolShow}</Latex>
            <input type="number" id="T_cool_input"/>
          </div>
          <div className="inputcell">
            <Latex>{L_wrShow}</Latex>
            <input type="number" id="L_wr_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$S_x$$</Latex>
            <input type="number" id="S_x_input"/>
          </div>
          <div className="inputcell">
            <Latex>{K_expanShow}</Latex>
            <input type="number" id="K_expan_input"/>
          </div>
          <div className="inputcell">
            <Latex>{W12_averageShow}</Latex>
            <input type="checkbox" id="W12_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{D12bot_averageShow}</Latex>
            <input type="checkbox" id="D12bot_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{D12top_averageShow}</Latex>
            <input type="checkbox" id="D12top_average_input"/>
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

const Model8 = () => {
  const H12_averageShow = "$$H12_{average}$$";
  const W12_averageShow = "$$W12_{average}$$";
  const V11_averageShow = "$$V11_{average}$$";
  const V12_averageShow = "$$V12_{average}$$";
  const P12_averageShow = "$$P12_{average}$$";
  const D12bot_averageShow = "$$D12bot_{average}$$";
  const D12top_averageShow = "$$D12top_{average}$$";

  return (
    <div className="modelwindow">
      <h2 style={{textDecoration: "underline"}}>8. Растяжение (деформация) в валках</h2>
      <form className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="inputcell">
            <Latex>Yu</Latex>
            <input type="number" id="Yu_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$\mu$$</Latex>
            <input type="number" id="mu_input"/>
          </div>
          <div className="inputcell">
            <Latex>Ce</Latex>
            <input type="number" id="Ce_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$S_x$$</Latex>
            <input type="number" id="S_x_input"/>
          </div>
          <div className="inputcell">
            <Latex>{H12_averageShow}</Latex>
            <input type="checkbox" id="H12_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{W12_averageShow}</Latex>
            <input type="checkbox" id="W12_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{V11_averageShow}</Latex>
            <input type="checkbox" id="V11_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{V12_averageShow}</Latex>
            <input type="checkbox" id="V12_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{P12_averageShow}</Latex>
            <input type="checkbox" id="P12_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{D12bot_averageShow}</Latex>
            <input type="checkbox" id="D12bot_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{D12top_averageShow}</Latex>
            <input type="checkbox" id="D12top_average_input"/>
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

const Model9 = () => {
  const H12_averageShow = "$$H12_{average}$$";
  const V11_averageShow = "$$V11_{average}$$";
  const V12_averageShow = "$$V12_{average}$$";

  return (
    <div className="modelwindow">
      <h2 style={{textDecoration: "underline"}}>9. Растяжение (расширение) полосы</h2>
      <form className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="inputcell">
            <Latex>$$\mu F$$</Latex>
            <input type="number" id="muF_input"/>
          </div>
          <div className="inputcell">
            <Latex>{H12_averageShow}</Latex>
            <input type="checkbox" id="H12_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{V11_averageShow}</Latex>
            <input type="checkbox" id="V11_average_input"/>
          </div>
          <div className="inputcell">
            <Latex>{V12_averageShow}</Latex>
            <input type="checkbox" id="V12_average_input"/>
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

const Model10 = () => {
  const W12_averageShow = "$$W12_{average}$$";

  return (
    <div className="modelwindow">
      <h2 style={{textDecoration: "underline"}}>10. Модель профиля полосы без износа валков</h2>
      <form className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="inputcell">
            <Latex>$$S_x$$</Latex>
            <input type="number" id="S_x_input"/>
          </div>
          <div className="inputcell">
            <Latex>{W12_averageShow}</Latex>
            <input type="checkbox" id="W12_average_input"/>
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

export{Model1, Model2, Model3, Model4, Model5, Model6, Model7, Model8, Model9, Model10};