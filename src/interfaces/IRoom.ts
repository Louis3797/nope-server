export interface IRoom {
  id: string;
}

export interface ICreateRoomOptions {
  id: string; // id of the player that creates the room
  roomSize: number;
  private?: boolean;
}

export interface IJoinRoomOptions {
  roomId: string;
  playerId: string;
}
