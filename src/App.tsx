import './App.css';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ChangeEvent } from 'react';

function App() {
  const [budget, setBudget] = useState(Number(localStorage.getItem('budget')) || 0.0);
  const [expenses, setExpenses] = useState(Number(localStorage.getItem('expenses')) || 0.0);
  const [limitDate, setLimitDate] = useState(localStorage.getItem('limitDate') || new Date().toISOString().split('T')[0]);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>, setValue: Dispatch<SetStateAction<number>>) => {
    const value = e.target.value;
    const numericValue = parseFloat(value.replace(/\D/g, '') || '0') / 100;
    setValue(numericValue);
  }

  const handleLimitDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const date = new Date(value);
    if (date < new Date()) {
      alert('Data limite não pode ser no passado');
      return;
    }
    setLimitDate(value.split('T')[0]);
  }

  const remainingDays = () => {
    const limit = new Date(limitDate);
    const today = new Date();
    const diff = limit.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  useEffect(() => {
    localStorage.setItem('budget', budget.toString());
    localStorage.setItem('expenses', expenses.toString());
    localStorage.setItem('limitDate', limitDate);
  }, [budget, expenses, limitDate]);

  const remainingDaysValue = remainingDays();

  return (
    <>
      <div className="App">
        <div className="input-field">
          <label htmlFor="budget">Orçamento</label>
          <input
            type="text"
            id="budget"
            placeholder="Apenas números"
            value={`R$${budget.toFixed(2)}`}
            onChange={(e) => handleValueChange(e, setBudget)}
          />
        </div>
        <div className="input-field">
          <label htmlFor="expenses">Já gastei</label>
          <input
            type="text"
            id="expenses"
            placeholder="Apenas números"
            value={`R$${expenses.toFixed(2)}`}
            onChange={(e) => handleValueChange(e, setExpenses)}
          />
        </div>
        <div className='input-field'>
          <label htmlFor="limitDate">Data limite</label>
          <input
            type="date"
            id="limitDate"
            value={limitDate}
            onChange={handleLimitDateChange}
          />
        </div>
        <div className="result">
          <p>Resta(m) <b>{remainingDaysValue}</b> dia(s)</p>
          <p>Valor restante: <b>R${(budget - expenses).toFixed(2)}</b></p>
          <p>Devo gastar em média: <b>R${((budget - expenses) / (remainingDaysValue > 0 ? remainingDaysValue : 1)).toFixed(2)}</b> /dia</p>
        </div>
      </div>
    </>
  )
}

export default App
