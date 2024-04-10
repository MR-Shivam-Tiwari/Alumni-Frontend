import './donSpon.css'

const DonSpon = ({title,icon}) => {
    console.log('title' , title)
    return(
        <div style={{width: '100%',backgroundColor: 'beige'}}>
            <div className="don-spon-title">
            {icon}
            {title}
            </div>
           
        </div>
    )
}

export default DonSpon;