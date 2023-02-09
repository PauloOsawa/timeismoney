import { useRef } from "react";
import { iLixo } from "../layout/MyIconsSvg";
import css from "@/styles/CpTbMoney.module.css";

export default function CpTbMoney({ title, valores, setaVals, voltar, fecha }){

  // const {gastos} = valores
  // const [vals, setVals] = useState(valores ?? []);

  const pmsg = useRef();
  const inptnome = useRef();
  const selfreq = useRef();
  const inptreais = useRef();
  const inptcents = useRef();
  const chkjuros = useRef();

  // ---------------------------------------------------
  const resetInputs = () => {
    inptnome.current.value = '';
    selfreq.current.selectedIndex = 0;
    inptreais.current.value = 0;
    inptcents.current.value = '00';
  }

  const validaInputs = () => {
    let arvals = [];
    [inptnome, inptreais, inptcents].forEach((inpt, idx) => {
      if (!arvals || !inpt.current.validity.valid) { arvals = null; return; }
      const v = inpt.current.value.replace(/([0]+)([1-9])/, '0$2');
      arvals[idx] = idx !== 2 ? v : '0.'+ v;
    })
    return !arvals ? false : [arvals[0], parseFloat(arvals[1]) + parseFloat(arvals[2])]
  }

  const addVals = (e) => {
    e.preventDefault();
    const arvals = validaInputs();
    if (!arvals || arvals[1] === 0) { console.log('nao validou',  );  return; }
    const freq = selfreq.current.item(selfreq.current.selectedIndex).value;
    const val = {nome: arvals[0], periodo: freq, valor: arvals[1] }
    setaVals([...valores, val]);
    resetInputs();
  }

  const deleta = (idx, e) => {
    e.stopPropagation();
    valores.splice(idx, 1);
    setaVals([...valores]);
  }

  const nextField = (e) => {
    if(!valores.length){
      pmsg.current.textContent = "Adicione Algum Valor para Prosseguir...";
      const tout = setTimeout(() => {
        pmsg.current.textContent = '';
        clearTimeout(tout);
      }, 3000)
      return e.preventDefault();
    }
    return fecha();
  }

  // ---------------------------------------------------
  return (
    <div className={css.dvmoney}>
      <h3>MEUS {title}</h3>
      <p>Adicione Todos os {title} que deseja calcular, seja por dia, mês ou ano!</p>
      <p className={css.pmsg} ref={pmsg}></p>
      <table className={css.tbmoney}>
        <thead>
          <tr><th className={css.desc}>DESCRIÇÃO</th><th className={css.periodo}>PERÍODO</th><th className={css.price}>VALOR</th><th>{iLixo}</th></tr>
        </thead>

        <tbody>
          <tr className={css.trexp}>
            <td className={css.desc}>SEUS {title}</td><td className={css.periodo}>Mensal</td><td className={css.price}>0,00</td><td>{iLixo}</td>
          </tr>
          {valores?.map((v, i) => (
            <tr key={i}>
              <td className={css.desc}>{v.nome}</td>
              <td className={css.periodo}>{v.periodo}</td>
              <td className={css.price}>{v.valor.toFixed(2).replace('.', ',')}</td>
              <td onClick={e => deleta(i, e)}>{iLixo}</td>
            </tr>))
          }
        </tbody>
      </table>

      <div className={css.dvsetvals}>
        <input type="text" className={css.desc} placeholder="Descrição:" pattern="[a-zA-Zçãõáéíú ]{3,30}" ref={inptnome} required />

        <select name="selperiodo" ref={selfreq}>
          <option value="Diário">Diário</option>
          <option value="Mensal">Mensal</option>
          <option value="Anual">Anual</option>
        </select>

        <div className={css.price}>
          R$ <input type="number" className={css.preco} min={1} max={999999} defaultValue='0' ref={inptreais} required />
          <span>,</span>
          <input type="number" className={css.cents} min='0' max='99' defaultValue='00' ref={inptcents} required/>
        </div>

        <div className={css.dvjuros}>
          <label>Juros?</label><input type="checkbox" name="chkjuros" ref={chkjuros}/>
          <input type="text" className={css.inptjuros}  defaultValue={0.5} size={1} pattern={"[0-9]{1,2}(,[0-9]{1,2}){0,1}"} disabled/>

          <select name="seljuros" className={css.seljuros} disabled>
            <option value="mensal">%a.m</option>
            <option value="anual">%a.a</option>
          </select>
        </div>

        <button onClick={addVals} >ADICIONAR</button>
      </div>

      {!!voltar && <button onClick={voltar} className='btncor'>VOLTAR</button>}
      <button onClick={nextField} className='btncor'>PRÓXIMO</button>
    </div>
  )
}