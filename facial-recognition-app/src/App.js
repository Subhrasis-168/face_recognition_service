import { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate.');
  const [visitorName, setVisitorName] = useState('placeholder.jpeg');
  const [isAuth, setAuth] = useState(false);

  function sendImage(e) {
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://9uzhwjpjpl.execute-api.ap-south-1.amazonaws.com/dev/subhrasis-visitor-image-storage/${visitorImageName}.jpeg`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg'
        },
        body: image
    }).then(async () =>{
      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome to work. Hope you have a productive day today!`)
      } else {
         setAuth(false);
         setUploadResultMessage('Authenication Failed: This person is not an employee.')
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('There was an error during the authentication process. Please try again.')
      console.error(error);
    })

    }

    async function authenticate(visitorImageName) {
      const requestUrl = 'https://9uzhwjpjpl.execute-api.ap-south-1.amazonaws.com/dev/employee?' + new URLSearchParams({
        objectKey: `${visitorImageName}.jpeg` 
      });
    
      try {
        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        return await response.json();
      } catch (error) {
        console.error(error);
        return { Message: 'Error during authentication' };
      }
    }
    
  
  return (
    <div className="App">
      <h1>Subhrasis's Facial Recognition System</h1>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])}/>
        <button type='submit'>Authenticate</button>
      </form>
      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
      <img src={ require(`./visitors/${visitorName}`) } alt="Visitor" height={250} width={250}/>
    </div>
  );
}

export default App;
