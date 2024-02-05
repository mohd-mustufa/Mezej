export const isNextSenderDifferent = (
  messageList,
  currentMessage,
  ind,
  userId
) => {
  return (
    ind < messageList.length &&
    (currentMessage?.sender._id !== messageList[ind + 1]?.sender._id ||
      messageList[ind + 1] === undefined) &&
    currentMessage?.sender._id !== userId
  );
};

export const isSameUser = (messageList, currentMessage, ind) => {
  return (
    ind > 0 && messageList[ind - 1].sender._id === currentMessage.sender._id
  );
};

export const getMarginLeft = (messageList, currentMessage, ind, userId) => {
  if (currentMessage.sender._id === userId) return "0px";

  if (isNextSenderDifferent(messageList, currentMessage, ind, userId)) {
    return "0px";
  } else {
    return "32px";
  }
};
