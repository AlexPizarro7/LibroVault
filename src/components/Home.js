import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //import navigate used for changing "pages" or to redirect 
import backgroundImage from '../images/bookshelf.png'; //import the image 
import CreateAccount from './CreateAccount'; // Import the CreateAccount component
import '../LoginPage.css';


/*"Home Componet is used as the main user interface(the login page) , has the features of log in and create user

*/ 
function Home() {

  //Initialize state variables for username and password and account visible
  //in a way like javas getter and setters but this one are designed to be manage the state of a component in a declaritve or reactive way. 
  //useState-> allows functional components to manage state , where state is used to store and manage data that can change over time AND 
  //affect how the componet renders 
  //state variables (username,password etc)- used to keep track of data that might change as as the user interacts with the component such as fields in the 
  //login page 
  //(' ') This basically makes it to when the components is renderd it would appear empty 
  //set"x" being any name , just changes/updates the state variables 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isCreateAccountVisible, setCreateAccountVisible] = useState(false);
  const navigate = useNavigate();  //used to navigate to the main application 
  const [userId, setUserId] = useState('');
  

  //Just toggles the visibility of the create account form ( when clicked it shows)
  const toggleCreateAccount = () => {
    setCreateAccountVisible(!isCreateAccountVisible);
  };

  //Carl start here refrence the front the end code from erics branch *****************
  const handleLogin = () => {
    fetch(`http://localhost:8080/api/users/validate/${username}/${password}`, {
      method: 'GET',
    })
    .then((response) => {
      if (response.ok) {
        // Fetch the user's userId using the new endpoint
        return fetch(`http://localhost:8080/api/users/getUserId/${username}`, {
          method: 'GET',
        });
      } else {
        throw new Error('Invalid username or password');
      }
    })
    .then((userIdResponse) => userIdResponse.text()) // Assuming the response is just plain text (userId)
    .then((userId) => {
      if (userId) {
        setUserId(userId); // Set the userId
        navigate('/main-application', { state: { userId: userId } }); // Navigate with userId
      } else {
        alert('User ID not found');
      }
    })
    .catch((error) => {
      console.error('Login error:', error);
      alert(error.message);
    });
  };


    //if (username === user.username && password === user.password) {
    //  navigate('/main-application');
    //} else {
    //  alert('Invalid username or password');
    //}
  

 //when styling this div use "home-container"
 //onChange{(e)} username or password  state variable in response to changes in the input field.
  return (
    <div className="home-container">
      {/* Displays the background image*/ }
      <img src={backgroundImage} alt="Background Image" />
       {/* Displays the Title*/ }
      <h1>Welcome to Libro Vault</h1>
       {/*Input field for username*/ }
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
        {/*Input field for password*/ }
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
        {/*Button for loggin calls the handlelogin()*/ }
      <button onClick={handleLogin}>Log In</button>
        {/*Button for creating an account, toggles the visibility of the create account form*/ }
      <button onClick={toggleCreateAccount}>Create Account</button>
        {/*Conditionally render the create account component based on isCreateAccountVisible*/ }
      {isCreateAccountVisible && <CreateAccount />}
    </div>
  );
  
  }
export default Home;
