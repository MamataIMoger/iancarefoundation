//frontend/src/types/ConsultRequest.ts
export interface IContactHistory {
  contactedBy: string;
  contactedAt: string | Date;
}

export interface IConsultRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  service_other?: string;
  date?: string;
  mode: string;
  message?: string;
  consent: boolean;
  status: "Pending" | "Accepted" | "Contacted" | "Rejected";
  contactedHistory: IContactHistory[];
  createdAt: string | Date;
}
