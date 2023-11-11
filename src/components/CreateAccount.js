import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

  //Initialize state variables for username and password and account visible
  //in a way like javas getter and setters but this one are designed to be manage the state of a component in a declaritve or reactive way. 
  //useState-> allows functional components to manage state , where state is used to store and manage data that can change over time AND 
  //affect how the componet renders 
  //state variables (username,password etc)- used to keep track of data that might change as as the user interacts with the component such as fields in the 
  //login page 
  //(' ') This basically makes it to when the components is renderd it would appear empty 
  //set"x" being any name , just changes/updates the state variables 
function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const navigate = useNavigate(); // Define the navigate function
  const [userId, setUserId] = useState('');


//MODIFY THIS CARL
  const handleCreateAccount = () => {
    if (password === rePassword) {
      // Simulate account creation
      console.log('Account created successfully');

      fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers

      })


      // Simulate automatic login after a delay (e.g., 3 seconds)
      // setTimeout(() => {
      //   // Replace with your actual login logic
      //   // For now, automatically fill in the login fields and trigger login
      //   setUsername('u');
      //   setPassword('p');
      //   handleLogin();
      // }, 3000);
    } else {
      alert('Passwords do not match , Re enter it Dumbass ');
    }
  };

  // //MODIFY THIS CARL 
  // const handleLogin = () => {
  //   // Replace this with your actual login logic
  //   // For now, you can display a message or navigate to the main application
  //   console.log('Simulated login after account creation');
  //   navigate('/main-application');
  // };

  return (
    <div className="create-account-container">
      <h2>Create Account</h2>
      <form>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Re-enter Password:</label>
        <input
          type="password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />

        <button type="button" onClick={handleCreateAccount}>
          Create Account
        </button>
      </form>
    </div>
  );
}

export default CreateAccount;
