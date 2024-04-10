import './pageTitle.css'
const PageTitle = ({ title,icon }) => {
    return (
        <div style={{width: '100%'}}>
            <div className="PageTitle-header">
                {icon}
                {title}
            </div>
        </div>
    )
}

export default PageTitle;