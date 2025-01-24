import animationData from '../animation/access_denied.json'
import Lottie from 'react-lottie';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const AccessDenied = () => (

  <div style={{
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: 'teal',
    color: 'white',
    height: '100%',
    textAlign: 'center',
    padding: '5px',
    
    zIndex: 1000
  }}>
    <Lottie   animationData={animationData} options={defaultOptions}
        height={530}
        width={350}/>

        <p className='playwrite-de-grund text-2xl'>Acess Denied.</p>

    
  </div>
);

export default AccessDenied;





















