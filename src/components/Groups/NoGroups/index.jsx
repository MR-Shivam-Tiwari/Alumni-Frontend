import { BsGridFill } from 'react-icons/bs';
import './noGroups.css'
const NoGroups=()=>{
    return(
        <div className='no-groups'>
            <BsGridFill style={{width: '40px', height: '40px'}}/>
            No groups to show
        </div>
    )
}
export default NoGroups;