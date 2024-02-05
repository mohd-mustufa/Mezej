import {
  getMarginLeft,
  isNextSenderDifferent,
  isSameUser,
} from "../../utils/chatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { useChatState } from "../../context/ChatProvider";
import InfiniteScroll from "react-infinite-scroll-component";

const ScrollableChat = ({ messages }) => {
  const { user } = useChatState();
  return (
    <div style={{ overflowY: "scroll" }}>
      {messages.map((m, i) => (
        <div key={m._id}>
          {isNextSenderDifferent(messages, m, i, user.id) && (
            <>
              <Tooltip
                label={m?.sender?.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt={isSameUser(messages, m, i) ? "4px" : "11px"}
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            </>
          )}
          <span
            style={{
              backgroundColor: `${
                m.sender._id === user.id ? "#BEE3F8" : "#00bfff"
              }`,
              marginLeft: `${getMarginLeft(messages, m, i, user.id)}`,
              marginTop: isSameUser(messages, m, i) ? "3px" : "10px",
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
              display: "inline-block",
            }}
          >
            {m.content}
          </span>
        </div>
      ))}
    </div>
  );
};

// "#BEE3F8" : "#00bfff" : #80dfff
export default ScrollableChat;
