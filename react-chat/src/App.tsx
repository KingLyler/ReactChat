import { useEffect } from 'react';
import { ChannelFilters, ChannelSort, User } from 'stream-chat';
import {
  Attachment,
  AttachmentProps,
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

// we'll reuse `useClient` hook from the "Add a Channel List" example
import { useClient } from './hooks/useClient';

import 'stream-chat-react/dist/css/v2/index.css';
import './layout.css';

const userId = 'morning-frost-2';
const userName = 'morning';

const user: User = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
};

const apiKey = 'dz5f4d5kzrue';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibW9ybmluZy1mcm9zdC0yIiwiZXhwIjoxNjk4MDI3ODEwfQ.NZ29YdyEUfakxw7_qnsIyb8LbxySpH_ctAORlq8-jBc';

const sort: ChannelSort = { last_message_at: -1 };
const filters: ChannelFilters = {
  type: 'messaging',
  members: { $in: [userId] },
};

export type CustomAttachmentType = {
  image: string;
  name: string;
  type: string;
  url: string;
};

const attachments: CustomAttachmentType[] = [
  {
    image:
      'https://images-na.ssl-images-amazon.com/images/I/71k0cry-ceL._SL1500_.jpg',
    name: 'iPhone',
    type: 'product',
    url: 'https://goo.gl/ppFmcR',
  },
];

const CustomAttachment = (props: AttachmentProps) => {
  const { attachments } = props;
  const [attachment] = (attachments || []) as CustomAttachmentType[];
  if (attachment?.type === 'product') {
    return (
      <div>
        Product:
        <a href={attachment.url} rel="noreferrer">
          <img alt="custom-attachment" height="100px" src={attachment.image} />
          <br />
          {attachment.name}
        </a>
      </div>
    );
  }

  return <Attachment {...props} />;
};

const App = () => {
  const chatClient = useClient({
    apiKey,
    user,
    tokenOrProvider: userToken, 
  });

  useEffect(() => {
    if (!chatClient) return;

    const initAttachmentMessage = async () => {
      const [channel] = await chatClient.queryChannels(filters, sort);

      await channel.sendMessage({
        text: 'Your selected product is out of stock, would you like to select one of these alternatives?',
        attachments,
      });
    };

    initAttachmentMessage().catch((err) => {
      console.error(`Failed to initialize attachments`, err);
    });
  }, [chatClient]);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme="str-chat__theme-light">
      <ChannelList filters={filters} sort={sort} />
      <Channel Attachment={CustomAttachment}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;