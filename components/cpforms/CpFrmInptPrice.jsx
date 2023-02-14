import { useRef } from 'react';
import css from '@/styles/CpFrmInptPrice.module.css';

export default function CpFrmInptPrice({ title, getVals, action, onCancel }){

  const inptreais = useRef();
  const inptcents = useRef();
  const flotVal = useRef();

  const resetInputs = () => { inptreais.current.value = 0; inptcents.current.value = '00'; flotVal.current = null; }

  const getval = (inpt) =>  !inpt.current.validity.valid ? null : inpt.current.value.replace(/([0]+)([1-9])/, '0$2');

  const validaInputs = () => {
    const reais = getval(inptreais)
    const cents = getval(inptcents)
    flotVal.current = (!reais || !cents) ? null : parseFloat(reais) + parseFloat('0.'+ cents);
    return !!flotVal.current;
  }

  const retVals = (e) => {
    e.preventDefault()
    if (validaInputs()) {
      getVals(flotVal.current, e.target.parentNode);
      // resetInputs();
    }
  }

  const cancelar = (e) => {
    e.preventDefault();
    resetInputs();
    onCancel(e);
  }

  return (
    <>
      <div className={css.price}>
        {!!title && <h4 className={css.title}>{title}</h4>}
        R$ <input type="number" className={css.preco} min={1} max={999999} defaultValue='0' ref={inptreais} required />
        <span>,</span>
        <input type="number" className={css.cents} min='0' max='99' defaultValue='00' ref={inptcents} required/>
        <button className='btncor' onClick={retVals}>{action ?? 'OK'}</button>
        {!!onCancel && <button className='btncor' onClick={cancelar}>CANCELAR</button>}
      </div>
    </>
  )
}
