import { Response } from "express";

type ClientMap = {
  [twitchId: string]: Response[];
};

const clients: ClientMap = {};

export const addClient = (twitchId: string, res: Response) => {
  if (!clients[twitchId]) {
    clients[twitchId] = [];
  }
  clients[twitchId].push(res);
};

export const removeClient = (twitchId: string, res: Response) => {
  if (clients[twitchId]) {
    clients[twitchId] = clients[twitchId].filter((c) => c !== res);
    if (clients[twitchId].length === 0) {
      delete clients[twitchId];
    }
  }
};

export const broadcast = (twitchId: string, event: string, data: any) => {
  if (!clients[twitchId]) return;

  for (const client of clients[twitchId]) {
    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
};
