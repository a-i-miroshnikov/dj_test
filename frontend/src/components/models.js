import './models.css'
import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
var Latex = require("react-latex");

const Model1 = () => {
  const W12_averageShow = "$$W12_{average}$$";

  const argsUrl = "http://localhost:8000/api/model_1_args/";
  const modelUrl = "http://localhost:8000/api/model_1/";

  const x = useRef();
  const w = useRef();
  const xi_p = useRef();
  const xi_c = useRef();
  const xi_m = useRef();
  const z_0 = useRef();
  const z_p = useRef();
  const z_c = useRef();
  const z_m = useRef();
  const z_e = useRef();
  const W12_average = useRef();

  const res1 = useRef();
  const res2 = useRef();
  const Args = useRef(false);
  const Csv = useRef();
  const [modelExist, setModelExist] = useState(false);
  const [warnOldParams, setWarnOldParams] = useState(false);

  useEffect(() => {

    axios
      .get(argsUrl)
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          Args.current = data.id;
        }
      })
      .catch(err => console.warn(err))

    axios
      .get("http://localhost:8000/api/csv/")
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          Csv.current = data.id;
        }
      })
      .catch(err => console.warn(err))
  }, [])

  useEffect( () => {
    axios
      .get(modelUrl)
      .then(res => {
        if (res.data.length) {
          setModelExist(true);
          const data = res.data[res.data.length - 1];
          res1.current.value = data.Apl_res;
          res2.current.value = data.Bpl;
          if (data.args === null || data.csv === null)
            setWarnOldParams(true);
        }
      })
      .catch(err => console.warn(err))
  }, [])

  useEffect(() => {
    axios
      .get(argsUrl)
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          x.current.value = data.x;
          w.current.value = data.w;
          xi_p.current.value = data.xi_p;
          xi_c.current.value = data.xi_c;
          xi_m.current.value = data.xi_m;
          z_0.current.value = data.z_0;
          z_p.current.value = data.z_p;
          z_c.current.value = data.z_c;
          z_m.current.value = data.z_m;
          z_e.current.value = data.z_e;
          W12_average.current.checked = data.W12_average;
        }
      })
  }, [])

  const ArgsSubmit = async () => {
    if (!(x.current.value &&
      w.current.value &&
      xi_p.current.value &&
      xi_c.current.value &&
      xi_m.current.value &&
      z_0.current.value &&
      z_p.current.value &&
      z_c.current.value &&
      z_m.current.value &&
      z_e.current.value)
    ) {
      alert("Введите все необходимые параметры!");
      return;
    }
    if (!window.confirm("Сохранить введенные параметры?")) return;

    await axios
      .get(argsUrl)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(argsUrl + i.id);
        }
        console.log("Model_1_args: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .post(argsUrl, {
        x: x.current.value,
        w: w.current.value,
        xi_p: xi_p.current.value,
        xi_c: xi_c.current.value,
        xi_m: xi_m.current.value,
        z_0: z_0.current.value,
        z_p: z_p.current.value,
        z_c: z_c.current.value,
        z_m: z_m.current.value,
        z_e: z_e.current.value,
        W12_average: W12_average.current.checked,
      })
      .then(res => {
        console.log("Model_1_args: Новые параметры загружены.");
        Args.current = res.data.id;
        setWarnOldParams(true);
      })
      .catch(err => console.warn(err))
  }

  const handleCalc = async () => {

    if (!window.confirm("Запустить вычисления?")) return;

    await axios
      .get(argsUrl)
      .then(async (res) => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          if (+x.current.value !== data.x ||
            +w.current.value !== data.w ||
            +xi_p.current.value !== data.xi_p ||
            +xi_c.current.value !== data.xi_c ||
            +xi_m.current.value !== data.xi_m ||
            +z_0.current.value !== data.z_0 ||
            +z_p.current.value !== data.z_p ||
            +z_c.current.value !== data.z_c ||
            +z_m.current.value !== data.z_m ||
            +z_e.current.value !== data.z_e ||
            W12_average.current.checked !== data.W12_average
          ) {
            if (!window.confirm("Новые параметры не сохранены. " +
              "Модель будет рассчитана на основе старых данных. " +
              "Использовать новые параметры?"))
              alert("Вычисления будут происходить со старыми параметрами!");
            else
              await ArgsSubmit();
          }
        }
      })

    await axios
      .get(argsUrl)
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          Args.current = data.id;
        }
      })
      .catch(err => console.warn(err))

    await axios
      .get("http://localhost:8000/api/csv/")
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          Csv.current = data.id;
        }
      })
      .catch(err => console.warn(err))

    if (!Args.current || !Csv.current) {
      alert("Заполните все параметры и загрузите csv файлы!");
      return;
    }

    await axios
      .get(modelUrl)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(modelUrl + i.id);
        }
        console.log("Model_1: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .post(modelUrl, {
        args: Args.current,
        csv: Csv.current,
      })
      .then(res => {
        setWarnOldParams(false);
        setModelExist(true);
        console.log("Model_1: Вычисления прошли успешно.");
        setTimeout(() => { alert("Вычисления прошли успешно.") }, 250);;
      })
      .catch(err => console.warn(err))

  }

  const handleShowModal = resultNum => {
    const resContent = document.querySelector(resultNum);
    resContent.style.display = "inline-block";
    const ModalToOn = document.querySelector(".modal");
    ModalToOn.style.display = "flex";
  }

  const handleHideModal = e => {
    e.currentTarget.style.display = "none";
    const modalContent = document.querySelectorAll('[class^="modalcontent"]');
    modalContent.forEach(r => r.style.display = "none");
  }

  return (
    <div className="modelwindow">
      <h2 style={{textDecoration: "underline"}}>1. Распределение контактного давления валков</h2>
      <div className="modelinputswindow">
        <h1>Задаваемые пользователями параметры:</h1>
        <div className="modelinputs">
          <div className="inputcell">
            <Latex>$$x$$</Latex>
            <input type="number" ref={x} id="x_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$w$$</Latex>
            <input type="number" ref={w} id="w_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$\xi_p$$</Latex>
            <input type="number" ref={xi_p} id="xi_p_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$\xi_c$$</Latex>
            <input type="number" ref={xi_c} id="xi_c_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$\xi_m$$</Latex>
            <input type="number" ref={xi_m} id="xi_m_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_0$$</Latex>
            <input type="number" ref={z_0} id="z_0_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_p$$</Latex>
            <input type="number" ref={z_p} id="z_p_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_c$$</Latex>
            <input type="number" ref={z_c} id="z_c_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_m$$</Latex>
            <input type="number" ref={z_m} id="z_m_input"/>
          </div>
          <div className="inputcell">
            <Latex>$$z_e$$</Latex>
            <input type="number" ref={z_e} id="z_e_input"/>
          </div>
          <div className="inputcell">
            <Latex>{W12_averageShow}</Latex>
            <input type="checkbox" ref={W12_average} id="W12_average_input"/>
          </div>
        </div>
        <div className='inputbuttons'>
          <button className="saveinputs" onClick={() => ArgsSubmit()}>Сохранить</button>
          <button className="loadmodel" onClick={() => handleCalc()}>Вычислить</button>
        </div>
      </div>
      <div className="modelresultswindow">
        <h1>Результаты вычислений:</h1>
        {warnOldParams && modelExist && <p className="warningresults">⚠ Модель рассчитана на основе старых данных!</p>}
        {!modelExist && <p className="warningresults">⚠ Сначала нажмите кнопку "Вычислить".</p>}
        <div className="results" style={{display: modelExist ? "grid" : "none"}}>
          <Latex>$$№ \; \; Алгоритм$$</Latex>
          <div className="rescell">
            <div className="algonum"><Latex>$$1.$$</Latex></div>
            <div className="algores"><Latex>$$Apl(w)$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent1")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$2.$$</Latex></div>
            <div className="algores"><Latex>$$Bpl$$</Latex></div>
            <div className="resarea">
              <textarea ref={res2} style={{height: "30px", width: "200px", resize: "none"}}></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="modal" onClick={e => handleHideModal(e)} style={{display: "none"}}>
        <div className="modalcontent1" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res1} style={{height: "100px", width: "400px", resize: "none"}}></textarea>
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
          <button className="loadmodel">Вычислить</button>
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
          <button className="loadmodel">Вычислить</button>
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
          <button className="loadmodel">Вычислить</button>
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
          <button className="loadmodel">Вычислить</button>
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
          <button className="loadmodel">Вычислить</button>
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
          <button className="loadmodel">Вычислить</button>
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
          <button className="loadmodel">Вычислить</button>
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
          <button className="loadmodel">Вычислить</button>
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
          <button className="loadmodel">Вычислить</button>
        </div>
      </form>
    </div>
  );
}

export {
  Model1,
  Model2,
  Model3,
  Model4,
  Model5,
  Model6,
  Model7,
  Model8,
  Model9,
  Model10
}