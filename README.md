# Mezej - A chat based communication platform

Mezej is a full-featured chat application developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It provides users with the ability to engage in real-time communication through both one-on-one and group chats. With secure authentication using JSON Web Tokens (JWT), users can create accounts, log in securely, and start chatting with friends, colleagues, or groups.

## Features

- **Real-time Messaging**: Enjoy seamless real-time messaging with friends and groups.
- **Group Chats**: Create and join group chats to communicate with multiple users simultaneously.
- **Secure Authentication**: Authentication system using JSON Web Tokens (JWT) ensures secure login and signup processes.
- **User Profiles**: Customize your profile with avatars and more.
- **Responsive Design**: Mezej is built using Chakra UI and designed to be responsive across various devices, allowing you to chat on devices of all sizes.
- **Message History**: Access your chat history to review past conversations.
- **Notifications**: Get notified instantly when you receive new messages or mentions.

## Technologies Used

- **MongoDB**: NoSQL database for storing user information, chat messages, and more.
- **Express.js**: Backend framework for handling API requests and routing.
- **Node.js**: JavaScript runtime environment for executing server-side code.
- **Socket.io**: Real-time engine for enabling bidirectional communication between clients and the server.
- **JSON Web Tokens (JWT)**: Secure method for transmitting authentication credentials between the client and server.
- **React.js**: Frontend library for building dynamic user interfaces.
- **Chakra UI**: React component library for building accessible and responsive user interfaces.

## Installation

To run Mezej locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mezej.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mezej
   ```

3. Install dependencies for both the client and server:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the `server` directory and add the following variables:

   ```
   PORT=5000
   MONGODB_URI=<your MongoDB connection URI>
   JWT_SECRET=<your JWT secret key>
   ```

5. Start the server:

   ```bash
   cd ../server
   npm start
   ```

6. Start the client:

   ```bash
   cd ../client
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000` to use Mezej.

## Live Demo

Check out the live demo of the website: [Mezej](https://mezej.onrender.com/)

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for any features, bug fixes, or enhancements you'd like to contribute.

---

Feel free to reach out to us with any questions or feedback. Happy chatting with Mezej! 🚀📱💬
