import styles from './Label.module.css';
import { useUser } from '../../context/UserContext';
import { User } from '../../models/User';

const AdminLabel = () => {
    
    const { user } = useUser();

    return User.isAdmin(user) && <span className={styles.admin}>ADMIN</span>

}

export default AdminLabel;