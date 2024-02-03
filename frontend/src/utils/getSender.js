export const getSender = (loggedInUser, users) => {
  return users && users[0]._id === loggedInUser.id ? users[1] : users[0];
};
