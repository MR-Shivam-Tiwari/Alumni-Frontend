import Feed from '../../components/Feeed';
import { useSelector } from 'react-redux';


const News = () => {
    const profile = useSelector((state) => state.profile);
    let admin;
  if (profile.profileLevel === 0 || profile.profileLevel === 1) {
    admin = true;
  }

    
  
    return(
        <div>
        {admin? 
        <Feed showCreatePost={true} entityType="news" entityId="id" showDeleteButton={true} />
            :
        <Feed showCreatePost={false} entityType="news" entityId="id" showDeleteButton={true}/>    
    }
        </div>
    )
}

export default News;