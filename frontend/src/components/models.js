import './models.css'
import React, {useState, useEffect, useRef} from "react";
import {CsvLoader} from "./csv_loader";
import axios from "axios";
import {Oval} from "react-loader-spinner";
var Latex = require("react-latex");

const Model1 = () => {
  const W12_averageShow = "$$W12_{average}$$";

  const K_pnorm = "$$K_{pnorm}$$";
  const K_px = "$$K_{px} (x, w)$$";

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
  const res3 = useRef();
  const res4 = useRef();
  const res5 = useRef();
  const res6 = useRef();
  const res7 = useRef();
  const res8 = useRef();
  const res9 = useRef();
  const Args = useRef();
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
          if (res.data.length > 1)
            setWarnOldParams(true);
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
          res3.current.value = data.v_res;
          res4.current= data.f_c_res;
          res5.current = data.f_e_res;
          res6.current = data.Kxl_res;
          res7.current = data.Kx_res;
          res8.current = data.K_pnorm;
          res9.current = data.K_px_res;
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
      .catch(err => console.warn(err))
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
      .then(async res => {
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
        else await ArgsSubmit();
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
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          for (let i of res.data.slice(0, res.data.length - 1))
            await axios.delete(argsUrl + i.id);
        }
        console.log("Model_1_args: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

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
        console.log("Model_1: Вычисления прошли успешно.");
        alert("Вычисления прошли успешно.");
        setModelExist(true);
        setWarnOldParams(false);
        if (!alert("Вычисления прошли успешно."))
          window.location.reload();
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
      <div className="leftSide">
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
        <CsvLoader/>
      </div>
      <div className="modelresultswindow">
        <h1>Результаты вычислений:</h1>
        {warnOldParams && modelExist && <p className="warningresults">⚠ Модель рассчитана на основе старых данных!</p>}
        {!modelExist && <p className="warningresults">⚠ Сначала нажмите кнопку "Вычислить".</p>}
        <div className="results" style={{display: modelExist ? "grid" : "none"}}>
          <Latex>$$№ \; \; Алгоритм$$</Latex>
          <div className="rescell">
            <div className="algonum"><Latex>$$1.$$</Latex></div>
            <div className="algores"><Latex>Apl (w)</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent1")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$2.$$</Latex></div>
            <div className="algores"><Latex>Bpl</Latex></div>
            <div className="resarea">
              <textarea ref={res2} style={{height: "30px", width: "200px", resize: "none"}}></textarea>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$3.$$</Latex></div>
            <div className="algores"><Latex>v (w)</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent2")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$4.$$</Latex></div>
            <div className="algores"><Latex>$$f_c (x, w)$$</Latex></div>
            <h5>{res4.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$5.$$</Latex></div>
            <div className="algores"><Latex>$$f_e (x, w)$$</Latex></div>
            <h5>{res5.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$6.$$</Latex></div>
            <div className="algores"><Latex>Kxl (x, w)</Latex></div>
            <h5>{res6.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$7.$$</Latex></div>
            <div className="algores"><Latex>Kx (x, w)</Latex></div>
            <h5>{res7.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$8.$$</Latex></div>
            <div className="algores"><Latex>{K_pnorm}</Latex></div>
            <h5>{res8.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$9.$$</Latex></div>
            <div className="algores"><Latex>{K_px}</Latex></div>
            <h5>{res9.current}</h5>
          </div>
        </div>
      </div>
      <div className="modal" onClick={e => handleHideModal(e)} style={{display: "none"}}>
        <div className="modalcontent1" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res1} style={{height: "100px", width: "400px", resize: "none"}}></textarea>
        </div>
        <div className="modalcontent2" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res3} style={{height: "50px", width: "400px", resize: "none"}}></textarea>
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

  const argsUrl = "http://localhost:8000/api/model_2_args/";
  const modelUrl = "http://localhost:8000/api/model_2/";

  const S_x = useRef();
  const L_bu = useRef();
  const L_conic = useRef();
  const Yu = useRef();
  const mu = useRef();
  const D_bu = useRef();
  const L_ck = useRef();
  const W12_average = useRef();
  const P12_average = useRef();

  const res1 = useRef();
  const res2 = useRef();
  const res3 = useRef();
  const res4 = useRef();
  const res5 = useRef();
  const res6 = useRef();
  const res7 = useRef();
  const res8 = useRef();
  const Args = useRef();
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
          if (res.data.length > 1)
            setWarnOldParams(true);
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
          res1.current = data.aHC;
          res2.current = data.Ge;
          res3.current = data.Ybu1W_res;
          res4.current= data.Ybu2W_res;
          res5.current = data.YbuW_res;
          res6.current = data.MpW;
          res7.current = data.yBU_res;
          res8.current.value = data.yBUd_j;
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
          S_x.current.value = data.S_x;
          L_bu.current.value = data.L_bu;
          L_conic.current.value = data.L_conic;
          Yu.current.value = data.Yu;
          mu.current.value = data.mu;
          D_bu.current.value = data.D_bu;
          L_ck.current.value = data.L_ck;
          W12_average.current.checked = data.W12_average;
          P12_average.current.checked = data.P12_average;
        }
      })
      .catch(err => console.warn(err))
  }, [])

  const ArgsSubmit = async () => {

    if (!(S_x.current.value &&
      L_bu.current.value &&
      L_conic.current.value &&
      Yu.current.value &&
      mu.current.value &&
      D_bu.current.value &&
      L_ck.current.value)
    ) {
      alert("Введите все необходимые параметры!");
      return;
    }
    if (!window.confirm("Сохранить введенные параметры?")) return;

    await axios
      .post(argsUrl, {
        S_x: S_x.current.value,
        L_bu: L_bu.current.value,
        L_conic: L_conic.current.value,
        Yu: Yu.current.value,
        mu: mu.current.value,
        D_bu: D_bu.current.value,
        L_ck: L_ck.current.value,
        W12_average: W12_average.current.checked,
        P12_average: P12_average.current.checked,
      })
      .then(res => {
        console.log("Model_2_args: Новые параметры загружены.");
        Args.current = res.data.id;
        setWarnOldParams(true);
      })
      .catch(err => console.warn(err))
  }

  const handleCalc = async () => {

    if (!window.confirm("Запустить вычисления?")) return;

    await axios
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          if (+S_x.current.value !== data.S_x ||
            +L_bu.current.value !== data.L_bu ||
            +L_conic.current.value !== data.L_conic ||
            +Yu.current.value !== data.Yu ||
            +mu.current.value !== data.mu ||
            +D_bu.current.value !== data.D_bu ||
            +L_ck.current.value !== data.L_ck ||
            W12_average.current.checked !== data.W12_average ||
            P12_average.current.checked !== data.P12_average
          ) {
            if (!window.confirm("Новые параметры не сохранены. " +
              "Модель будет рассчитана на основе старых данных. " +
              "Использовать новые параметры?"))
              alert("Вычисления будут происходить со старыми параметрами!");
            else
              await ArgsSubmit();
          }
        }
        else await ArgsSubmit();
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
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          for (let i of res.data.slice(0, res.data.length - 1))
            await axios.delete(argsUrl + i.id);
        }
        console.log("Model_2_args: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .get(modelUrl)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(modelUrl + i.id);
        }
        console.log("Model_2: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .post(modelUrl, {
        args: Args.current,
        csv: Csv.current,
      })
      .then(res => {
        console.log("Model_2: Вычисления прошли успешно.");
        alert("Вычисления прошли успешно.");
        setModelExist(true);
        setWarnOldParams(false);
        if (!alert("Вычисления прошли успешно."))
          window.location.reload();
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
      <h2 style={{textDecoration: "underline"}}>2. Профиль валков (по Целикову) изгиб валков</h2>
      <div className="leftSide">
        <div className="modelinputswindow">
          <h1 >Задаваемые пользователями параметры:</h1>
          <div className="modelinputs">
            <div className="inputcell">
              <Latex>$$S_x$$</Latex>
              <input type="number" ref={S_x} id="S_x_input"/>
            </div>
            <div className="inputcell">
              <Latex>{L_buShow}</Latex>
              <input type="number" ref={L_bu} id="L_bu_input"/>
            </div>
            <div className="inputcell">
              <Latex>{L_conicShow}</Latex>
              <input type="number" ref={L_conic} id="L_conic_input"/>
            </div>
            <div className="inputcell">
              <Latex>Yu</Latex>
              <input type="number" ref={Yu} id="Yu_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$\mu$$</Latex>
              <input type="number" ref={mu} id="mu_input"/>
            </div>
            <div className="inputcell">
              <Latex>{D_buShow}</Latex>
              <input type="number" ref={D_bu} id="D_bu_input"/>
            </div>
            <div className="inputcell">
              <Latex>{L_ckShow}</Latex>
              <input type="number" ref={L_ck} id="L_ck_input"/>
            </div>
            <div className="inputcell">
              <Latex>{W12_averageShow}</Latex>
              <input type="checkbox" ref={W12_average} id="W12_average_input"/>
            </div>
            <div className="inputcell">
              <Latex>{P12_averageShow}</Latex>
              <input type="checkbox" ref={P12_average} id="P12_average_input"/>
            </div>
          </div>
          <div className='inputbuttons'>
            <button className="saveinputs" onClick={() => ArgsSubmit()}>Сохранить</button>
            <button className="loadmodel" onClick={() => handleCalc()}>Вычислить</button>
          </div>
        </div>
        <CsvLoader/>
      </div>
      <div className="modelresultswindow">
        <h1>Результаты вычислений:</h1>
        {warnOldParams && modelExist && <p className="warningresults">⚠ Модель рассчитана на основе старых данных!</p>}
        {!modelExist && <p className="warningresults">⚠ Сначала нажмите кнопку "Вычислить".</p>}
        <div className="results" style={{display: modelExist ? "grid" : "none"}}>
          <Latex>$$№ \; \; Алгоритм$$</Latex>
          <div className="rescell">
            <div className="algonum"><Latex>$$1.$$</Latex></div>
            <div className="algores"><Latex>aHC</Latex></div>
            <h5>{res1.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$2.$$</Latex></div>
            <div className="algores"><Latex>Ge</Latex></div>
            <h5>{res2.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$3.$$</Latex></div>
            <div className="algores"><Latex>Ybu1W (P)</Latex></div>
            <h5>{res3.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$4.$$</Latex></div>
            <div className="algores"><Latex>Ybu2W (P)</Latex></div>
            <h5>{res4.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$5.$$</Latex></div>
            <div className="algores"><Latex>YbuW (P)</Latex></div>
            <h5>{res5.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$6.$$</Latex></div>
            <div className="algores"><Latex>MpW</Latex></div>
            <h5>{res6.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$7.$$</Latex></div>
            <div className="algores"><Latex>yBU (z)</Latex></div>
            <h5>{res7.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$8.$$</Latex></div>
            <div  className="algores"><Latex>$$yBUD_j$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent8")}>Показать массив</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" onClick={e => handleHideModal(e)} style={{display: "none"}}>
        <div className="modalcontent8" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res8} style={{height: "400px", width: "800px", resize: "none"}}></textarea>
        </div>
      </div>
    </div>
  );
}

const Model3 = () => {

  const argsUrl = "http://localhost:8000/api/model_3_args/";
  const modelUrl = "http://localhost:8000/api/model_3/";

  const b1 = useRef();
  const b2 = useRef();
  const b3 = useRef();
  const z = useRef();
  const sh = useRef();

  const res1 = useRef();
  const res2 = useRef();
  const res3 = useRef();
  const Args = useRef();
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
          if (res.data.length > 1)
            setWarnOldParams(true);
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
          res1.current = data.uTc_res;
          res2.current = data.uBc_res;
          res3.current = data.uGc0;
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
          b1.current.value = data.b1;
          b2.current.value = data.b2;
          b3.current.value = data.b3;
          z.current.value = data.z;
          sh.current.value = data.sh;
        }
      })
      .catch(err => console.warn(err))

  }, [])

  const ArgsSubmit = async () => {

    if (!(b1.current.value &&
      b2.current.value &&
      b3.current.value &&
      z.current.value &&
      sh.current.value)
    ) {
      alert("Введите все необходимые параметры!");
      return;
    }
    if (!window.confirm("Сохранить введенные параметры?")) return;

    await axios
      .post(argsUrl, {
        b1: b1.current.value,
        b2: b2.current.value,
        b3: b3.current.value,
        z: z.current.value,
        sh: sh.current.value,
      })
      .then(res => {
        console.log("Model_3_args: Новые параметры загружены.");
        Args.current = res.data.id;
        setWarnOldParams(true);
      })
      .catch(err => console.warn(err))
  }

  const handleCalc = async () => {

    if (!window.confirm("Запустить вычисления?")) return;

    await axios
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          if (+b1.current.value !== data.b1 ||
            +b2.current.value !== data.b2 ||
            +b3.current.value !== data.b3 ||
            +z.current.value !== data.z ||
            +sh.current.value !== data.sh
          ) {
            if (!window.confirm("Новые параметры не сохранены. " +
              "Модель будет рассчитана на основе старых данных. " +
              "Использовать новые параметры?"))
              alert("Вычисления будут происходить со старыми параметрами!");
            else
              await ArgsSubmit();
          }
        }
        else await ArgsSubmit();
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
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          for (let i of res.data.slice(0, res.data.length - 1))
            await axios.delete(argsUrl + i.id);
        }
        console.log("Model_3_args: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .get(modelUrl)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(modelUrl + i.id);
        }
        console.log("Model_3: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .post(modelUrl, {
        args: Args.current,
        csv: Csv.current,
      })
      .then(res => {
        console.log("Model_3: Вычисления прошли успешно.");
        alert("Вычисления прошли успешно.");
        setModelExist(true);
        setWarnOldParams(false);
        if (!alert("Вычисления прошли успешно."))
          window.location.reload();
      })
      .catch(err => console.warn(err))

  }

  return (
    <div className="modelwindow">
      <h2 style={{textDecoration: "underline"}}>3. Смещение валков от (оси полосы или начального положения)</h2>
      <div className="leftSide">
        <div className="modelinputswindow">
          <h1>Задаваемые пользователями параметры:</h1>
          <div className="modelinputs">
            <div className="inputcell">
              <Latex>$$b_1$$</Latex>
              <input type="number" ref={b1} id="b1_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$b_2$$</Latex>
              <input type="number" ref={b2} id="b2_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$b_3$$</Latex>
              <input type="number" ref={b3} id="b3_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$z$$</Latex>
              <input type="number" ref={z} id="z_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$sh$$</Latex>
              <input type="number" ref={sh} id="sh_input"/>
            </div>
          </div>
          <div className='inputbuttons'>
            <button className="saveinputs" onClick={() => ArgsSubmit()}>Сохранить</button>
            <button className="loadmodel" onClick={() => handleCalc()}>Вычислить</button>
          </div>
        </div>
        <CsvLoader/>
      </div>
      <div className="modelresultswindow">
        <h1>Результаты вычислений:</h1>
        {warnOldParams && modelExist && <p className="warningresults">⚠ Модель рассчитана на основе старых данных!</p>}
        {!modelExist && <p className="warningresults">⚠ Сначала нажмите кнопку "Вычислить".</p>}
        <div className="results" style={{display: modelExist ? "grid" : "none"}}>
          <Latex>$$№ \; \; Алгоритм$$</Latex>
          <div className="rescell">
            <div className="algonum"><Latex>$$1.$$</Latex></div>
            <div className="algores"><Latex>uTc (z)</Latex></div>
            <h5>{res1.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$2.$$</Latex></div>
            <div className="algores"><Latex>uBc (z)</Latex></div>
            <h5>{res2.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$3.$$</Latex></div>
            <div className="algores"><Latex>uGc0 (z, sh)</Latex></div>
            <h5>{res3.current}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

const Model4 = () => {
  const L_wrShow = "$$L_{wr}$$";
  const Sh12_averageShow = "$$Sh12_{average}$$";

  const argsUrl = "http://localhost:8000/api/model_4_args/";
  const modelUrl = "http://localhost:8000/api/model_4/";

  const L_wr = useRef();
  const S_x = useRef();
  const Sh12_average = useRef();

  const res1 = useRef();
  const res2 = useRef();
  const res3 = useRef();
  const res4 = useRef();
  const res5 = useRef();
  const res6 = useRef();
  const res7 = useRef();
  const res8 = useRef();
  const res9 = useRef();
  const res10 = useRef();
  const res11 = useRef();
  const res12 = useRef();
  const Args = useRef();
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
          if (res.data.length > 1)
            setWarnOldParams(true);
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
          res1.current = data.pTg1_res;
          res2.current = data.pTw1_res;
          res3.current = data.pBg_res;
          res4.current= data.pBw_res;
          res5.current = data.pTg_res;
          res6.current = data.pTw_res;
          res7.current = data.uGg0_res;
          res8.current = data.uGg_res;
          res9.current = data.Cr_res;
          res10.current = data.Cr0;
          res11.current = data.yG_res;
          res12.current.value = data.yGd;
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
          L_wr.current.value = data.L_wr;
          S_x.current.value = data.S_x;
          Sh12_average.current.checked = data.Sh12_average;
        }
      })
      .catch(err => console.warn(err))

  }, [])

  const ArgsSubmit = async () => {

    if (!(L_wr.current.value &&
      S_x.current.value)
    ) {
      alert("Введите все необходимые параметры!");
      return;
    }
    if (!window.confirm("Сохранить введенные параметры?")) return;

    await axios
      .post(argsUrl, {
        L_wr: L_wr.current.value,
        S_x: S_x.current.value,
        Sh12_average: Sh12_average.current.checked,
      })
      .then(res => {
        console.log("Model_4_args: Новые параметры загружены.");
        Args.current = res.data.id;
        setWarnOldParams(true);
      })
      .catch(err => console.warn(err))
  }

  const handleCalc = async () => {

    if (!window.confirm("Запустить вычисления?")) return;

    await axios
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          if (+L_wr.current.value !== data.L_wr ||
            +S_x.current.value !== data.S_x ||
            Sh12_average.current.checked !== data.Sh12_average
          ) {
            if (!window.confirm("Новые параметры не сохранены. " +
              "Модель будет рассчитана на основе старых данных. " +
              "Использовать новые параметры?"))
              alert("Вычисления будут происходить со старыми параметрами!");
            else
              await ArgsSubmit();
          }
        }
        else await ArgsSubmit();
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
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          for (let i of res.data.slice(0, res.data.length - 1))
            await axios.delete(argsUrl + i.id);
        }
        console.log("Model_4_args: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .get(modelUrl)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(modelUrl + i.id);
        }
        console.log("Model_4: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .post(modelUrl, {
        args: Args.current,
        csv: Csv.current,
      })
      .then(res => {
        console.log("Model_4: Вычисления прошли успешно.");
        alert("Вычисления прошли успешно.");
        setModelExist(true);
        setWarnOldParams(false);
        if (!alert("Вычисления прошли успешно."))
          window.location.reload();
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
      <h2 style={{textDecoration: "underline"}}>4. Зазор (исходный)</h2>
      <div className="leftSide">
        <div className="modelinputswindow">
          <h1>Задаваемые пользователями параметры:</h1>
          <div className="modelinputs">
            <div className="inputcell">
              <Latex>{L_wrShow}</Latex>
              <input type="number" ref={L_wr} id="L_wr_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$S_x$$</Latex>
              <input type="number" ref={S_x} id="S_x_input"/>
            </div>
            <div className="inputcell">
              <Latex>{Sh12_averageShow}</Latex>
              <input type="checkbox" ref={Sh12_average} id="Sh12_average_input"/>
            </div>
          </div>
          <div className='inputbuttons'>
            <button className="saveinputs" onClick={() => ArgsSubmit()}>Сохранить</button>
            <button className="loadmodel" onClick={() => handleCalc()}>Вычислить</button>
          </div>
        </div>
        <CsvLoader/>
      </div>
      <div className="modelresultswindow">
        <h1>Результаты вычислений:</h1>
        {warnOldParams && modelExist && <p className="warningresults">⚠ Модель рассчитана на основе старых данных!</p>}
        {!modelExist && <p className="warningresults">⚠ Сначала нажмите кнопку "Вычислить".</p>}
        <div className="results" style={{display: modelExist ? "grid" : "none"}}>
          <Latex>$$№ \; \; Алгоритм$$</Latex>
          <div className="rescell">
            <div className="algonum"><Latex>$$1.$$</Latex></div>
            <div className="algores"><Latex>pTg1 (x)</Latex></div>
            <h5>{res1.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$2.$$</Latex></div>
            <div className="algores"><Latex>pTw1 (x)</Latex></div>
            <h5>{res2.current ? res2.current : "None"}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$3.$$</Latex></div>
            <div className="algores"><Latex>pBg (x)</Latex></div>
            <h5>{res3.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$4.$$</Latex></div>
            <div className="algores"><Latex>pBw (x)</Latex></div>
            <h5>{res4.current ? res4.current : "None"}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$5.$$</Latex></div>
            <div className="algores"><Latex>pTg (z)</Latex></div>
            <h5>{res5.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$6.$$</Latex></div>
            <div className="algores"><Latex>pTw (z)</Latex></div>
            <h5>{res6.current ? res6.current : "None"}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$7.$$</Latex></div>
            <div className="algores"><Latex>uGg0 (z, sh)</Latex></div>
            <h5>{res7.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$8.$$</Latex></div>
            <div className="algores"><Latex>uGg (z, sh)</Latex></div>
            <h5>{res8.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$9.$$</Latex></div>
            <div className="algores"><Latex>Cr (sh)</Latex></div>
            <h5>{res9.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$10.$$</Latex></div>
            <div className="algores"><Latex>Cr0</Latex></div>
            <h5>{res10.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$11.$$</Latex></div>
            <div className="algores"><Latex>yG (z)</Latex></div>
            <h5>{res11.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$12.$$</Latex></div>
            <div  className="algores"><Latex>$$yGd_j$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent12")}>Показать массив</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal" onClick={e => handleHideModal(e)} style={{display: "none"}}>
        <div className="modalcontent12" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res12} style={{height: "400px", width: "800px", resize: "none"}}></textarea>
        </div>
      </div>
    </div>
  );
}

const Model5 = () =>  {
  const W12_averageShow = "$$W12_{average}$$";

  const argsUrl = "http://localhost:8000/api/model_5_args/";
  const modelUrl = "http://localhost:8000/api/model_5/";

  const x = useRef();
  const sh = useRef();
  const S_x = useRef();
  const W12_average = useRef();
  const model4 = useRef();

  const res1 = useRef();
  const res2 = useRef();
  const Args = useRef();
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
          if (res.data.length > 1)
            setWarnOldParams(true);
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

    axios
      .get("http://localhost:8000/api/model_4/")
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          model4.current = data.id;
          if (data.args === null || data.csv === null)
            setWarnOldParams(true);
        }
      })
      .catch(err => console.warn(err))

    axios
      .get("http://localhost:8000/api/model_4_args/")
      .then(res => {
        if (res.data.length > 1)
          setWarnOldParams(true);
      })
      .catch(err => console.warn(err))

    axios
      .get("http://localhost:8000/api/model_5_args/")
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          if (data.model4 === null)
            setWarnOldParams(true);
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
          res1.current = data.uGw_res;
          res2.current = data.delta_yG;
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
          sh.current.value = data.sh;
          S_x.current.value = data.S_x;
          W12_average.current.checked = data.W12_average;
        }
      })
      .catch(err => console.warn(err))

  }, [])

  const ArgsSubmit = async () => {

    if (!(x.current.value &&
      sh.current.value &&
      S_x.current.value)
    ) {
      alert("Введите все необходимые параметры!");
      return;
    }
    if (!window.confirm("Сохранить введенные параметры?")) return;

    await axios
      .post(argsUrl, {
        x: x.current.value,
        sh: sh.current.value,
        S_x: S_x.current.value,
        W12_average: W12_average.current.checked,
        model4: model4.current,
      })
      .then(res => {
        console.log("Model_5_args: Новые параметры загружены.");
        Args.current = res.data.id;
        setWarnOldParams(true);
      })
      .catch(err => console.warn(err))
  }

  const handleCalc = async () => {

    if (!window.confirm("Запустить вычисления?")) return;

    await axios
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          if (+x.current.value !== data.x ||
            +sh.current.value !== data.sh ||
            +S_x.current.value !== data.S_x ||
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
        else await ArgsSubmit();
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
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          for (let i of res.data.slice(0, res.data.length - 1))
            await axios.delete(argsUrl + i.id);
        }
        console.log("Model_5_args: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          await axios.put(argsUrl + data.id + "/", {
            x: data.x,
            sh: data.sh,
            S_x: data.S_x,
            W12_average: data.W12_average,
            model4: model4.current,
          })
            .then(res => {
              console.log(res);
              console.log("Model_5_args: model4 добавлена/обновлена.");
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => console.warn(err))

    await axios
      .get(modelUrl)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(modelUrl + i.id);
        }
        console.log("Model_5: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .post(modelUrl, {
        args: Args.current,
        csv: Csv.current,
      })
      .then(res => {
        console.log("Model_5: Вычисления прошли успешно.");
        alert("Вычисления прошли успешно.");
        setModelExist(true);
        setWarnOldParams(false);
        if (!alert("Вычисления прошли успешно."))
          window.location.reload();
      })
      .catch(err => console.warn(err))

  }

  return (
    <div className="modelwindow">
      <h2 style={{textDecoration: "underline"}}>5. Износ профиля валков</h2>
      <div className="leftSide">
        <div className="modelinputswindow">
          <h1>Задаваемые пользователями параметры:</h1>
          <div className="modelinputs">
            <div className="inputcell">
              <Latex>$$x$$</Latex>
              <input type="number" ref={x} id="x_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$sh$$</Latex>
              <input type="number" ref={sh} id="sh_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$S_x$$</Latex>
              <input type="number" ref={S_x} id="S_x_input"/>
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
        <CsvLoader/>
      </div>
      <div className="modelresultswindow">
        <h1>Результаты вычислений:</h1>
        {warnOldParams && modelExist && <p className="warningresults">⚠ Модель рассчитана на основе старых данных!</p>}
        {!modelExist && <p className="warningresults">⚠ Сначала нажмите кнопку "Вычислить".</p>}
        <div className="results" style={{display: modelExist ? "grid" : "none"}}>
          <Latex>$$№ \; \; Алгоритм$$</Latex>
          <div className="rescell">
            <div className="algonum"><Latex>$$1.$$</Latex></div>
            <div className="algores"><Latex>uGw (x, sh)</Latex></div>
            <h5>{res1.current ? res1.current : "None"}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$2.$$</Latex></div>
            <div className="algores"><Latex>$$\Delta yG$$</Latex></div>
            <h5>{res2.current}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

const Model6 = () => {
  const L_wrShow = "$$L_{wr}$$";

  const argsUrl = "http://localhost:8000/api/model_6_args/";
  const modelUrl = "http://localhost:8000/api/model_6/";

  const L_wr = useRef();
  const z = useRef();
  const model4 = useRef();

  const res1 = useRef();
  const res2 = useRef();
  const res3 = useRef();
  const res4 = useRef();
  const res5 = useRef();
  const res6 = useRef();
  const Args = useRef();
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
          if (res.data.length > 1)
            setWarnOldParams(true);
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

    axios
      .get("http://localhost:8000/api/model_4/")
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          model4.current = data.id;
          if (data.args === null || data.csv === null)
            setWarnOldParams(true);
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
          res1.current = data.wT1_res;
          res2.current = data.wT_res;
          res3.current = data.wB1_res;
          res4.current = data.wB_res;
          res5.current = data.wG1_res;
          res6.current = data.wG_res;
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
          L_wr.current.value = data.L_wr;
          z.current.value = data.z;
        }
      })
      .catch(err => console.warn(err))

  }, [])

  const ArgsSubmit = async () => {

    if (!(L_wr.current.value &&
      z.current.value)
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
        console.log("Model_6_args: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .post(argsUrl, {
        L_wr: L_wr.current.value,
        z: z.current.value,
        model4: model4.current,
      })
      .then(res => {
        console.log("Model_6_args: Новые параметры загружены.");
        Args.current = res.data.id;
        setWarnOldParams(true);
      })
      .catch(err => console.warn(err))
  }

  const handleCalc = async () => {

    if (!window.confirm("Запустить вычисления?")) return;

    await axios
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          if (+L_wr.current.value !== data.L_wr ||
            +z.current.value !== data.z
          ) {
            if (!window.confirm("Новые параметры не сохранены. " +
              "Модель будет рассчитана на основе старых данных. " +
              "Использовать новые параметры?"))
              alert("Вычисления будут происходить со старыми параметрами!");
            else
              await ArgsSubmit();
          }
        }
        else await ArgsSubmit();
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
        console.log("Model_6: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .post(modelUrl, {
        args: Args.current,
        csv: Csv.current,
      })
      .then(res => {
        console.log("Model_6: Вычисления прошли успешно.");
        alert("Вычисления прошли успешно.");
        setModelExist(true);
        setWarnOldParams(false);
        if (!alert("Вычисления прошли успешно."))
          window.location.reload();
      })
      .catch(err => console.warn(err))

  }

  return (
    <div className="modelwindow">
      <h2 style={{textDecoration: "underline"}}>6. Износ + зазоры</h2>
      <div className="leftSide">
        <div className="modelinputswindow">
          <h1>Задаваемые пользователями параметры:</h1>
          <div className="modelinputs">
            <div className="inputcell">
              <Latex>{L_wrShow}</Latex>
              <input type="number" ref={L_wr} id="L_wr_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$z$$</Latex>
              <input type="number" ref={z} id="z_input"/>
            </div>
          </div>
          <div className='inputbuttons'>
            <button className="saveinputs" onClick={() => ArgsSubmit()}>Сохранить</button>
            <button className="loadmodel" onClick={() => handleCalc()}>Вычислить</button>
          </div>
        </div>
        <CsvLoader/>
      </div>
      <div className="modelresultswindow">
        <h1>Результаты вычислений:</h1>
        {warnOldParams && modelExist && <p className="warningresults">⚠ Модель рассчитана на основе старых данных!</p>}
        {!modelExist && <p className="warningresults">⚠ Сначала нажмите кнопку "Вычислить".</p>}
        <div className="results" style={{display: modelExist ? "grid" : "none"}}>
          <Latex>$$№ \; \; Алгоритм$$</Latex>
          <div className="rescell">
            <div className="algonum"><Latex>$$1.$$</Latex></div>
            <div className="algores"><Latex>wT1 (z)</Latex></div>
            <h5>{res1.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$2.$$</Latex></div>
            <div className="algores"><Latex>wT (z)</Latex></div>
            <h5>{res2.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$3.$$</Latex></div>
            <div className="algores"><Latex>wB1 (z)</Latex></div>
            <h5>{res3.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$4.$$</Latex></div>
            <div className="algores"><Latex>wB (z)</Latex></div>
            <h5>{res4.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$5.$$</Latex></div>
            <div className="algores"><Latex>wG1 (x)</Latex></div>
            <h5>{res5.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$6.$$</Latex></div>
            <div className="algores"><Latex>wG (z)</Latex></div>
            <h5>{res5.current}</h5>
          </div>
        </div>
      </div>
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

  const R_wo = "$$R_{w0}$$";

  const argsUrl = "http://localhost:8000/api/model_7_args/";
  const modelUrl = "http://localhost:8000/api/model_7/";

  const M_x = useRef();
  const T_sc = useRef();
  const T_se = useRef();
  const T_re = useRef();
  const T_cool = useRef();
  const L_wr = useRef();
  const S_x = useRef();
  const K_expan = useRef();
  const W12_average = useRef();
  const D12bot_average = useRef();
  const D12top_average = useRef();

  const res1 = useRef();
  const res2 = useRef();
  const res3 = useRef();
  const res4 = useRef();
  const res5 = useRef();
  const res6 = useRef();
  const res7 = useRef();
  const res8 = useRef();
  const res9 = useRef();
  const res10 = useRef();
  const res11 = useRef();
  const res12 = useRef();
  const res13 = useRef();
  const res14 = useRef();
  const res15 = useRef();
  const res16 = useRef();
  const Args = useRef();
  const Csv = useRef();
  const [modelExist, setModelExist] = useState(false);
  const [warnOldParams, setWarnOldParams] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  useEffect(() => {

    axios
      .get(argsUrl)
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          Args.current = data.id;
          if (res.data.length > 1)
            setWarnOldParams(true);
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
          res1.current = data.K_c;
          res2.current = data.uc_res;
          res3.current = data.K_e;
          res4.current= data.ue_res;
          res5.current = data.Tsu_res;
          res6.current = data.Tsu1_res;
          res7.current = data.Tsurf_res;
          res8.current = data.R_w0;
          res9.current = data.Trz_res;
          res10.current = data.Tz_res;
          res11.current.value = data.Tzz_j;
          res12.current.value = data.Tza_j;
          res13.current.value = data.Tsud_j;
          res14.current = data.delta_Tws;
          res15.current.value = data.delta_Dtd_j;
          res16.current = data.delta_DtW;
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
          M_x.current.value = data.M_x;
          T_sc.current.value = data.T_sc;
          T_se.current.value = data.T_se;
          T_re.current.value = data.T_re;
          T_cool.current.value = data.T_cool;
          L_wr.current.value = data.L_wr;
          S_x.current.value = data.S_x;
          K_expan.current.value = data.K_expan;
          W12_average.current.checked = data.W12_average;
          D12bot_average.current.checked = data.D12bot_average;
          D12top_average.current.checked = data.D12top_average;
        }
      })
      .catch(err => console.warn(err))
  }, [])

  const ArgsSubmit = async () => {

    if (!(M_x.current.value &&
      T_sc.current.value &&
      T_se.current.value &&
      T_re.current.value &&
      T_cool.current.value &&
      L_wr.current.value &&
      S_x.current.value &&
      K_expan.current.value)
    ) {
      alert("Введите все необходимые параметры!");
      return;
    }
    if (!window.confirm("Сохранить введенные параметры?")) return;

    await axios
      .post(argsUrl, {
        M_x: M_x.current.value,
        T_sc: T_sc.current.value,
        T_se: T_se.current.value,
        T_re: T_re.current.value,
        T_cool: T_cool.current.value,
        L_wr: L_wr.current.value,
        S_x: S_x.current.value,
        K_expan: K_expan.current.value,
        W12_average: W12_average.current.checked,
        D12bot_average: D12bot_average.current.checked,
        D12top_average: D12top_average.current.checked,
      })
      .then(res => {
        console.log("Model_7_args: Новые параметры загружены.");
        Args.current = res.data.id;
        setWarnOldParams(true);
      })
      .catch(err => console.warn(err))
  }

  const handleCalc = async () => {

    if (!window.confirm("Запустить вычисления?")) return;

    await axios
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          if (+M_x.current.value !== data.M_x ||
            +T_sc.current.value !== data.T_sc ||
            +T_se.current.value !== data.T_se ||
            +T_re.current.value !== data.T_re ||
            +T_cool.current.value !== data.T_cool ||
            +L_wr.current.value !== data.L_wr ||
            +S_x.current.value !== data.S_x ||
            +K_expan.current.value !== data.K_expan ||
            W12_average.current.checked !== data.W12_average ||
            D12bot_average.current.checked !== data.D12bot_average ||
            D12top_average.current.checked !== data.D12top_average
          ) {
            if (!window.confirm("Новые параметры не сохранены. " +
              "Модель будет рассчитана на основе старых данных. " +
              "Использовать новые параметры?"))
              alert("Вычисления будут происходить со старыми параметрами!");
            else
              await ArgsSubmit();
          }
        }
        else await ArgsSubmit();
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
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          for (let i of res.data.slice(0, res.data.length - 1))
            await axios.delete(argsUrl + i.id);
        }
        console.log("Model_7_args: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .get(modelUrl)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(modelUrl + i.id);
        }
        console.log("Model_7: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    setModelLoading(true);

    await axios
      .post(modelUrl, {
        args: Args.current,
        csv: Csv.current,
      })
      .then(res => {
        console.log("Model_7: Вычисления прошли успешно.");
        setModelExist(true);
        setWarnOldParams(false);
        if (!alert("Вычисления прошли успешно."))
          window.location.reload();
      })
      .catch(err => console.warn(err))

    setModelLoading(false);

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
      <h2 style={{textDecoration: "underline"}}>7. Модель распределения температур в валке</h2>
      <div className="leftSide">
        <div className="modelinputswindow">
          <h1>Задаваемые пользователями параметры:</h1>
          <div className="modelinputs">
            <div className="inputcell">
              <Latex>$$M_x$$</Latex>
              <input type="number" ref={M_x} id="M_x_input"/>
            </div>
            <div className="inputcell">
              <Latex>{T_scShow}</Latex>
              <input type="number" ref={T_sc} id="T_sc_input"/>
            </div>
            <div className="inputcell">
              <Latex>{T_seShow}</Latex>
              <input type="number" ref={T_se} id="T_se_input"/>
            </div>
            <div className="inputcell">
              <Latex>{T_reShow}</Latex>
              <input type="number" ref={T_re} id="T_re_input"/>
            </div>
            <div className="inputcell">
              <Latex>{T_coolShow}</Latex>
              <input type="number" ref={T_cool} id="T_cool_input"/>
            </div>
            <div className="inputcell">
              <Latex>{L_wrShow}</Latex>
              <input type="number" ref={L_wr} id="L_wr_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$S_x$$</Latex>
              <input type="number" ref={S_x} id="S_x_input"/>
            </div>
            <div className="inputcell">
              <Latex>{K_expanShow}</Latex>
              <input type="number" ref={K_expan} id="K_expan_input"/>
            </div>
            <div className="inputcell">
              <Latex>{W12_averageShow}</Latex>
              <input type="checkbox" ref={W12_average} id="W12_average_input"/>
            </div>
            <div className="inputcell">
              <Latex>{D12bot_averageShow}</Latex>
              <input type="checkbox" ref={D12bot_average} id="D12bot_average_input"/>
            </div>
            <div className="inputcell">
              <Latex>{D12top_averageShow}</Latex>
              <input type="checkbox" ref={D12top_average} id="D12top_average_input"/>
            </div>
          </div>
          <div className='inputbuttons'>
            <button className="saveinputs" onClick={() => ArgsSubmit()}>Сохранить</button>
            <button className="loadmodel" onClick={() => handleCalc()}>Вычислить</button>
          </div>
        </div>
        <CsvLoader/>
      </div>
      <div className="modelresultswindow">
        <h1>Результаты вычислений:</h1>
        {warnOldParams && modelExist && <p className="warningresults">⚠ Модель рассчитана на основе старых данных!</p>}
        {!modelExist && <p className="warningresults">⚠ Сначала нажмите кнопку "Вычислить".</p>}
        <div className="loadSpinner" style={{display: modelLoading? "grid" : "none"}}>
          <Oval color="#000000" secondaryColor="#bfbfbf" height={50} width={50} strokeWidth={1} strokeWidthSecondary={1}/>
          <h1>Идут вычисления, подождите...</h1>
        </div>
        <div className="results" style={{display: modelExist ? "grid" : "none"}}>
          <Latex>$$№ \; \; Алгоритм$$</Latex>
          <div className="rescell">
            <div className="algonum"><Latex>$$1.$$</Latex></div>
            <div className="algores"><Latex>$$K_c$$</Latex></div>
            <h5>{res1.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$2.$$</Latex></div>
            <div className="algores"><Latex>uc (x)</Latex></div>
            <h5>{res2.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$3.$$</Latex></div>
            <div className="algores"><Latex>$$K_e$$</Latex></div>
            <h5>{res3.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$4.$$</Latex></div>
            <div className="algores"><Latex>ue (x)</Latex></div>
            <h5>{res4.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$5.$$</Latex></div>
            <div className="algores"><Latex>Tsu (x)</Latex></div>
            <h5>{res5.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$6.$$</Latex></div>
            <div className="algores"><Latex>Tsu1 (x)</Latex></div>
            <h5>{res6.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$7.$$</Latex></div>
            <div className="algores"><Latex>Tsurf (x)</Latex></div>
            <h5>{res7.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$8.$$</Latex></div>
            <div className="algores"><Latex>{R_wo}</Latex></div>
            <h5>{res8.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$9.$$</Latex></div>
            <div className="algores"><Latex>Trz (r, z)</Latex></div>
            <h5>{res9.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$10.$$</Latex></div>
            <div className="algores"><Latex>Tz (z)</Latex></div>
            <h5>{res10.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$11.$$</Latex></div>
            <div className="algores"><Latex>$$Tzz_j$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent11")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$12.$$</Latex></div>
            <div className="algores"><Latex>$$Tza_j$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent12")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$13.$$</Latex></div>
            <div className="algores"><Latex>$$Tsud_j$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent13")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$14.$$</Latex></div>
            <div className="algores"><Latex>$$\delta Tws$$</Latex></div>
            <h5>{res14.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$15.$$</Latex></div>
            <div className="algores"><Latex>$$\delta Dtd_j$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent15")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$16.$$</Latex></div>
            <div className="algores"><Latex>$$\delta DtW$$</Latex></div>
            <h5>{res16.current}</h5>
          </div>
        </div>
      </div>
      <div className="modal" onClick={e => handleHideModal(e)} style={{display: "none"}}>
        <div className="modalcontent11" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res11} style={{height: "400px", width: "800px", resize: "none"}}></textarea>
        </div>
        <div className="modalcontent12" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res12} style={{height: "400px", width: "800px", resize: "none"}}></textarea>
        </div>
        <div className="modalcontent13" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res13} style={{height: "400px", width: "800px", resize: "none"}}></textarea>
        </div>
        <div className="modalcontent15" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res15} style={{height: "400px", width: "800px", resize: "none"}}></textarea>
        </div>
      </div>
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

  const argsUrl = "http://localhost:8000/api/model_8_args/";
  const modelUrl = "http://localhost:8000/api/model_8/";

  const Yu = useRef();
  const mu = useRef();
  const Ce = useRef();
  const S_x = useRef();
  const H12_average = useRef();
  const W12_average = useRef();
  const V11_average = useRef();
  const V12_average = useRef();
  const P12_average = useRef();
  const D12bot_average = useRef();
  const D12top_average = useRef();
  const model1 = useRef();
  const model2 = useRef();
  const model7 = useRef();

  const res1 = useRef();
  const res2 = useRef();
  const res3 = useRef();
  const res4 = useRef();
  const res5 = useRef();
  const res6 = useRef();
  const res7 = useRef();
  const res8 = useRef();
  const res9 = useRef();
  const res10 = useRef();
  const res11 = useRef();
  const res12 = useRef();
  const res13 = useRef();
  const res14 = useRef();
  const Args = useRef();
  const Csv = useRef();
  const [modelExist, setModelExist] = useState(false);
  const [warnOldParams, setWarnOldParams] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  useEffect(() => {

    axios
      .get(argsUrl)
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          Args.current = data.id;
          if (res.data.length > 1)
            setWarnOldParams(true);
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

    axios
      .get("http://localhost:8000/api/model_1/")
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          model1.current = data.id;
          if (data.args === null || data.csv === null)
            setWarnOldParams(true);
        }
      })
      .catch(err => console.warn(err))

    axios
      .get("http://localhost:8000/api/model_2/")
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          model2.current = data.id;
          if (data.args === null || data.csv === null)
            setWarnOldParams(true);
        }
      })
      .catch(err => console.warn(err))

    axios
      .get("http://localhost:8000/api/model_7/")
      .then(res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          model7.current = data.id;
          if (data.args === null || data.csv === null)
            setWarnOldParams(true);
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
          res1.current = data.Lambda;
          res2.current = data.Coef;
          res3.current = data.theta;
          res4.current = data.delta_h;
          res5.current = data.R_d_res;
          res6.current = data.R_c;
          res7.current = data.Lgap;
          res8.current = data.q_m;
          res9.current = data.qq_res;
          res10.current = data.xA;
          res11.current.value = data.y_i;
          res12.current.value = data.J_i;
          res13.current.value = data.delta_Df_i;
          res14.current.value = data.Mrs_i;
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
          Yu.current.value = data.Yu;
          mu.current.value = data.mu;
          Ce.current.value = data.Ce;
          S_x.current.value = data.S_x;
          H12_average.current.checked = data.H12_average;
          W12_average.current.checked = data.W12_average;
          V11_average.current.checked = data.V11_average;
          V12_average.current.checked = data.V12_average;
          P12_average.current.checked = data.P12_average;
          D12bot_average.current.checked = data.D12bot_average;
          D12top_average.current.checked = data.D12top_average;
        }
      })
      .catch(err => console.warn(err))

  }, [])

  const ArgsSubmit = async () => {

    if (!(Yu.current.value &&
      mu.current.value &&
      Ce.current.value &&
      S_x.current.value
    )
    ) {
      alert("Введите все необходимые параметры!");
      return;
    }
    if (!window.confirm("Сохранить введенные параметры?")) return;

    await axios
      .post(argsUrl, {
        Yu: Yu.current.value,
        mu: mu.current.value,
        Ce: Ce.current.value,
        S_x: S_x.current.value,
        H12_average: H12_average.current.checked,
        W12_average: W12_average.current.checked,
        V11_average: V11_average.current.checked,
        V12_average: V12_average.current.checked,
        P12_average: P12_average.current.checked,
        D12bot_average: D12bot_average.current.checked,
        D12top_average: D12top_average.current.checked,
        model1: model1.current,
        model2: model2.current,
        model7: model7.current,
      })
      .then(res => {
        console.log("Model_8_args: Новые параметры загружены.");
        Args.current = res.data.id;
        setWarnOldParams(true);
      })
      .catch(err => console.warn(err))
  }

  const handleCalc = async () => {

    if (!window.confirm("Запустить вычисления?")) return;

    await axios
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          const data = res.data[res.data.length - 1];
          if (+Yu.current.value !== data.Yu ||
            +mu.current.value !== data.mu ||
            +Ce.current.value !== data.Ce ||
            +S_x.current.value !== data.S_x ||
            H12_average.current.checked !== data.H12_average ||
            W12_average.current.checked !== data.W12_average ||
            V11_average.current.checked !== data.V11_average ||
            V12_average.current.checked !== data.V12_average ||
            P12_average.current.checked !== data.P12_average ||
            D12bot_average.current.checked !== data.D12bot_average ||
            D12top_average.current.checked !== data.D12top_average
          ) {
            if (!window.confirm("Новые параметры не сохранены. " +
              "Модель будет рассчитана на основе старых данных. " +
              "Использовать новые параметры?"))
              alert("Вычисления будут происходить со старыми параметрами!");
            else
              await ArgsSubmit();
          }
        }
        else await ArgsSubmit();
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
      .get(argsUrl)
      .then(async res => {
        if (res.data.length) {
          for (let i of res.data.slice(0, res.data.length - 1))
            await axios.delete(argsUrl + i.id);
        }
        console.log("Model_8_args: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    await axios
      .get(modelUrl)
      .then(res => {
        if (res.data.length) {
          for (let i of res.data)
            axios.delete(modelUrl + i.id);
        }
        console.log("Model_8: Старые параметры очищены.");
      })
      .catch(err => console.warn(err))

    setModelLoading(true);

    await axios
      .post(modelUrl, {
        args: Args.current,
        csv: Csv.current,
      })
      .then(res => {
        console.log("Model_8: Вычисления прошли успешно.");
        alert("Вычисления прошли успешно.");
        setModelExist(true);
        setWarnOldParams(false);
        if (!alert("Вычисления прошли успешно."))
          window.location.reload();
      })
      .catch(err => console.warn(err))

    setModelLoading(false);

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
      <h2 style={{textDecoration: "underline"}}>8. Растяжение (деформация) в валках</h2>
      <div className="leftSide">
        <div className="modelinputswindow">
          <h1>Задаваемые пользователями параметры:</h1>
          <div className="modelinputs">
            <div className="inputcell">
              <Latex>Yu</Latex>
              <input type="number" ref={Yu} id="Yu_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$\mu$$</Latex>
              <input type="number" ref={mu} id="mu_input"/>
            </div>
            <div className="inputcell">
              <Latex>Ce</Latex>
              <input type="number" ref={Ce} id="Ce_input"/>
            </div>
            <div className="inputcell">
              <Latex>$$S_x$$</Latex>
              <input type="number" ref={S_x} id="S_x_input"/>
            </div>
            <div className="inputcell">
              <Latex>{H12_averageShow}</Latex>
              <input type="checkbox" ref={H12_average} id="H12_average_input"/>
            </div>
            <div className="inputcell">
              <Latex>{W12_averageShow}</Latex>
              <input type="checkbox" ref={W12_average} id="W12_average_input"/>
            </div>
            <div className="inputcell">
              <Latex>{V11_averageShow}</Latex>
              <input type="checkbox" ref={V11_average} id="V11_average_input"/>
            </div>
            <div className="inputcell">
              <Latex>{V12_averageShow}</Latex>
              <input type="checkbox" ref={V12_average} id="V12_average_input"/>
            </div>
            <div className="inputcell">
              <Latex>{P12_averageShow}</Latex>
              <input type="checkbox" ref={P12_average} id="P12_average_input"/>
            </div>
            <div className="inputcell">
              <Latex>{D12bot_averageShow}</Latex>
              <input type="checkbox" ref={D12bot_average} id="D12bot_average_input"/>
            </div>
            <div className="inputcell">
              <Latex>{D12top_averageShow}</Latex>
              <input type="checkbox" ref={D12top_average} id="D12top_average_input"/>
            </div>
          </div>
          <div className='inputbuttons'>
            <button className="saveinputs" onClick={() => ArgsSubmit()}>Сохранить</button>
            <button className="loadmodel" onClick={() => handleCalc()}>Вычислить</button>
          </div>
        </div>
        <CsvLoader/>
      </div>
      <div className="modelresultswindow">
        <h1>Результаты вычислений:</h1>
        {warnOldParams && modelExist && <p className="warningresults">⚠ Модель рассчитана на основе старых данных!</p>}
        {!modelExist && <p className="warningresults">⚠ Сначала нажмите кнопку "Вычислить".</p>}
        <div className="loadSpinner" style={{display: modelLoading? "grid" : "none"}}>
          <Oval color="#000000" secondaryColor="#bfbfbf" height={50} width={50} strokeWidth={1} strokeWidthSecondary={1}/>
          <h1>Идут вычисления, подождите...</h1>
        </div>
        <div className="results" style={{display: modelExist ? "grid" : "none"}}>
          <Latex>$$№ \; \; Алгоритм$$</Latex>
          <div className="rescell">
            <div className="algonum"><Latex>$$1.$$</Latex></div>
            <div className="algores"><Latex>$$\lambda$$</Latex></div>
            <h5>{res1.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$2.$$</Latex></div>
            <div className="algores"><Latex>Coef</Latex></div>
            <h5>{res2.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$3.$$</Latex></div>
            <div className="algores"><Latex>$$\theta$$</Latex></div>
            <h5>{res3.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$4.$$</Latex></div>
            <div className="algores"><Latex>$$\Delta h$$</Latex></div>
            <h5>{res4.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$5.$$</Latex></div>
            <div className="algores"><Latex>$$R_d (p, \Delta h, w)$$</Latex></div>
            <h5>{res5.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$6.$$</Latex></div>
            <div className="algores"><Latex>$$R_c$$</Latex></div>
            <h5>{res6.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$7.$$</Latex></div>
            <div className="algores"><Latex>$$Lgap$$</Latex></div>
            <h5>{res7.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$8.$$</Latex></div>
            <div className="algores"><Latex>$$q_m$$</Latex></div>
            <h5>{res8.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$9.$$</Latex></div>
            <div className="algores"><Latex>qq (x)</Latex></div>
            <h5>{res9.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$10.$$</Latex></div>
            <div className="algores"><Latex>xA</Latex></div>
            <h5>{res10.current}</h5>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$11.$$</Latex></div>
            <div className="algores"><Latex>$$y_i$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent11")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$12.$$</Latex></div>
            <div className="algores"><Latex>$$J_i$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent12")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$13.$$</Latex></div>
            <div className="algores"><Latex>$$\delta Df_i$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent13")}>Показать массив</button>
            </div>
          </div>
          <div className="rescell">
            <div className="algonum"><Latex>$$14.$$</Latex></div>
            <div className="algores"><Latex>$$Mrs_i$$</Latex></div>
            <div className="resarea">
              <button className="showres" onClick={() => handleShowModal(".modalcontent14")}>Показать массив</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal" onClick={e => handleHideModal(e)} style={{display: "none"}}>
        <div className="modalcontent11" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res11} style={{height: "200px", width: "600px", resize: "none"}}></textarea>
        </div>
        <div className="modalcontent12" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res12} style={{height: "400px", width: "800px", resize: "none"}}></textarea>
        </div>
        <div className="modalcontent13" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res13} style={{height: "400px", width: "800px", resize: "none"}}></textarea>
        </div>
        <div className="modalcontent14" onClick={e => e.stopPropagation()} style={{display: "none"}}>
          <textarea ref={res14} style={{height: "400px", width: "800px", resize: "none"}}></textarea>
        </div>
      </div>
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