import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faClipboardList, faSquareCheck } from '@fortawesome/free-solid-svg-icons';

const Stat = () => {
  return (
    <div className='flex flex-col'>
        <h2>
            <FontAwesomeIcon icon={faListCheck} style={{ marginRight: '10px', color: '#007bff' }} />
            Gestión de Tareas
        </h2>
        <p>Total</p>
        <p>12</p>
    </div>
  )
}

export default Stat