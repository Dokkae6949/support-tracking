export interface Student {
  id: string;
  name: string;
  foerderungsbedarf: string;
  status: "aktiv" | "abgeschlossen" | "pausiert";
}

export interface WsMessage {
  type: "update";
  data: Student[];
}
